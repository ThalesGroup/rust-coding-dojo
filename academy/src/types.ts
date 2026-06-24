// Types globaux de l'application Rust Dojo

export type Screen = 'kata' | 'tree' | 'path' | 'dash' | 'profile' | 'graal'

export type Difficulty = 'facile' | 'moyen' | 'difficile' | 'expert'

export type Concept =
  | 'ownership'
  | 'borrowing'
  | 'lifetimes'
  | 'structs'
  | 'traits'
  | 'generics'
  | 'concurrency'
  | 'macros'
  | 'unsafe'
  | 'bases'

export interface KataTest {
  name: string
  // Pattern regex testé sur le code source
  check: (code: string) => boolean
  description: string
}

export interface Kata {
  id: string
  title: string
  titleEn: string
  number: number
  total: number
  difficulty: Difficulty
  concept: Concept
  xpReward: number
  description: string // HTML-safe
  starterCode: string
  hints: string[]
  tests: KataTest[]
  solutionCode: string
  mirView?: string
}

export interface Badge {
  id: string
  icon: string
  name: string
  description: string
  unlocked: boolean
  color: string
  glowColor: string
}

export interface Quest {
  id: string
  title: string
  description: string
  xpReward: number
  progress: number
  target: number
  completed: boolean
}

export interface SkillNode {
  id: Concept
  name: string
  icon: string
  unlocked: boolean
  katasCompleted: number
  katasTotal: number
  x: number
  y: number
  size: number
  color: string
  description: string
  children: Concept[]
}

export interface ChatMessage {
  role: 'ferris' | 'user' | 'hint' | 'review' | 'system'
  text: string
  timestamp: number
}

export interface XPEntry {
  date: string // YYYY-MM-DD
  xp: number
}

export interface UserProgress {
  firstName: string
  xp: number
  level: number
  streak: number
  lastPlayDate: string
  katasCompleted: string[] // kata ids
  badges: string[] // badge ids
  questsProgress: Record<string, number>
  conceptMastery: Record<Concept, number> // 0-100
  xpHistory: XPEntry[]
  currentKataId: string
  graalUnlocked: boolean
}
