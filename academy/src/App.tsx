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
        <h1 className="onboarding-title">Welcome to Rust Dojo</h1>
        <p className="onboarding-desc">
          Learn Rust step by step through interactive challenges.<br />
          Each kata gives you XP and unlocks the next level.
        </p>
        <p className="onboarding-desc" style={{ marginTop: 8 }}>
          Start with <strong>easy</strong> katas to master the basics,
          then progress to <strong>medium</strong> and <strong>hard</strong> levels.
        </p>
        <div className="onboarding-input-row">
          <input
            ref={inputRef}
            className="onboarding-input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submit() }}
            placeholder="Your first name…"
            maxLength={20}
          />
          <button className="btn btn--primary onboarding-btn" onClick={submit} disabled={!name.trim()}>
            Let's go →
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
        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 16, color: '#7f9cc4' }}>Loading Rust Dojo…</span>
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
