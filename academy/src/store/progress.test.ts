import { afterEach, describe, expect, test, vi } from 'vitest'
import { EMPTY_PROGRESS, getLevelFromXP, getXPProgressInLevel, getXPThresholdForLevel, updateStreak } from './progress'

describe('progress helpers', () => {
  test('computes level from XP thresholds', () => {
    expect(getLevelFromXP(0)).toBe(1)
    expect(getLevelFromXP(199)).toBe(1)
    expect(getLevelFromXP(200)).toBe(2)
    expect(getLevelFromXP(599)).toBe(2)
    expect(getLevelFromXP(600)).toBe(3)
  })

  test('computes in-level progress values', () => {
    expect(getXPProgressInLevel(0)).toEqual({ current: 0, total: 200, pct: 0 })
    expect(getXPProgressInLevel(200)).toEqual({ current: 0, total: 400, pct: 0 })
    expect(getXPProgressInLevel(300)).toEqual({ current: 100, total: 400, pct: 25 })
  })

  test('returns XP threshold for a level', () => {
    expect(getXPThresholdForLevel(1)).toBe(200)
    expect(getXPThresholdForLevel(5)).toBe(1000)
  })

  test('updates streak based on last play date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-24T10:00:00Z'))

    const firstPlay = updateStreak({ ...EMPTY_PROGRESS, lastPlayDate: '' })
    expect(firstPlay.streak).toBe(1)
    expect(firstPlay.lastPlayDate).toBe('2026-06-24')

    const sameDay = updateStreak({ ...firstPlay, streak: 3 })
    expect(sameDay.streak).toBe(3)

    const yesterdayPlay = updateStreak({ ...EMPTY_PROGRESS, streak: 4, lastPlayDate: '2026-06-23' })
    expect(yesterdayPlay.streak).toBe(5)
  })
})

afterEach(() => {
  vi.useRealTimers()
})
