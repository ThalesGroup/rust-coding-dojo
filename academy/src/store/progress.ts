import { openDB, type IDBPDatabase } from 'idb'
import type { UserProgress, XPEntry } from '../types'

const DB_NAME = 'rust-dojo'
const DB_VERSION = 1
const STORE = 'progress'
const LS_KEY = 'rust-dojo-progress'

const DEFAULT_PROGRESS: UserProgress = {
  xp: 1240,
  level: 6,
  streak: 7,
  lastPlayDate: new Date().toISOString().slice(0, 10),
  katasCompleted: ['kata-01', 'kata-02', 'kata-03', 'kata-04', 'kata-05', 'kata-06',
                   'kata-07', 'kata-08', 'kata-09', 'kata-10', 'kata-11'],
  badges: ['borrow-checker', 'no-panic', 'zero-cost'],
  questsProgress: { 'no-clone-3': 2, 'lifetime-5': 0 },
  conceptMastery: {
    ownership: 95,
    borrowing: 88,
    lifetimes: 42,
    structs: 100,
    traits: 18,
    generics: 10,
    concurrency: 0,
    macros: 0,
    unsafe: 0,
    bases: 100
  },
  xpHistory: buildDefaultXPHistory(),
  currentKataId: 'kata-12',
  graalUnlocked: false
}

function buildDefaultXPHistory(): XPEntry[] {
  const entries: XPEntry[] = []
  const now = new Date()
  const vals = [120, 80, 140, 200, 60, 180, 240]
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    entries.push({ date: d.toISOString().slice(0, 10), xp: vals[6 - i] })
  }
  return entries
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
  try {
    const database = await getDB()
    const saved = await database.get(STORE, 'progress')
    if (saved) return { ...DEFAULT_PROGRESS, ...saved }
  } catch {
    // fallback to localStorage
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) }
    } catch { /* ignore */ }
  }
  return { ...DEFAULT_PROGRESS }
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
