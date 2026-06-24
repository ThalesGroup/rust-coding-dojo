import { AppProvider, useApp } from './store/AppContext'
import { Header } from './components/Header'
import { KataScreen } from './screens/KataScreen'
import { TreeScreen } from './screens/TreeScreen'
import { PathScreen } from './screens/PathScreen'
import { DashScreen } from './screens/DashScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { GraalScreen } from './screens/GraalScreen'

function AppContent() {
  const { screen, isLoading } = useApp()

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
        {screen === 'dash' && <DashScreen />}
        {screen === 'profile' && <ProfileScreen />}
        {screen === 'graal' && <GraalScreen />}
      </main>
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
