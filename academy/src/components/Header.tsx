import { useApp } from '../store/AppContext'
import type { Screen } from '../types'
import { getXPProgressInLevel } from '../store/progress'

const NAV_ITEMS_BASE: Array<{ key: Screen; icon: string; label: string }> = [
  { key: 'path', icon: '🧭', label: 'Parcours' },
  { key: 'kata', icon: '📝', label: 'Katas' },
  { key: 'tree', icon: '🌳', label: 'Arbres de compétences' },
  { key: 'dash', icon: '📊', label: 'Dashboard' },
  { key: 'profile', icon: '🦀', label: 'Profil' },
]

export function Header() {
  const { progress, screen, setScreen } = useApp()
  const { current, total, pct } = getXPProgressInLevel(progress.xp)
  const graalIcon = progress.graalUnlocked ? '🏆' : '🎁'

  return (
    <header className="header">
      <div className="header-brand">
        <span className="header-crab floaty">🦀</span>
        <span className="header-title">Rust Dojo</span>
      </div>

      <nav className="header-nav">
        {NAV_ITEMS_BASE.map(item => (
          <button
            key={item.key}
            className={`nav-btn ${screen === item.key ? 'nav-btn--active' : ''}`}
            onClick={() => setScreen(item.key)}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
        <button
          className={`nav-btn nav-btn--graal ${screen === 'graal' ? 'nav-btn--graal-active' : ''} ${progress.graalUnlocked ? '' : 'shine'}`}
          onClick={() => setScreen('graal')}
        >
          <span>{graalIcon}</span>
          <span>Le Graal</span>
        </button>
      </nav>

      <div className="header-right">
        <span className="streak-badge">
          🔥 {progress.streak}
          <span className="streak-unit">jours</span>
        </span>

        <div className="xp-bar-container">
          <div className="xp-bar-labels">
            <span>Niveau {progress.level}</span>
            <span className="xp-bar-sub">{current} / {total}</span>
          </div>
          <div className="xp-bar-track">
            <div
              className="xp-bar-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="avatar">{progress.firstName?.charAt(0) || '?'}</div>
      </div>
    </header>
  )
}
