import { openDB, type IDBPDatabase } from 'idb'
import type { UserProgress } from '../types'

const DB_NAME = 'rust-dojo'
const DB_VERSION = 1
const STORE = 'progress'
const LS_KEY = 'rust-dojo-progress'

export const EMPTY_PROGRESS: UserProgress = {
  firstName: '',
  xp: 0,
  level: 1,
  streak: 0,
  lastPlayDate: '',
  katasCompleted: [],
  badges: [],
  questsProgress: {},
  conceptMastery: {
    ownership: 0, borrowing: 0, lifetimes: 0, structs: 0,
    traits: 0, generics: 0, concurrency: 0, macros: 0, unsafe: 0, bases: 0
  },
  xpHistory: [],
  currentKataId: 'kata-01-starter-00-rustward-sword',
  graalUnlocked: false
}

let db: IDBPDatabase | null = null

async function getDB() {
  if (db) return db
  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE)) {
        database.createObjectStore(STORE)
      }
    }
  })
  return db
}

export async function loadProgress(): Promise<UserProgress> {
  let saved: Record<string, unknown> | null = null
  try {
    const database = await getDB()
    const data = await database.get(STORE, 'progress')
    if (data) saved = data
  } catch {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) saved = JSON.parse(raw) as Record<string, unknown>
    } catch { /* ignore */ }
  }
  if (!saved) return { ...EMPTY_PROGRESS }
  return { ...EMPTY_PROGRESS, ...saved }
}

export async function saveProgress(progress: UserProgress): Promise<void> {
  try {
    const database = await getDB()
    await database.put(STORE, progress, 'progress')
  } catch { /* ignore */ }
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(progress))
  } catch { /* ignore */ }
}

export function getLevelFromXP(xp: number): number {
  // Chaque niveau = 200*level XP de plus
  let level = 1
  let threshold = 200
  let total = 0
  while (total + threshold <= xp) {
    total += threshold
    level++
    threshold += 200
  }
  return level
}

export function getXPThresholdForLevel(level: number): number {
  return level * 200
}

export function getXPProgressInLevel(xp: number): { current: number; total: number; pct: number } {
  let level = 1
  let threshold = 200
  let total = 0
  while (total + threshold <= xp) {
    total += threshold
    level++
    threshold += 200
  }
  const current = xp - total
  return { current, total: threshold, pct: Math.round((current / threshold) * 100) }
}

export function updateStreak(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().slice(0, 10)
  const last = progress.lastPlayDate
  if (last === today) return progress
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const newStreak = last === yesterday ? progress.streak + 1 : 1
  return { ...progress, streak: newStreak, lastPlayDate: today }
}
