import type { Concept, Kata, SkillNode, UserProgress } from '../types'

export const TREE_UNLOCK_ORDER: Concept[] = [
  'bases', 'ownership', 'borrowing', 'lifetimes', 'structs',
  'traits', 'generics', 'concurrency', 'macros', 'unsafe'
]

export type TreeNodeState = SkillNode & {
  unlocked: boolean
  katasCompleted: number
  katasTotal: number
}

export function buildTreeNodeState(
  baseNodes: SkillNode[],
  katas: Kata[],
  progress: Pick<UserProgress, 'katasCompleted'>
): TreeNodeState[] {
  const completed = new Set(progress.katasCompleted ?? [])

  // Initialize counts for each concept in order to keep determinism
  const byConcept = new Map<Concept, { total: number; done: number }>()
  for (const concept of TREE_UNLOCK_ORDER) byConcept.set(concept, { total: 0, done: 0 })

  for (const kata of katas) {
    const bucket = byConcept.get(kata.concept)
    if (!bucket) continue
    bucket.total += 1
    if (completed.has(kata.id)) bucket.done += 1
  }

  // Determine unlocks: bases always unlocked; each next concept unlocked only when all previous concepts are 100% complete
  let allPreviousComplete = true
  const unlockedByConcept = new Map<Concept, boolean>()
  for (const concept of TREE_UNLOCK_ORDER) {
    const stats = byConcept.get(concept) ?? { total: 0, done: 0 }
    const isUnlocked = concept === 'bases' ? true : allPreviousComplete
    unlockedByConcept.set(concept, isUnlocked)
    const isComplete = stats.total > 0 ? stats.done === stats.total : false
    allPreviousComplete = allPreviousComplete && isComplete
  }

  // Build deterministic node states from provided baseNodes order
  return baseNodes.map(node => {
    const stats = byConcept.get(node.id) ?? { total: 0, done: 0 }
    return {
      ...node,
      unlocked: unlockedByConcept.get(node.id) ?? false,
      katasCompleted: stats.done,
      katasTotal: stats.total
    }
  })
}

export function pickDefaultSelectedNode(nodes: TreeNodeState[]): Concept {
  // Pick first unlocked node that is not yet complete (deterministic via array order)
  const unlockedIncomplete = nodes.find(n => n.unlocked && n.katasCompleted < n.katasTotal)
  if (unlockedIncomplete) return unlockedIncomplete.id
  // Fallback to bases or first node
  return (nodes.find(n => n.id === 'bases') ?? nodes[0]).id
}
