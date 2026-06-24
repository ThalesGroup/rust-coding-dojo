import { useApp } from '../store/AppContext'

interface PathStep {
  title: string
  subtitle: string
  concept: string
  kataCount: number
  xpTotal: number
  status: 'done' | 'active' | 'locked'
  kataId?: string
  progress?: number
}

const PATH_STEPS: PathStep[] = [
  { title: 'Possession & déplacement', subtitle: 'Ownership · 6 katas', concept: 'ownership', kataCount: 6, xpTotal: 240, status: 'done' },
  { title: 'Emprunts & références', subtitle: 'Borrowing · 5 katas', concept: 'borrowing', kataCount: 5, xpTotal: 200, status: 'done' },
  { title: 'Le Borrow Checker', subtitle: 'Ownership · en cours · kata 12/40', concept: 'ownership', kataCount: 1, xpTotal: 40, status: 'active', kataId: 'kata-12', progress: 40 },
  { title: 'Traits & génériques', subtitle: 'Traits · 7 katas', concept: 'traits', kataCount: 7, xpTotal: 350, status: 'locked' },
  { title: 'Threads & async', subtitle: 'Concurrence · 6 katas', concept: 'concurrency', kataCount: 6, xpTotal: 300, status: 'locked' },
]

export function PathScreen() {
  const { setScreen, setCurrentKata } = useApp()

  const goToKata = (kataId: string) => {
    setCurrentKata(kataId)
    setScreen('kata')
  }

  return (
    <div className="path-screen">
      <div className="path-content">
        <h2 className="screen-title">Chemin recommandé</h2>
        <p className="screen-subtitle">Débutant → Ownership → Lifetimes → Traits → Concurrence · adaptatif</p>

        <div className="path-list">
          {PATH_STEPS.map((step, i) => {
            if (step.status === 'done') {
              return (
                <div key={i} className="path-step path-step--done">
                  <div className="path-step-icon path-step-icon--done">✓</div>
                  <div className="path-step-body">
                    <div className="path-step-title">{step.title}</div>
                    <div className="path-step-sub">{step.subtitle}</div>
                  </div>
                  <span className="path-step-xp" style={{ color: '#8af0c0' }}>+{step.xpTotal} XP</span>
                </div>
              )
            }

            if (step.status === 'active') {
              return (
                <button
                  key={i}
                  className="path-step path-step--active glow"
                  onClick={() => step.kataId && goToKata(step.kataId)}
                >
                  <div className="path-step-icon path-step-icon--active">▶</div>
                  <div className="path-step-body" style={{ flex: 1 }}>
                    <div className="path-step-title">{step.title}</div>
                    <div className="path-step-sub" style={{ color: '#9fd0ff', marginBottom: 7 }}>{step.subtitle}</div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${step.progress ?? 0}%`, background: '#3d9bff' }} />
                    </div>
                  </div>
                  <span className="btn btn--primary" style={{ padding: '9px 15px', fontSize: 11 }}>Continuer</span>
                </button>
              )
            }

            return (
              <div key={i} className="path-step path-step--locked">
                <div className="path-step-icon path-step-icon--locked">🔒</div>
                <div className="path-step-body">
                  <div className="path-step-title" style={{ color: '#cfe2ff' }}>{step.title}</div>
                  <div className="path-step-sub">{step.subtitle}</div>
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#7f9cc4', fontWeight: 700 }}>verrouillé</span>
              </div>
            )
          })}
        </div>

        {/* Le Graal mystery teaser */}
        <button
          className="path-graal-teaser shine"
          onClick={() => setScreen('graal')}
        >
          <div className="path-graal-icon">🎁</div>
          <div className="path-graal-body">
            <div className="path-graal-title">À la fin du parcours… une surprise t'attend 🤫</div>
            <div className="path-graal-desc">Une récompense légendaire, scellée jusqu'à la dernière épreuve. Personne ne sait ce que c'est avant de l'avoir débloquée.</div>
          </div>
          <span className="btn btn--golden" style={{ padding: '9px 14px', fontSize: 11, whiteSpace: 'nowrap' }}>Voir la quête →</span>
        </button>
      </div>
    </div>
  )
}

