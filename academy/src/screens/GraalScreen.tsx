import { useApp } from '../store/AppContext'
import { GRAAL_CHAPTERS } from '../data/gamification'
import { KATAS } from '../data/katas'

export function GraalScreen() {
  const { progress } = useApp()

  const totalKatas = KATAS.length
  const completedKatas = progress.katasCompleted.filter(id => KATAS.some(kata => kata.id === id)).length
  const allCompleted = totalKatas > 0 && completedKatas === totalKatas

  const questDone = GRAAL_CHAPTERS.filter(c => c.done).length
  const questPct = Math.round(questDone / GRAAL_CHAPTERS.length * 100)

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
              Path completed · Master Level
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 36, color: '#eaf2ff', margin: '10px 0 0' }}>
              Ferris Forge is yours 🦀
            </h2>
            <p style={{ margin: '14px auto 0', maxWidth: 640, fontSize: 15, lineHeight: 1.7, color: '#c4d6ee' }}>
              Surprise! Your reward is a <b style={{ color: '#9fd0ff' }}>complete Rust agent stack</b> — code quality, linting, security, CI/CD and deployment — ready to plug into any harness (MCP, CLI, API).
            </p>
          </div>

          <div className="forge-agents-grid">
            {[
              { icon: '🔍', name: 'Quality Agent', sub: 'SonarQube · quality gate', color: '#3d9bff', desc: 'Coverage, technical debt, code smells, security hotspots — blocks PRs if thresholds are not met.' },
              { icon: '📎', name: 'Lint Agent', sub: 'Clippy · rustfmt', color: '#7c5cf0', desc: 'Idiomatic linting, auto-formatting, rewrite suggestions and auto-fixes.' },
              { icon: '⚙️', name: 'CI/CD Agent', sub: 'Actions · GitLab · cache', color: '#34c46e', desc: 'Generated pipelines, build matrix, crate caching, parallel tests — zero YAML to write.' },
              { icon: '🚀', name: 'Deployment Agent', sub: 'cross-compile · containers · crates.io', color: '#ff8a5c', desc: 'Versioned releases, multi-target binaries, OCI images and automatic publishing.' },
              { icon: '🛡️', name: 'Security Agent', sub: 'cargo audit · deny · supply chain', color: '#f0a830', desc: 'Dependency audits, known CVEs, disallowed licenses and supply-chain integrity checks.' },
              { icon: '🔌', name: 'Works everywhere', sub: 'MCP · CLI · API REST', color: '#3d9bff', desc: 'One manifest, three interfaces: MCP, CLI and REST API. Connect the forge to your harness in one command.', special: true }
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
            <a className="btn btn--primary" href="https://github.com/NicolasPayneauT0132431/rust-coding-dojo/tree/main/rewards/harness" target="_blank" rel="noopener noreferrer">Get Harness config</a>
          </div>
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
        A legendary reward awaits
        </h2>
        <p style={{ margin: '0 auto', maxWidth: 560, fontSize: 15, lineHeight: 1.7, color: '#b8cce6' }}>
        Nobody knows exactly what lies behind the seal — only those who have completed the five challenges of the path have seen it. Rumor has it it{' '}
        <b style={{ color: '#ffd08a' }}>changes the way you write Rust forever</b>.
        Discover it for yourself. 🤫
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '28px 0 10px', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: '#9fd0ff' }}>Seal progress {questPct}%</span>
        <span style={{ fontWeight: 700, fontSize: 13, color: '#7f9cc4' }}>· {questDone}/5 challenges</span>
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
              {ch.done ? '✓ Completed' : 'To complete'}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32 }}>
        <span style={{ fontSize: 13, color: '#6f8cb4' }}>Complete all katas to unlock the final reward.</span>
        </div>
      </div>
    </div>
  )
}
