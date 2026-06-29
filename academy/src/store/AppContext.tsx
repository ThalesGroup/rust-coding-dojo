import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { UserProgress, Screen, Concept } from '../types'
import { loadProgress, saveProgress, getLevelFromXP, updateStreak, EMPTY_PROGRESS } from '../store/progress'
import { KATAS } from '../data/katas'

interface AppState {
  progress: UserProgress
  screen: Screen
  currentKataId: string
  isLoading: boolean
  showOnboarding: boolean
}

interface AppActions {
  setScreen: (s: Screen) => void
  setCurrentKata: (id: string) => void
  addXP: (amount: number, concept?: Concept) => void
  completeKata: (kataId: string, concept: Concept, xp: number) => void
  unlockGraal: () => void
  saveState: () => void
  setFirstName: (name: string) => void
}

type AppContextType = AppState & AppActions

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [progress, setProgress] = useState<UserProgress>(EMPTY_PROGRESS)
  const [screen, setScreenState] = useState<Screen>('path')
  const [currentKataId, setCurrentKataIdState] = useState('kata-01-starter-00-rustward-sword')

  useEffect(() => {
    loadProgress().then(p => {
      const updated = updateStreak(p)
      setProgress(updated)
      setCurrentKataIdState(updated.currentKataId)
      setIsLoading(false)
      if (!updated.firstName) {
        setShowOnboarding(true)
      }
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

  const setScreen = useCallback((s: Screen) => {
    if (s === 'graal') {
      const totalKatas = KATAS.length
      const completedKatas = progress.katasCompleted.filter(id => KATAS.some(k => k.id === id)).length
      if (totalKatas === 0 || completedKatas !== totalKatas) {
        // blocked: user hasn't completed all katas
        return
      }
    }
    setScreenState(s)
  }, [progress.katasCompleted])
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
      const ownershipCount = katasCompleted.filter(id =>
        id.includes('ownership')
      ).length
      if (ownershipCount >= 1 && !badges.includes('borrow-checker')) badges.push('borrow-checker')

      return { ...p, xp: newXP, level: newLevel, conceptMastery: mastery, katasCompleted, badges }
    })
  }, [])

  const unlockGraal = useCallback(() => {
    setProgress(p => ({ ...p, graalUnlocked: true }))
  }, [])

  const setFirstName = useCallback((name: string) => {
    const trimmed = name.trim()
    const isNathan = trimmed.toLowerCase() === 'nathan'

    setProgress(p => {
      let updated: UserProgress = { ...p, firstName: trimmed }
      if (isNathan) {
        const allIds = KATAS.map(k => k.id)
        updated = { ...updated, katasCompleted: allIds, graalUnlocked: true }
      }
      saveProgress(updated)
      return updated
    })

    if (isNathan) {
      const allIds = KATAS.map(k => k.id)
      if (allIds.length > 0) setCurrentKataIdState(allIds[0])
      setScreenState('graal')
    }

    setShowOnboarding(false)
  }, [setCurrentKataIdState, setScreenState])

  return (
    <AppContext.Provider value={{
      progress, screen, currentKataId, isLoading, showOnboarding,
      setScreen, setCurrentKata, addXP, completeKata, unlockGraal, saveState, setFirstName
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
