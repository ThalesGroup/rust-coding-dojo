import type { Badge, Quest, SkillNode } from '../types'

export const BADGES: Badge[] = [
  { id: 'borrow-checker', icon: '🛡️', name: 'Borrow Checker', description: 'Complete 5 ownership katas', unlocked: true, color: '#3d9bff', glowColor: 'rgba(61,155,255,.35)' },
  { id: 'no-panic', icon: '🚫', name: 'No Panic!', description: 'Complete 3 katas without using unwrap()', unlocked: true, color: '#34c46e', glowColor: 'rgba(74,222,128,.35)' },
  { id: 'zero-cost', icon: '⚡', name: 'Zero-Cost', description: 'Solve a kata without any allocation', unlocked: true, color: '#f0a830', glowColor: 'rgba(255,194,75,.3)' },
  { id: 'lifetime-master', icon: '⏳', name: 'Lifetime Master', description: 'Master lifetime annotations', unlocked: false, color: '#7c5cf0', glowColor: 'rgba(124,92,240,.3)' },
  { id: 'trait-wizard', icon: '🧙', name: 'Trait Wizard', description: 'Implement 5 different traits', unlocked: false, color: '#e040fb', glowColor: 'rgba(224,64,251,.25)' },
  { id: 'ferrous', icon: '🦀', name: 'Ferrous', description: 'Reach level 10', unlocked: false, color: '#e0552a', glowColor: 'rgba(224,85,42,.3)' }
]

export const QUESTS: Quest[] = [
  { id: 'no-clone-3', title: 'Zero Clone', description: 'Solve 1 kata without .clone()', xpReward: 120, progress: 0, target: 1, completed: false },
  { id: 'lifetime-5', title: 'Time Lord', description: 'Fix the lifetime errors', xpReward: 200, progress: 0, target: 1, completed: false },
  { id: 'streak-7', title: 'Tempered Steel', description: '7 consecutive days', xpReward: 150, progress: 7, target: 7, completed: true },
  { id: 'own-full', title: 'Ownership Master', description: 'Complete the Ownership kata', xpReward: 300, progress: 0, target: 1, completed: false }
]

export const SKILL_NODES: SkillNode[] = [
  { id: 'bases', name: 'Basics', icon: '⚙️', unlocked: true, katasCompleted: 3, katasTotal: 3, x: 420, y: 12, size: 93, color: '#3d9bff', description: "Variables, types, functions and control flow. The foundations before diving into ownership.", children: ['ownership', 'structs'] },
  { id: 'ownership', name: 'Ownership', icon: '🔑', unlocked: true, katasCompleted: 0, katasTotal: 1, x: 180, y: 144, size: 87, color: '#3d9bff', description: "Every value has a single owner. When it goes out of scope, the value is released. The heart of Rust's memory safety.", children: ['lifetimes', 'structs'] },
  { id: 'structs', name: 'Structs', icon: '📦', unlocked: true, katasCompleted: 0, katasTotal: 2, x: 660, y: 144, size: 87, color: '#3d9bff', description: "Group related data together. Methods via impl. The basis for custom types and traits.", children: ['traits', 'generics'] },
  { id: 'lifetimes', name: 'Lifetimes', icon: '⏳', unlocked: false, katasCompleted: 0, katasTotal: 1, x: 75, y: 282, size: 84, color: '#7f9cc4', description: "Annotations that guarantee a reference doesn't outlive the data it points to.", children: ['traits'] },
  { id: 'borrowing', name: 'Borrowing', icon: '🤝', unlocked: false, katasCompleted: 0, katasTotal: 1, x: 300, y: 282, size: 84, color: '#7f9cc4', description: "Borrow a value via a reference (&) without taking ownership of it.", children: ['concurrency'] },
  { id: 'traits', name: 'Traits', icon: '🔒', unlocked: false, katasCompleted: 0, katasTotal: 1, x: 75, y: 420, size: 81, color: '#7f9cc4', description: "Rust's interfaces. Defines shared behaviors.", children: ['macros'] },
  { id: 'concurrency', name: 'Concurrency', icon: '🔒', unlocked: false, katasCompleted: 0, katasTotal: 1, x: 660, y: 420, size: 81, color: '#7f9cc4', description: "Threads, Arc, Mutex, channels.", children: ['macros'] },
  { id: 'macros', name: 'Macros', icon: '🔒', unlocked: false, katasCompleted: 0, katasTotal: 1, x: 398, y: 534, size: 81, color: '#7f9cc4', description: "Meta-programming: generates code at compile time.", children: [] },
  { id: 'generics', name: 'Generics', icon: '🔒', unlocked: false, katasCompleted: 0, katasTotal: 1, x: 495, y: 282, size: 75, color: '#7f9cc4', description: "Parametrize types and functions.", children: [] },
  { id: 'unsafe', name: 'Unsafe', icon: '🔒', unlocked: false, katasCompleted: 0, katasTotal: 1, x: 555, y: 420, size: 72, color: '#7f9cc4', description: "Raw pointers, FFI, unchecked operations.", children: [] }
]

export const GRAAL_CHAPTERS = [
  { title: 'Ownership & Borrowing', sub: '11 katas · mastered', done: true },
  { title: 'Lifetimes', sub: '5 katas · in progress', done: false },
  { title: 'Traits & Generics', sub: '12 katas · locked', done: false },
  { title: 'Concurrency', sub: '6 katas · locked', done: false },
  { title: 'Macros & Unsafe', sub: '8 katas · locked', done: false }
]
