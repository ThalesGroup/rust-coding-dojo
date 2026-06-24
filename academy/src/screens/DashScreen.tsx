import { useApp } from '../store/AppContext'
import type { Concept } from '../types'

const CONCEPTS: Array<{ key: Concept; label: string; icon: string }> = [
  { key: 'ownership', label: 'Ownership', icon: '🔑' },
  { key: 'borrowing', label: 'Borrowing', icon: '🤝' },
  { key: 'lifetimes', label: 'Lifetimes', icon: '⏳' },
  { key: 'traits', label: 'Traits', icon: '🧩' },
]

function getMasteryColor(val: number) {
  if (val >= 50) return '#3d9bff'
  return '#7c5cf0'
}

function getMasteryLabel(val: number) {
  if (val >= 80) return '#8af0c0'
  if (val >= 50) return '#ffd08a'
  return '#ff8a5c'
}

// Static XP chart SVG matching the design HTML exactly
function XPChartSVG() {
  return (
    <svg viewBox="0 0 360 150" style={{ width: '100%', height: 'auto' }}>
      <g stroke="rgba(120,170,230,.1)" strokeWidth="1">
        <line x1="0" y1="38" x2="360" y2="38" />
        <line x1="0" y1="76" x2="360" y2="76" />
        <line x1="0" y1="114" x2="360" y2="114" />
      </g>
      <polyline
        points="0,130 50,118 100,124 150,90 200,96 250,58 300,46 360,20"
        fill="none"
        stroke="#4fd6e0"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        points="0,130 50,118 100,124 150,90 200,96 250,58 300,46 360,20 360,150 0,150"
        fill="rgba(79,214,224,.1)"
      />
      <circle cx="360" cy="20" r="4" fill="#4fd6e0" />
    </svg>
  )
}

export function DashScreen() {
  const { progress } = useApp()

  const totalXPWeek = progress.xpHistory.slice(-7).reduce((s, e) => s + e.xp, 0)

  return (
    <div className="dash-screen">
      <h2 className="screen-title">Your progress</h2>

      <div className="dash-grid">
        {/* XP Chart */}
        <div className="dash-card">
          <div className="dash-card-title">XP / TIME</div>
          <div className="dash-card-sub">+{totalXPWeek} XP this week</div>
          <XPChartSVG />
        </div>

        {/* Mastery bars */}
        <div className="dash-card">
          <div className="dash-card-title">MASTERY BY CONCEPT</div>
          <div className="mastery-list">
            {CONCEPTS.map(c => {
              const val = progress.conceptMastery[c.key] ?? 0
              return (
                <div key={c.key} className="mastery-row">
                  <div className="mastery-header">
                    <span>{c.icon} {c.label}</span>
                    <span style={{ color: getMasteryLabel(val) }}>{val}%</span>
                  </div>
                  <div className="progress-track" style={{ height: 9 }}>
                    <div
                      className="progress-fill"
                      style={{ width: `${val}%`, background: getMasteryColor(val) }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

