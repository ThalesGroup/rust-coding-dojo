const test = require('node:test')
const assert = require('node:assert/strict')
const path = require('path')

const {
  parseKatasTree,
  extractTestBlocks,
} = require('./parse-katas.cjs')

const ROOT = path.resolve(__dirname, '..', '..')
const KATAS_DIR = path.join(ROOT, 'katas')

test('extractTestBlocks returns cfg(test) Rust blocks', () => {
  const source = `fn main() {}\n\n#[cfg(test)]\nmod tests {\n  #[test]\n  fn it_works() {\n    assert_eq!(2 + 2, 4);\n  }\n}`
  const blocks = extractTestBlocks(source)

  assert.equal(blocks.length, 1)
  assert.match(blocks[0], /mod tests/)
  assert.match(blocks[0], /it_works/)
})

test('parseKatasTree emits schema expected by issue 23', () => {
  const parsed = parseKatasTree(KATAS_DIR)
  assert.ok(parsed.length > 0)

  const roman = parsed.find(k => k.package === 'roman-numerals')
  assert.ok(roman, 'roman-numerals kata should be present')

  assert.equal(typeof roman.id, 'string')
  assert.equal(typeof roman.title, 'string')
  assert.equal(typeof roman.package, 'string')
  assert.equal(typeof roman.level, 'string')
  assert.equal(typeof roman.difficulty, 'string')
  assert.equal(typeof roman.readme, 'string')
  assert.ok(Array.isArray(roman.exercises))
  assert.ok(Array.isArray(roman.solutions))
  assert.ok(roman.exercises.length > 0)

  const mainExercise = roman.exercises.find(e => e.name === 'main.rs')
  assert.ok(mainExercise)
  assert.equal(typeof mainExercise.code, 'string')
  assert.ok(Array.isArray(mainExercise.tests))
  assert.ok(mainExercise.tests.length > 0)
})
