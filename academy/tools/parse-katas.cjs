const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..', '..')
const DEFAULT_KATAS_DIR = path.join(ROOT, 'katas')
const DEFAULT_OUT_FILE = path.resolve(__dirname, '..', 'src', 'data', 'katas.json')

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return ''
  }
}

function toPosix(relPath) {
  return relPath.replace(/\\/g, '/')
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function detectLevel(relativeKataPath) {
  const first = relativeKataPath.split('/')[0] || ''
  if (first.includes('starter')) return 'starter'
  if (first.includes('structure')) return 'structure'
  if (first.includes('advanced')) return 'advanced'
  if (first.includes('setup')) return 'setup'
  return first || 'unknown'
}

function detectDifficulty(readme, level) {
  const m = readme.match(/^##\s+Level\s*\/\s*Duration\s*\n+([^\n]+)/im)
  const levelLine = (m && m[1] ? m[1] : '').toLowerCase()

  if (levelLine.includes('beginner')) return 'beginner'
  if (levelLine.includes('intermediate')) return 'intermediate'
  if (levelLine.includes('expert')) return 'expert'

  if (level === 'setup') return 'beginner'
  if (level === 'starter') return 'beginner'
  if (level === 'structure') return 'intermediate'
  if (level === 'advanced') return 'expert'
  return 'unknown'
}

function parseTitle(readme, fallbackDirName) {
  const match = readme.match(/^#\s+(.+)$/m)
  return (match && match[1] ? match[1] : fallbackDirName).trim()
}

function extractTestBlocks(rustSource) {
  const blocks = []
  const marker = '#[cfg(test)]'
  let idx = 0

  while (idx < rustSource.length) {
    const markerIndex = rustSource.indexOf(marker, idx)
    if (markerIndex === -1) break

    const modIndex = rustSource.indexOf('mod ', markerIndex)
    if (modIndex === -1) break

    const braceStart = rustSource.indexOf('{', modIndex)
    if (braceStart === -1) break

    let depth = 0
    let end = braceStart
    for (; end < rustSource.length; end += 1) {
      const ch = rustSource[end]
      if (ch === '{') depth += 1
      if (ch === '}') {
        depth -= 1
        if (depth === 0) {
          end += 1
          break
        }
      }
    }

    const block = rustSource.slice(markerIndex, end).trim()
    if (block) blocks.push(block)

    idx = end
  }

  return blocks
}

function listRustFilesRecursive(baseDir) {
  if (!fs.existsSync(baseDir)) return []

  const files = []

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.rs')) {
        files.push(fullPath)
      }
    }
  }

  walk(baseDir)
  files.sort((a, b) => a.localeCompare(b))
  return files
}

function parseKataDirectory(katasDir, kataDirPath) {
  const rel = toPosix(path.relative(katasDir, kataDirPath))
  const readmePath = path.join(kataDirPath, 'README.md')
  const cargoPath = path.join(kataDirPath, 'Cargo.toml')

  const readme = readFileSafe(readmePath)
  if (!readme) return null

  const cargo = readFileSafe(cargoPath)
  const cargoPackage = cargo.match(/^name\s*=\s*"([^"]+)"/m)
  const packageName = cargoPackage && cargoPackage[1] ? cargoPackage[1] : path.basename(kataDirPath)

  const level = detectLevel(rel)
  const title = parseTitle(readme, path.basename(kataDirPath))
  const difficulty = detectDifficulty(readme, level)

  const srcDir = path.join(kataDirPath, 'src')
  const solutionDir = path.join(kataDirPath, 'solutions')
  const srcFiles = listRustFilesRecursive(srcDir)
  const solutionFiles = listRustFilesRecursive(solutionDir)

  const exercises = srcFiles.map(filePath => {
    const code = readFileSafe(filePath)
    return {
      name: toPosix(path.relative(srcDir, filePath)),
      code,
      tests: extractTestBlocks(code),
    }
  })

  const solutions = solutionFiles.map(filePath => ({
    name: toPosix(path.relative(solutionDir, filePath)),
    code: readFileSafe(filePath),
  }))

  return {
    id: slugify(rel),
    title,
    package: packageName,
    level,
    difficulty,
    readme,
    exercises,
    solutions,
  }
}

function parseKatasTree(katasDir = DEFAULT_KATAS_DIR) {
  if (!fs.existsSync(katasDir)) return []

  const kataDirs = []

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
    const hasReadme = entries.some(entry => entry.isFile() && entry.name === 'README.md')
    const hasCargo = entries.some(entry => entry.isFile() && entry.name === 'Cargo.toml')
    const hasSrc = entries.some(entry => entry.isDirectory() && entry.name === 'src')

    if (hasReadme && hasCargo && hasSrc) {
      kataDirs.push(currentDir)
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(currentDir, entry.name))
      }
    }
  }

  walk(katasDir)
  kataDirs.sort((a, b) => a.localeCompare(b))

  return kataDirs
    .map(kataDir => parseKataDirectory(katasDir, kataDir))
    .filter(Boolean)
}

function writeKatasJson(outFile, katas) {
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  const payload = {
    generatedAt: new Date().toISOString(),
    count: katas.length,
    katas,
  }
  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2) + '\n', 'utf8')
}

function generate({ katasDir = DEFAULT_KATAS_DIR, outFile = DEFAULT_OUT_FILE } = {}) {
  const katas = parseKatasTree(katasDir)
  writeKatasJson(outFile, katas)
  return { count: katas.length, outFile }
}

function parseArgs(argv) {
  const options = {
    watch: false,
    outFile: DEFAULT_OUT_FILE,
    katasDir: DEFAULT_KATAS_DIR,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--watch') {
      options.watch = true
    } else if (arg === '--out') {
      options.outFile = path.resolve(argv[i + 1])
      i += 1
    } else if (arg === '--katas-dir') {
      options.katasDir = path.resolve(argv[i + 1])
      i += 1
    }
  }

  return options
}

function watchAndGenerate(options) {
  let timer = null

  const run = () => {
    try {
      const result = generate(options)
      console.log(`[parse-katas] generated ${result.count} katas -> ${result.outFile}`)
    } catch (error) {
      console.error('[parse-katas] generation failed:', error && error.message ? error.message : error)
    }
  }

  run()
  console.log(`[parse-katas] watching ${options.katasDir}`)

  fs.watch(options.katasDir, { recursive: true }, (_eventType, filename) => {
    if (!filename) return
    if (!/\.(md|toml|rs)$/i.test(filename)) return
    clearTimeout(timer)
    timer = setTimeout(run, 120)
  })
}

if (require.main === module) {
  const options = parseArgs(process.argv.slice(2))
  if (options.watch) {
    watchAndGenerate(options)
  } else {
    const result = generate(options)
    console.log(`[parse-katas] generated ${result.count} katas -> ${result.outFile}`)
  }
}

module.exports = {
  parseKatasTree,
  extractTestBlocks,
  generate,
}
