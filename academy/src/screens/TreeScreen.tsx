import { useState } from 'react'
import { SKILL_NODES } from '../data/gamification'
import type { Concept } from '../types'

const SVG_LINES = [
  // Bases -> Ownership and Borrowing
  'M310 70 V140',
  'M310 140 H165 M310 140 H475',
  // Ownership -> Lifetimes and Structs
  'M165 165 V230',
  'M165 230 H100 M165 230 H230',
  // Borrowing -> Concurrency
  'M475 165 V320',
  // Lifetimes -> Traits
  'M100 256 V320',
  // Lines connecting bottom nodes
  'M310 320 H475 M310 320 V395'
]

export function TreeScreen() {
  const [selectedNode, setSelectedNode] = useState<Concept>('ownership')

  const node = SKILL_NODES.find(n => n.id === selectedNode) ?? SKILL_NODES[1]

  return (
    <div className="tree-screen">
      <div className="tree-canvas-area">
        <h2 className="screen-title">Arbre de compétences</h2>
        <p className="screen-subtitle">
          {SKILL_NODES.filter(n => n.unlocked).length} / {SKILL_NODES.length} nœuds débloqués ·{' '}
          {Math.round(SKILL_NODES.filter(n => n.unlocked).length / SKILL_NODES.length * 100)}% · clique un nœud débloqué
        </p>

        <div className="skill-tree-wrapper">
          <svg
            viewBox="0 0 620 460"
            style={{ position: 'absolute', left: 0, top: 0, width: 620, height: 460, pointerEvents: 'none' }}
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

          {SKILL_NODES.map(sn => (
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
        <div className="detail-section-label">DÉTAIL DU NŒUD</div>
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
            ? `${node.katasCompleted === node.katasTotal ? 'Maîtrisé' : 'En cours'} · ${node.katasCompleted}/${node.katasTotal}`
            : 'Verrouillé'}
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
              {Math.round(node.katasCompleted / node.katasTotal * 100)}% complété
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
