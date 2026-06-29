import { useApp } from '../store/AppContext'
import type { Screen } from '../types'
import { KATAS } from '../data/katas'

const NAV_ITEMS_BASE: Array<{ key: Screen; icon: string; label: string }> = [
  { key: 'path', icon: '🧭', label: 'Path' },
  { key: 'kata', icon: '📝', label: 'Katas' },
  { key: 'tree', icon: '🌳', label: 'Skill Trees' },
]

export function Header() {
  const { progress, screen, setScreen } = useApp()
  const totalKatas = KATAS.length
  const completedKatas = progress.katasCompleted.filter(id => KATAS.some(kata => kata.id === id)).length
  const pct = totalKatas > 0 ? Math.round((completedKatas / totalKatas) * 100) : 0
  const graalIcon = progress.graalUnlocked ? '🏆' : '🎁'
  const allKatasCompleted = totalKatas > 0 && completedKatas === totalKatas

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
          onClick={() => allKatasCompleted && setScreen('graal')}
          disabled={!allKatasCompleted}
          title={allKatasCompleted ? 'The Grail' : 'Complete all katas to unlock'}
        >
          <span>{allKatasCompleted ? graalIcon : '🔒'}</span>
          <span>The Grail</span>
        </button>
      </nav>

      <div className="header-right">

        <div className="xp-bar-container">
          <div className="xp-bar-labels">
            <span>Progress</span>
            <span className="xp-bar-sub">{completedKatas} / {totalKatas}</span>
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
