import { describe, expect, test } from 'vitest'
import { KATAS, getKataById, getKatasByConceptName } from './katas'

describe('katas data access', () => {
  test('returns a kata by id', () => {
    const first = KATAS[0]
    expect(first).toBeDefined()
    expect(getKataById(first.id)?.id).toBe(first.id)
  })

  test('returns undefined for unknown kata id', () => {
    expect(getKataById('kata-does-not-exist')).toBeUndefined()
  })

  test('returns only katas of the requested concept', () => {
    const bases = getKatasByConceptName('bases')
    expect(bases.length).toBeGreaterThan(0)
    expect(bases.every(kata => kata.concept === 'bases')).toBe(true)
  })
})
