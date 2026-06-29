import { useApp } from '../store/AppContext'
import { BADGES } from '../data/gamification'

export function ProfileScreen() {
  const { progress, setScreen } = useApp()

  const progressPct = Math.round(((progress.xp - 1200) / 400) * 100)
  const circumference = 2 * Math.PI * 44
  const dashOffset = circumference - (progressPct / 100) * circumference

  return (
    <div className="profile-screen">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-ring">
          <svg viewBox="0 0 100 100" width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(120,170,230,.16)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="44" fill="none"
              stroke="#4fd6e0" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="profile-ring-icon">🦀</div>
        </div>

        <div className="profile-info">
          <h2 className="profile-name">
            {progress.firstName || 'Apprentice'} · <span style={{ color: '#4fd6e0' }}>Level {progress.level}</span>
          </h2>
          <div className="profile-title">
            Borrow Checker Apprentice · {progress.xp} XP
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-pill" style={{ borderColor: 'rgba(255,138,92,.28)', background: 'rgba(255,138,92,.1)' }}>
            <div className="stat-pill-value" style={{ color: '#ff8a5c' }}>{progress.streak}</div>
            <div className="stat-pill-label" style={{ color: '#ffb499' }}>🔥 Streak</div>
          </div>
          <div className="stat-pill" style={{ borderColor: 'rgba(74,222,128,.25)', background: 'rgba(74,222,128,.08)' }}>
            <div className="stat-pill-value" style={{ color: '#8af0c0' }}>{progress.katasCompleted.length}</div>
            <div className="stat-pill-label" style={{ color: '#8af0c0' }}>katas</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="section-label">BADGES</div>
      <div className="badges-grid">
        {BADGES.map(badge => {
          const unlocked = progress.badges.includes(badge.id)
          return (
            <div key={badge.id} className="badge-card" style={{ opacity: unlocked ? 1 : 0.4 }}>
              <div
                className="badge-icon"
                style={{
                  background: unlocked ? badge.color : 'rgba(120,170,230,.12)',
                  border: !unlocked ? '1.5px dashed rgba(120,170,230,.3)' : 'none',
                  boxShadow: unlocked ? `0 0 16px ${badge.glowColor}` : 'none'
                }}
              >
                {unlocked ? badge.icon : '🔒'}
              </div>
              <div className="badge-name" style={{ color: unlocked ? '#cfe2ff' : '#7f9cc4' }}>
                {badge.name}
              </div>
              <div className="badge-desc">{badge.description}</div>
            </div>
          )
        })}

        {/* Mystery Graal badge */}
        <button
          className="badge-card shine"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => setScreen('graal')}
        >
          <div
            className="badge-icon"
            style={{
              background: 'rgba(255,194,75,.12)',
              border: '1.5px dashed rgba(255,194,75,.4)',
              color: '#ffd08a'
            }}
          >
            🎁
          </div>
          <div className="badge-name" style={{ color: '#ffd08a' }}>??? · surprise</div>
          <div className="badge-desc" style={{ color: '#ffd08a', opacity: 0.7 }}>To unlock</div>
        </button>
      </div>
    </div>
  )
}

