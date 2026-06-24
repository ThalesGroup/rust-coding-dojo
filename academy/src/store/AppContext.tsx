import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { UserProgress, Screen, Concept } from '../types'
import { loadProgress, saveProgress, getLevelFromXP, updateStreak } from '../store/progress'

interface AppState {
  progress: UserProgress
  screen: Screen
  currentKataId: string
  isLoading: boolean
}

interface AppActions {
  setScreen: (s: Screen) => void
  setCurrentKata: (id: string) => void
  addXP: (amount: number, concept?: Concept) => void
  completeKata: (kataId: string, concept: Concept, xp: number) => void
  unlockGraal: () => void
  saveState: () => void
}

type AppContextType = AppState & AppActions

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState<UserProgress>({
    xp: 1240,
    level: 6,
    streak: 7,
    lastPlayDate: new Date().toISOString().slice(0, 10),
    katasCompleted: [],
    badges: ['borrow-checker', 'no-panic', 'zero-cost'],
    questsProgress: {},
    conceptMastery: {
      ownership: 95, borrowing: 88, lifetimes: 42, structs: 100,
      traits: 18, generics: 10, concurrency: 0, macros: 0, unsafe: 0, bases: 100
    },
    xpHistory: [],
    currentKataId: 'kata-12',
    graalUnlocked: false
  })
  const [screen, setScreenState] = useState<Screen>('kata')
  const [currentKataId, setCurrentKataIdState] = useState('kata-12')

  useEffect(() => {
    loadProgress().then(p => {
      const updated = updateStreak(p)
      setProgress(updated)
      setCurrentKataIdState(updated.currentKataId)
      setIsLoading(false)
    })
  }, [])

  const saveState = useCallback(() => {
    saveProgress(progress)
  }, [progress])

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => saveProgress(progress), 500)
      return () => clearTimeout(timer)
    }
  }, [progress, isLoading])

  const setScreen = useCallback((s: Screen) => setScreenState(s), [])
  const setCurrentKata = useCallback((id: string) => {
    setCurrentKataIdState(id)
    setProgress(p => ({ ...p, currentKataId: id }))
  }, [])

  const addXP = useCallback((amount: number, concept?: Concept) => {
    setProgress(p => {
      const newXP = p.xp + amount
      const newLevel = getLevelFromXP(newXP)
      const today = new Date().toISOString().slice(0, 10)
      const history = [...p.xpHistory]
      const todayEntry = history.find(e => e.date === today)
      if (todayEntry) todayEntry.xp += amount
      else history.push({ date: today, xp: amount })

      const mastery = { ...p.conceptMastery }
      if (concept && mastery[concept] !== undefined) {
        mastery[concept] = Math.min(100, mastery[concept] + Math.round(amount / 10))
      }
      return { ...p, xp: newXP, level: newLevel, xpHistory: history, conceptMastery: mastery }
    })
  }, [])

  const completeKata = useCallback((kataId: string, concept: Concept, xp: number) => {
    setProgress(p => {
      if (p.katasCompleted.includes(kataId)) return p
      const newXP = p.xp + xp
      const newLevel = getLevelFromXP(newXP)
      const mastery = { ...p.conceptMastery }
      if (mastery[concept] !== undefined) {
        mastery[concept] = Math.min(100, mastery[concept] + Math.round(xp / 5))
      }
      const katasCompleted = [...p.katasCompleted, kataId]
      // Badge checks
      const badges = [...p.badges]
      const ownershipCount = katasCompleted.filter(id => {
        const k = id // simplified
        return k.startsWith('kata-0') || k === 'kata-12'
      }).length
      if (ownershipCount >= 5 && !badges.includes('borrow-checker')) badges.push('borrow-checker')

      return { ...p, xp: newXP, level: newLevel, conceptMastery: mastery, katasCompleted, badges }
    })
  }, [])

  const unlockGraal = useCallback(() => {
    setProgress(p => ({ ...p, graalUnlocked: true }))
  }, [])

  return (
    <AppContext.Provider value={{
      progress, screen, currentKataId, isLoading,
      setScreen, setCurrentKata, addXP, completeKata, unlockGraal, saveState
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
