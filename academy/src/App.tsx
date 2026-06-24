import { useState, useRef, useEffect } from 'react'
import { AppProvider, useApp } from './store/AppContext'
import { Header } from './components/Header'
import { KataScreen } from './screens/KataScreen'
import { TreeScreen } from './screens/TreeScreen'
import { PathScreen } from './screens/PathScreen'
import { GraalScreen } from './screens/GraalScreen'

function OnboardingModal() {
  const { setFirstName } = useApp()
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const submit = () => {
    const v = name.trim()
    if (v) setFirstName(v)
  }

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <div className="onboarding-crab">🦀</div>
        <h1 className="onboarding-title">Bienvenue sur Rust Dojo</h1>
        <p className="onboarding-desc">
          Tu vas apprendre le Rust pas à pas à travers des défis interactifs.<br />
          Chaque kata te fait gagner de l'XP et débloque le niveau suivant.
        </p>
        <p className="onboarding-desc" style={{ marginTop: 8 }}>
          Commence par les katas <strong>faciles</strong>, maîtrise les bases,
          puis progresse vers les niveaux <strong>moyen</strong> et <strong>difficile</strong>.
        </p>
        <div className="onboarding-input-row">
          <input
            ref={inputRef}
            className="onboarding-input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submit() }}
            placeholder="Ton prénom…"
            maxLength={20}
          />
          <button className="btn btn--primary onboarding-btn" onClick={submit} disabled={!name.trim()}>
            C'est parti →
          </button>
        </div>
      </div>
    </div>
  )
}

function AppContent() {
  const { screen, isLoading, showOnboarding } = useApp()

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#070f1b', color: '#cfe2ff', flexDirection: 'column', gap: 16 }}>
        <span style={{ fontSize: 48, animation: 'floaty 2s ease-in-out infinite' }}>🦀</span>
        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 16, color: '#7f9cc4' }}>Chargement de Rust Dojo…</span>
      </div>
    )
  }

  return (
    <div className="app-root">
      <Header />
      <main className="app-content">
        {screen === 'kata' && <KataScreen />}
        {screen === 'tree' && <TreeScreen />}
        {screen === 'path' && <PathScreen />}
        {screen === 'graal' && <GraalScreen />}
      </main>
      {showOnboarding && <OnboardingModal />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
