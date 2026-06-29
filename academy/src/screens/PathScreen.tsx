import { useApp } from '../store/AppContext'
import { KATAS } from '../data/katas'
import type { Difficulty } from '../types'

const DIFFICULTY_ORDER: Difficulty[] = ['facile', 'moyen', 'difficile', 'expert']

const DIFF_LABELS: Record<Difficulty, string> = { facile: 'Easy', moyen: 'Medium', difficile: 'Hard', expert: 'Expert' }

function getAccessibleDifficulty(katasCompleted: string[]): Difficulty {
  const done = new Set(katasCompleted)
  const facileIds = KATAS.filter(k => k.difficulty === 'facile').map(k => k.id)
  const moyenIds = KATAS.filter(k => k.difficulty === 'moyen').map(k => k.id)
  const difficileIds = KATAS.filter(k => k.difficulty === 'difficile').map(k => k.id)

  const allFacileDone = facileIds.every(id => done.has(id))
  const allMoyenDone = moyenIds.every(id => done.has(id))
  const allDifficileDone = difficileIds.every(id => done.has(id))

  if (allDifficileDone) return 'expert'
  if (allMoyenDone) return 'difficile'
  if (allFacileDone) return 'moyen'
  return 'facile'
}

export function PathScreen() {
  const { progress, setScreen, setCurrentKata } = useApp()
  const currentDifficulty = getAccessibleDifficulty(progress.katasCompleted)
  const currentIdx = DIFFICULTY_ORDER.indexOf(currentDifficulty)

  const goToKata = (kataId: string) => {
    setCurrentKata(kataId)
    setScreen('kata')
  }

  return (
    <div className="path-screen">
      <div className="path-content">
        <h2 className="screen-title">Path</h2>
        <p className="screen-subtitle">{progress.firstName ? `${progress.firstName}, ` : ''}choose a kata and start coding!</p>

        {DIFFICULTY_ORDER.map((diff, diffIdx) => {
          const katas = KATAS.filter(k => k.difficulty === diff)
          if (katas.length === 0) return null
          const unlocked = diffIdx <= currentIdx
          const diffPassed = diffIdx < currentIdx

          return (
            <div key={diff} className="path-difficulty-group">
              <div className="path-difficulty-header">
                <span className={`path-difficulty-badge path-difficulty-badge--${diff}`}>
                {diffPassed ? '✓' : unlocked ? '●' : '🔒'} {DIFF_LABELS[diff]}
                </span>
                <span className="path-difficulty-count">{katas.filter(k => progress.katasCompleted.includes(k.id)).length}/{katas.length}</span>
              </div>
              <div className="path-list">
                {katas.map(kata => {
                  const completed = progress.katasCompleted.includes(kata.id)
                  const active = kata.id === progress.currentKataId

                  if (!unlocked && !completed) {
                    return (
                      <div key={kata.id} className="path-step path-step--locked">
                        <div className="path-step-icon path-step-icon--locked">🔒</div>
                        <div className="path-step-body">
                          <div className="path-step-title" style={{ color: '#cfe2ff' }}>{kata.title}</div>
                          <div className="path-step-sub">{kata.concept}</div>
                        </div>
                      </div>
                    )
                  }

                  if (completed) {
                    return (
                      <div key={kata.id} className="path-step path-step--done">
                        <div className="path-step-icon path-step-icon--done">✓</div>
                        <div className="path-step-body">
                          <div className="path-step-title">{kata.title}</div>
                          <div className="path-step-sub">{kata.concept} · +{kata.xpReward} XP</div>
                        </div>
                        <button className="btn-ghost" onClick={() => goToKata(kata.id)}>Reopen</button>
                      </div>
                    )
                  }

                  return (
                    <button
                      key={kata.id}
                      className={`path-step path-step--active ${active ? 'glow' : ''}`}
                      onClick={() => goToKata(kata.id)}
                    >
                      <div className="path-step-icon path-step-icon--active">▶</div>
                      <div className="path-step-body" style={{ flex: 1 }}>
                        <div className="path-step-title">{kata.title}</div>
                        <div className="path-step-sub" style={{ color: '#9fd0ff', marginBottom: 4 }}>{kata.concept} · +{kata.xpReward} XP</div>
                        <div className="kata-diff-tag" style={{ color: diff === 'facile' ? '#8af0c0' : diff === 'moyen' ? '#ffd08a' : '#ff8a5c', fontSize: 10 }}>
                          {diff}
                        </div>
                      </div>
                      <span className="btn btn--primary" style={{ padding: '9px 15px', fontSize: 11 }}>Start</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Le Graal mystery teaser */}
        {currentDifficulty === 'expert' && (
          <button
            className="path-graal-teaser shine"
            onClick={() => setScreen('graal')}
          >
            <div className="path-graal-icon">🎁</div>
            <div className="path-graal-body">
              <div className="path-graal-title">At the end of the path… a surprise awaits 🤫</div>
              <div className="path-graal-desc">A legendary reward, sealed until the final challenge. No one knows what it is until it's unlocked.</div>
            </div>
            <span className="btn btn--golden" style={{ padding: '9px 14px', fontSize: 11, whiteSpace: 'nowrap' }}>Voir la quête →</span>
          </button>
        )}
      </div>
    </div>
  )
}

