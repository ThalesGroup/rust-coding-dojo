import { useState, useEffect, useMemo } from 'react'
import { SKILL_NODES } from '../data/gamification'
import { KATAS } from '../data/katas'
import { useApp } from '../store/AppContext'
import type { Concept } from '../types'
import { buildTreeNodeState, pickDefaultSelectedNode } from './treeState'

const SVG_LINES = [
  'M465 105 V210',
  'M465 210 H248 M465 210 H713',
  'M248 248 V345',
  'M248 345 H150 M248 345 H345',
  'M713 248 V480',
  'M150 384 V480',
  'M465 480 H713 M465 480 V593',
]

export function TreeScreen() {
  const { progress } = useApp()

  // Compute live node states from base metadata + kata list + user progress
  const nodes = useMemo(
    () => buildTreeNodeState(SKILL_NODES, KATAS, { katasCompleted: progress.katasCompleted }),
    [progress.katasCompleted]
  )
  const [selectedNode, setSelectedNode] = useState<Concept>(() => pickDefaultSelectedNode(nodes))

  // Ensure selected node remains valid: if missing or locked, pick default
  useEffect(() => {
    const found = nodes.find(n => n.id === selectedNode)
    if (!found || !found.unlocked) {
      const fallback = pickDefaultSelectedNode(nodes)
      setSelectedNode(fallback)
    }
  }, [nodes, selectedNode])

  const node = nodes.find(n => n.id === selectedNode) ?? nodes[0]

  return (
    <div className="tree-screen">
      <div className="tree-canvas-area">
        <h2 className="screen-title">Skill Tree</h2>
        <p className="screen-subtitle">
          {nodes.filter(n => n.unlocked).length} / {nodes.length} nodes unlocked ·{' '}
          {Math.round(nodes.filter(n => n.unlocked).length / nodes.length * 100)}% · click an unlocked node
        </p>

          <div className="skill-tree-wrapper">
          <svg
            viewBox="0 0 930 690"
            style={{ position: 'absolute', left: 0, top: 0, width: 930, height: 690, pointerEvents: 'none' }}
          >
            {SVG_LINES.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="rgba(93,180,255,.32)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="6 7"
              />
            ))}
          </svg>

          {nodes.map(sn => (
            <div
              key={sn.id}
              className={`skill-node ${sn.unlocked ? 'skill-node--unlocked' : 'skill-node--locked'} ${selectedNode === sn.id ? 'skill-node--selected' : ''}`}
              style={{ left: sn.x, top: sn.y }}
              onClick={() => sn.unlocked && setSelectedNode(sn.id)}
            >
              <div
                className={`skill-icon ${sn.unlocked && sn.katasCompleted < sn.katasTotal ? 'glow' : ''}`}
                style={{
                  width: sn.size,
                  height: sn.size,
                  background: sn.unlocked ? sn.color : 'rgba(120,170,230,.12)',
                  border: !sn.unlocked ? '1.5px dashed rgba(120,170,230,.3)' : 'none',
                  boxShadow: sn.unlocked && sn.katasCompleted === sn.katasTotal
                    ? `0 0 16px ${sn.color}66`
                    : 'none'
                }}
              >
                {sn.unlocked ? sn.icon : '🔒'}
              </div>
              <div className="skill-label" style={{ color: sn.unlocked ? '#cfe2ff' : '#7f9cc4' }}>
                {sn.name}
              </div>
              {sn.unlocked && (
                <div
                  className="skill-progress-label"
                  style={{
                    color: sn.katasCompleted === sn.katasTotal ? '#8af0c0' : '#ffd08a'
                  }}
                >
                  {sn.katasCompleted}/{sn.katasTotal}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="tree-detail-panel">
      <div className="detail-section-label">NODE DETAIL</div>
        <div style={{ fontSize: 42, marginBottom: 10 }}>{node.icon}</div>
        <h3 className="detail-node-name">{node.name}</h3>
        <div
          className="detail-node-stat"
          style={{
            color: node.katasCompleted === node.katasTotal ? '#8af0c0' : '#ffd08a',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 12,
            fontWeight: 700,
            margin: '8px 0 16px'
          }}
        >
          {node.unlocked
            ? `${node.katasCompleted === node.katasTotal ? 'Mastered' : 'In progress'} · ${node.katasCompleted}/${node.katasTotal}`
            : 'Locked'}
        </div>
        <p className="detail-node-desc">{node.description}</p>

        {node.unlocked && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, color: '#6f8cb4', fontFamily: 'JetBrains Mono', marginBottom: 8, letterSpacing: '0.1em' }}>PROGRESSION</div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.round(node.katasCompleted / node.katasTotal * 100)}%`,
                  background: node.color
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: '#7f9cc4', marginTop: 5, fontFamily: 'JetBrains Mono' }}>
              {Math.round(node.katasCompleted / node.katasTotal * 100)}% completed
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
