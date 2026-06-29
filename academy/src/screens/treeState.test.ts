import { describe, expect, test } from 'vitest'
import { SKILL_NODES } from '../data/gamification'
import { KATAS } from '../data/katas'
import { buildTreeNodeState, pickDefaultSelectedNode } from './treeState'

describe('treeState', () => {
  test('keeps only bases unlocked when no kata is completed', () => {
    const nodes = buildTreeNodeState(SKILL_NODES, KATAS, { katasCompleted: [] })

    const bases = nodes.find(node => node.id === 'bases')
    const ownership = nodes.find(node => node.id === 'ownership')

    expect(bases?.unlocked).toBe(true)
    expect(ownership?.unlocked).toBe(false)
  })

  test('unlocks ownership when all bases katas are completed', () => {
    const basesKataIds = KATAS.filter(kata => kata.concept === 'bases').map(kata => kata.id)
    const nodes = buildTreeNodeState(SKILL_NODES, KATAS, { katasCompleted: basesKataIds })

    const bases = nodes.find(node => node.id === 'bases')
    const ownership = nodes.find(node => node.id === 'ownership')

    expect(bases?.katasCompleted).toBe(bases?.katasTotal)
    expect(ownership?.unlocked).toBe(true)
  })

  test('picks first unlocked incomplete node as default selection', () => {
    const basesKataIds = KATAS.filter(kata => kata.concept === 'bases').map(kata => kata.id)
    const nodes = buildTreeNodeState(SKILL_NODES, KATAS, { katasCompleted: basesKataIds })

    expect(pickDefaultSelectedNode(nodes)).toBe('ownership')
  })

  test('falls back to bases when all nodes are complete', () => {
    const allKataIds = KATAS.map(kata => kata.id)
    const nodes = buildTreeNodeState(SKILL_NODES, KATAS, { katasCompleted: allKataIds })

    expect(pickDefaultSelectedNode(nodes)).toBe('bases')
  })
})
