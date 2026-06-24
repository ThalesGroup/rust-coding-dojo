import { useState } from 'react'
import { useApp } from '../store/AppContext'
import { GRAAL_CHAPTERS } from '../data/gamification'

export function GraalScreen() {
  const { progress, unlockGraal } = useApp()
  const [claimed, setClaimed] = useState(false)

  const questDone = GRAAL_CHAPTERS.filter(c => c.done).length
  const questPct = Math.round(questDone / GRAAL_CHAPTERS.length * 100)

  const claimStack = () => {
    setClaimed(true)
    const manifest = {
      name: 'ferris-forge',
      version: '1.0.0',
      agents: [
        { id: 'quality', name: 'Agent Qualité', tool: 'sonarqube', trigger: 'pr' },
        { id: 'lint', name: 'Agent Lint', tools: ['clippy', 'rustfmt'], trigger: 'push' },
        { id: 'cicd', name: 'Agent CI/CD', platforms: ['github-actions', 'gitlab'], trigger: 'push' },
        { id: 'deploy', name: 'Agent Déploiement', targets: ['cross-compile', 'docker', 'crates-io'], trigger: 'tag' },
        { id: 'security', name: 'Agent Sécurité', tools: ['cargo-audit', 'cargo-deny'], trigger: 'schedule' }
      ],
      interfaces: ['mcp', 'cli', 'rest-api']
    }
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ferris-forge.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (progress.graalUnlocked) {
    return (
      <div className="graal-screen graal-screen--unlocked">
        <div className="confetti-overlay">
          <span className="confetti-item" style={{ left: '12%', animationDuration: '3.4s' }}>✨</span>
          <span className="confetti-item" style={{ left: '30%', animationDuration: '4.2s', animationDelay: '.4s' }}>🎉</span>
          <span className="confetti-item" style={{ left: '52%', animationDuration: '3.8s', animationDelay: '.8s' }}>⭐</span>
          <span className="confetti-item" style={{ left: '71%', animationDuration: '4.6s', animationDelay: '.2s' }}>✨</span>
          <span className="confetti-item" style={{ left: '88%', animationDuration: '3.2s', animationDelay: '1s' }}>🎊</span>
        </div>

        <div className="graal-content">
          <div style={{ textAlign: 'center' }}>
            <div className="graal-trophy pop">🏆</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#8af0c0', letterSpacing: '0.28em', textTransform: 'uppercase', marginTop: 8 }}>
              Parcours accompli · Niveau Maître
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 36, color: '#eaf2ff', margin: '10px 0 0' }}>
              La Forge de Ferris est tienne 🦀
            </h2>
            <p style={{ margin: '14px auto 0', maxWidth: 640, fontSize: 15, lineHeight: 1.7, color: '#c4d6ee' }}>
              Surprise ! Ta récompense est une <b style={{ color: '#9fd0ff' }}>stack agentique Rust complète</b> — qualité de code, lint, sécurité, CI/CD et déploiement — prête à brancher sur n'importe quel harness (MCP, CLI, API).
            </p>
          </div>

          <div className="forge-agents-grid">
            {[
              { icon: '🔍', name: 'Agent Qualité', sub: 'SonarQube · quality gate', color: '#3d9bff', desc: 'Couverture, dette technique, code smells, hotspots de sécurité — bloque la PR si le seuil n\'est pas tenu.' },
              { icon: '📎', name: 'Agent Lint', sub: 'Clippy · rustfmt', color: '#7c5cf0', desc: 'Lint idiomatique, formatage auto, suggestions de réécriture et correctifs appliqués tout seuls.' },
              { icon: '⚙️', name: 'Agent CI/CD', sub: 'Actions · GitLab · cache', color: '#34c46e', desc: 'Pipelines générés, matrice de build, cache de crates, tests parallèles — zéro YAML à écrire.' },
              { icon: '🚀', name: 'Agent Déploiement', sub: 'cross-compile · conteneurs · crates.io', color: '#ff8a5c', desc: 'Releases versionnées, binaires multi-cibles, images OCI et publication automatique.' },
              { icon: '🛡️', name: 'Agent Sécurité', sub: 'cargo audit · deny · supply chain', color: '#f0a830', desc: 'Audit des dépendances, CVE connues, licences interdites et intégrité de la chaîne d\'approvisionnement.' },
              { icon: '🔌', name: 'Branchable partout', sub: 'MCP · CLI · API REST', color: '#3d9bff', desc: 'Un manifeste, trois interfaces : MCP, CLI et API REST. Connecte la forge à ton harness existant en une commande.', special: true }
            ].map((agent, i) => (
              <div key={i} className={`forge-agent-card ${agent.special ? 'forge-agent-card--special' : ''}`}>
                <div className="forge-agent-icon" style={{ background: agent.color }}>{agent.icon}</div>
                <div className="forge-agent-name">{agent.name}</div>
                <div className="forge-agent-sub" style={{ color: agent.color === '#3d9bff' ? '#9fd0ff' : agent.color === '#7c5cf0' ? '#c9b6ff' : agent.color === '#34c46e' ? '#8af0c0' : agent.color === '#ff8a5c' ? '#ffb499' : '#ffd08a' }}>{agent.sub}</div>
                <p className="forge-agent-desc">{agent.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
            <button className="btn btn--primary" onClick={claimStack}>🔌 Connecter à mon harness</button>
            <button className="btn btn--outline" onClick={claimStack}>⬇ Télécharger le manifeste (JSON)</button>
          </div>

          {claimed && (
            <div className="claim-success pop">
              ✓ Manifeste <code>ferris-forge.json</code> prêt — colle-le dans ton harness pour activer les 5 agents.
            </div>
          )}
        </div>
      </div>
    )
  }

  // Locked state
  return (
    <div className="graal-screen graal-screen--locked">
      <div className="graal-content" style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#ffd08a', letterSpacing: '0.28em', textTransform: 'uppercase' }}>
          La quête finale
        </div>

        <div className="graal-mystery-box">
          <div className="graal-pulse" />
          <div className="graal-gift">🎁</div>
          <div className="graal-lock">🔒</div>
          <div className="graal-question">?</div>
        </div>

        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#eaf2ff', margin: '0 0 14px' }}>
          Une récompense légendaire t'attend
        </h2>
        <p style={{ margin: '0 auto', maxWidth: 560, fontSize: 15, lineHeight: 1.7, color: '#b8cce6' }}>
          Personne ne sait exactement ce qui se cache derrière le sceau — seuls ceux qui ont terminé les cinq épreuves du parcours l'ont vu. On raconte que ça{' '}
          <b style={{ color: '#ffd08a' }}>change la façon d'écrire du Rust pour toujours</b>.
          À toi de le découvrir. 🤫
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '28px 0 10px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: '#9fd0ff' }}>Sceau brisé à {questPct}%</span>
          <span style={{ fontWeight: 700, fontSize: 13, color: '#7f9cc4' }}>· {questDone}/5 épreuves</span>
        </div>
        <div className="graal-progress-track">
          <div className="graal-progress-fill" style={{ width: `${questPct}%` }} />
        </div>

        <div className="graal-chapters">
          {GRAAL_CHAPTERS.map((ch, i) => (
            <div
              key={i}
              className="graal-chapter"
              style={{
                background: ch.done ? 'rgba(74,222,128,.07)' : 'rgba(8,19,32,.4)',
                border: `1px solid ${ch.done ? 'rgba(74,222,128,.2)' : 'rgba(120,170,230,.12)'}`
              }}
            >
              <div
                className="graal-chapter-icon"
                style={{ background: ch.done ? 'rgba(74,222,128,.16)' : 'rgba(120,170,230,.1)' }}
              >
                {ch.done ? '✓' : (i + 1)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#eaf2ff' }}>{ch.title}</div>
                <div style={{ fontSize: 12, color: '#7f9cc4' }}>{ch.sub}</div>
              </div>
              <span style={{ fontWeight: 700, fontSize: 11, color: ch.done ? '#8af0c0' : '#6f8cb4' }}>
                {ch.done ? '✓ Complété' : 'À compléter'}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <button
            className="btn btn--golden"
            onClick={() => unlockGraal()}
          >
            ⚔️ Relever la dernière épreuve
          </button>
          <span style={{ fontSize: 11, color: '#6f8cb4' }}>(démo — déclenche la révélation de la surprise)</span>
        </div>
      </div>
    </div>
  )
}
