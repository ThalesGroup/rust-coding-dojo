import type { Badge, Quest, SkillNode } from '../types'

export const BADGES: Badge[] = [
  { id: 'borrow-checker', icon: '🛡️', name: 'Borrow Checker', description: 'Complète 5 katas d\'ownership', unlocked: true, color: '#3d9bff', glowColor: 'rgba(61,155,255,.35)' },
  { id: 'no-panic', icon: '🚫', name: 'No Panic!', description: 'Complète 3 katas sans utiliser unwrap()', unlocked: true, color: '#34c46e', glowColor: 'rgba(74,222,128,.35)' },
  { id: 'zero-cost', icon: '⚡', name: 'Zero-Cost', description: 'Résous un kata sans aucune allocation', unlocked: true, color: '#f0a830', glowColor: 'rgba(255,194,75,.3)' },
  { id: 'lifetime-master', icon: '⏳', name: 'Lifetime Master', description: 'Maîtrise les annotations de lifetime', unlocked: false, color: '#7c5cf0', glowColor: 'rgba(124,92,240,.3)' },
  { id: 'trait-wizard', icon: '🧙', name: 'Trait Wizard', description: 'Implémente 5 traits différents', unlocked: false, color: '#e040fb', glowColor: 'rgba(224,64,251,.25)' },
  { id: 'ferrous', icon: '🦀', name: 'Ferrous', description: 'Atteins le niveau 10', unlocked: false, color: '#e0552a', glowColor: 'rgba(224,85,42,.3)' }
]

export const QUESTS: Quest[] = [
  { id: 'no-clone-3', title: 'Zero Clone', description: 'Résous 1 kata sans .clone()', xpReward: 120, progress: 0, target: 1, completed: false },
  { id: 'lifetime-5', title: 'Time Lord', description: 'Corrige les lifetime errors', xpReward: 200, progress: 0, target: 1, completed: false },
  { id: 'streak-7', title: 'Acier trempé', description: '7 jours consécutifs', xpReward: 150, progress: 7, target: 7, completed: true },
  { id: 'own-full', title: 'Maître Propriétaire', description: 'Complète le kata Ownership', xpReward: 300, progress: 0, target: 1, completed: false }
]

export const SKILL_NODES: SkillNode[] = [
  { id: 'bases', name: 'Les bases', icon: '⚙️', unlocked: true, katasCompleted: 3, katasTotal: 3, x: 280, y: 8, size: 62, color: '#3d9bff', description: "Variables, types, fonctions et contrôle de flux. Les fondations avant de plonger dans l'ownership.", children: ['ownership', 'structs'] },
  { id: 'ownership', name: 'Ownership', icon: '🔑', unlocked: true, katasCompleted: 0, katasTotal: 1, x: 120, y: 96, size: 58, color: '#3d9bff', description: "Chaque valeur a un unique propriétaire. Quand il sort du scope, la valeur est libérée. Le cœur de la sûreté mémoire de Rust.", children: ['lifetimes', 'structs'] },
  { id: 'structs', name: 'Structs', icon: '📦', unlocked: true, katasCompleted: 0, katasTotal: 2, x: 440, y: 96, size: 58, color: '#3d9bff', description: "Regroupe des données liées. Méthodes via impl. Base des types personnalisés et des traits.", children: ['traits', 'generics'] },
  { id: 'lifetimes', name: 'Lifetimes', icon: '⏳', unlocked: false, katasCompleted: 0, katasTotal: 1, x: 50, y: 188, size: 56, color: '#7f9cc4', description: "Annotations qui garantissent qu'une référence ne survit pas à la donnée qu'elle pointe.", children: ['traits'] },
  { id: 'borrowing', name: 'Borrowing', icon: '🤝', unlocked: false, katasCompleted: 0, katasTotal: 1, x: 200, y: 188, size: 56, color: '#7f9cc4', description: "Emprunte une valeur via une référence (&) sans en prendre la possession.", children: ['concurrency'] },
  { id: 'traits', name: 'Traits', icon: '🔒', unlocked: false, katasCompleted: 0, katasTotal: 1, x: 50, y: 280, size: 54, color: '#7f9cc4', description: "Les interfaces de Rust. Définit des comportements partagés.", children: ['macros'] },
  { id: 'concurrency', name: 'Concurrence', icon: '🔒', unlocked: false, katasCompleted: 0, katasTotal: 1, x: 440, y: 280, size: 54, color: '#7f9cc4', description: "Threads, Arc, Mutex, channels.", children: ['macros'] },
  { id: 'macros', name: 'Macros', icon: '🔒', unlocked: false, katasCompleted: 0, katasTotal: 1, x: 265, y: 356, size: 54, color: '#7f9cc4', description: "Méta-programmation : génère du code à la compilation.", children: [] },
  { id: 'generics', name: 'Génériques', icon: '🔒', unlocked: false, katasCompleted: 0, katasTotal: 1, x: 330, y: 188, size: 50, color: '#7f9cc4', description: "Paramétrise les types et fonctions.", children: [] },
  { id: 'unsafe', name: 'Unsafe', icon: '🔒', unlocked: false, katasCompleted: 0, katasTotal: 1, x: 370, y: 280, size: 48, color: '#7f9cc4', description: "Pointeurs bruts, FFI, opérations non vérifiées.", children: [] }
]

export const GRAAL_CHAPTERS = [
  { title: 'Ownership & Borrowing', sub: '11 katas · maîtrisé', done: true },
  { title: 'Lifetimes', sub: '5 katas · en cours', done: false },
  { title: 'Traits & Génériques', sub: '12 katas · verrouillé', done: false },
  { title: 'Concurrence', sub: '6 katas · verrouillé', done: false },
  { title: 'Macros & Unsafe', sub: '8 katas · verrouillé', done: false }
]
