import { describe, expect, it } from 'vitest'
import { buildTreeNodeState, pickDefaultSelectedNode } from './treeState'
import type { Concept, SkillNode, Kata } from '../types'

const mkNode = (id: Concept): SkillNode => ({
  id,
  name: id,
  icon: 'x',
  unlocked: false,
  katasCompleted: 0,
  katasTotal: 0,
  x: 0,
  y: 0,
  size: 10,
  color: '#000',
  description: id,
  children: []
})

const nodes: SkillNode[] = (['bases', 'ownership', 'borrowing'] as Concept[]).map(mkNode)
const katas = [
  { id: 'k1', concept: 'bases' },
  { id: 'k2', concept: 'ownership' },
  { id: 'k3', concept: 'borrowing' }
] as Kata[]

describe('buildTreeNodeState', () => {
  it('keeps only bases unlocked for fresh users', () => {
    const result = buildTreeNodeState(nodes, katas, { katasCompleted: [] })
    expect(result.find(n => n.id === 'bases')?.unlocked).toBe(true)
    expect(result.find(n => n.id === 'ownership')?.unlocked).toBe(false)
  })

  it('unlocks next concept only after previous is 100% complete', () => {
    const result = buildTreeNodeState(nodes, katas, { katasCompleted: ['k1'] })
    expect(result.find(n => n.id === 'ownership')?.unlocked).toBe(true)
    expect(result.find(n => n.id === 'borrowing')?.unlocked).toBe(false)
  })

  it('picks first unlocked incomplete node by default', () => {
    const result = buildTreeNodeState(nodes, katas, { katasCompleted: ['k1'] })
    expect(pickDefaultSelectedNode(result)).toBe('ownership')
  })
})
