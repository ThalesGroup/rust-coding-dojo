import { describe, expect, test } from 'vitest'
import { BADGES, QUESTS, SKILL_NODES } from './gamification'

describe('gamification data', () => {
  test('contains non-empty catalog data', () => {
    expect(BADGES.length).toBeGreaterThan(0)
    expect(QUESTS.length).toBeGreaterThan(0)
    expect(SKILL_NODES.length).toBeGreaterThan(0)
  })

  test('has unique skill node ids', () => {
    const ids = SKILL_NODES.map(node => node.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('ensures each skill node has non-negative progress bounds', () => {
    expect(
      SKILL_NODES.every(node => node.katasCompleted >= 0 && node.katasTotal >= node.katasCompleted)
    ).toBe(true)
  })
})
