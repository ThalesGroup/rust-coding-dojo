import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
const scriptPath = fileURLToPath(new URL('../tools/parse-katas.cjs', import.meta.url))

const result = spawnSync(process.execPath, [scriptPath, ...args], { stdio: 'inherit' })
if (typeof result.status === 'number') {
  process.exit(result.status)
}
process.exit(1)
