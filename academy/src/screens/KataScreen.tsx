import { useState, useEffect, useRef, useCallback } from 'react'
import { useApp } from '../store/AppContext'
import { getKataById, KATAS } from '../data/katas'
import { askFerris, explainCode, reviewCode, preloadModel, isModelReady, getModelInfo, getDownloadProgress } from '../llm/ferris'
import type { ChatMessage } from '../types'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { rust } from '@codemirror/lang-rust'
import { oneDark } from '@codemirror/theme-one-dark'
import { autocompletion, type CompletionContext } from '@codemirror/autocomplete'
import { lintGutter, setDiagnostics as setLintDiagnostics } from '@codemirror/lint'
import type { Diagnostic } from '@codemirror/lint'
import { compileRust, diagnosticsFromRustStderr } from '../editor/rustCompiler'
import type { DownloadProgress } from '../llm/localWllama'

const CODE_LS_PREFIX = 'rust-dojo-kata-code:'
const RUST_KEYWORDS = [
  'fn', 'let', 'mut', 'struct', 'enum', 'impl', 'trait', 'match', 'if', 'else',
  'for', 'while', 'loop', 'pub', 'use', 'mod', 'crate', 'Self', 'self', 'where',
  'const', 'static', 'return', 'break', 'continue', 'async', 'await', 'move',
  'ref', 'type', 'as', 'in', 'unsafe', 'dyn', 'super', 'String', 'Vec', 'Option',
  'Result', 'Some', 'None', 'Ok', 'Err', 'println!', 'todo!', 'panic!',
]

function loadSavedCode(kataId: string, fallback: string): string {
  try {
    const raw = localStorage.getItem(CODE_LS_PREFIX + kataId)
    return raw ?? fallback
  } catch {
    return fallback
  }
}

function saveCode(kataId: string, code: string): void {
  try {
    localStorage.setItem(CODE_LS_PREFIX + kataId, code)
  } catch {
    // ignore storage failures
  }
}

function rustCompletionSource(context: CompletionContext) {
  const word = context.matchBefore(/[A-Za-z_][A-Za-z0-9_]*/)
  if (!word && !context.explicit) return null

  const fullText = context.state.doc.toString()
  const identifiers = fullText.match(/\b[A-Za-z_][A-Za-z0-9_]*\b/g) ?? []
  const uniq = new Set<string>([...RUST_KEYWORDS, ...identifiers])
  const options = Array.from(uniq)
    .slice(0, 500)
    .map(label => ({ label, type: RUST_KEYWORDS.includes(label) ? 'keyword' : 'variable' as const }))

  return {
    from: word ? word.from : context.pos,
    options,
    validFor: /^[A-Za-z_][A-Za-z0-9_]*$/,
  }
}

function evaluateKataTests(kata: ReturnType<typeof getKataById>, code: string) {
  if (!kata) return { tests: [], allPass: false }
  const tests = kata.tests.map(t => ({
    name: t.name,
    pass: t.check(code)
  }))
  const allPass = tests.every(t => t.pass)
  return { tests, allPass }
}

export function KataScreen() {
  const { progress, currentKataId, setCurrentKata, completeKata, setScreen } = useApp()
  const kata = getKataById(currentKataId) ?? KATAS[0]
  const initialCode = loadSavedCode(kata.id, kata.starterCode)

  const [code, setCode] = useState(initialCode)
  const [ran, setRan] = useState(false)
  const [tests, setTests] = useState<Array<{ name: string; pass: boolean }>>([])
  const [output, setOutput] = useState<Array<{ text: string; color: string }>>([])
  const [chat, setChat] = useState<ChatMessage[]>([
    { role: 'ferris', text: "Salut ! Je suis Ferris 🦀, ton mentor. Lance le code avec ▶ Exécuter, ou demande-moi un indice 💡.", timestamp: Date.now() }
  ])
  const [input, setInput] = useState('')
  const [hintIndex, setHintIndex] = useState(0)
  const [isReplying, setIsReplying] = useState(false)
  const [modelReady, setModelReady] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const editorViewRef = useRef<EditorView | null>(null)
  const diagnosticsRef = useRef<Diagnostic[]>([])
  const alreadyCompleted = useRef(false)
  const [isCompiling, setIsCompiling] = useState(false)
  const [useKataContext, setUseKataContext] = useState(true)
  const [dlProgress, setDlProgress] = useState<DownloadProgress>({ phase: 'idle', loaded: 0, total: 0, pct: 0 })

  // Reset when kata changes
  useEffect(() => {
    const restoredCode = loadSavedCode(kata.id, kata.starterCode)
    setCode(restoredCode)
    setRan(false)
    setTests([])
    setOutput([])
    setHintIndex(0)
    diagnosticsRef.current = []
    alreadyCompleted.current = progress.katasCompleted.includes(kata.id)
    setChat([{ role: 'ferris', text: `Kata : "${kata.title}". ${kata.difficulty === 'facile' ? 'Un kata de niveau facile — bonne chance !' : 'Un challenge qui va muscler ton ownership !'}`, timestamp: Date.now() }])
  }, [kata.id])

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat])

  // Preload local model in background
  useEffect(() => {
    preloadModel()
    const poll = setInterval(() => {
      setDlProgress(getDownloadProgress())
      if (isModelReady()) {
        setModelReady(true)
        clearInterval(poll)
      }
    }, 500)
    return () => clearInterval(poll)
  }, [])

  // CodeMirror editor
  useEffect(() => {
    if (!editorRef.current) return

    if (editorViewRef.current) {
      editorViewRef.current.destroy()
      editorViewRef.current = null
    }

    const updateListener = EditorView.updateListener.of(update => {
      if (update.docChanged) {
        const nextCode = update.state.doc.toString()
        setCode(nextCode)
        saveCode(kata.id, nextCode)
      }
    })

    const state = EditorState.create({
      doc: loadSavedCode(kata.id, kata.starterCode),
      extensions: [
        basicSetup,
        rust(),
        oneDark,
        autocompletion({ override: [rustCompletionSource] }),
        lintGutter(),
        updateListener,
        EditorView.lineWrapping,
      ]
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    editorViewRef.current = view

    return () => {
      view.destroy()
      editorViewRef.current = null
    }
  }, [kata.id])

  // Sync editor content when reset is triggered
  useEffect(() => {
    if (editorViewRef.current && code === kata.starterCode) {
      // Editor is already set up with starterCode from the creation effect
    }
  }, [kata.starterCode])

  const applyDiagnostics = useCallback((diagnostics: Diagnostic[]) => {
    diagnosticsRef.current = diagnostics
    if (editorViewRef.current) {
      editorViewRef.current.dispatch(setLintDiagnostics(editorViewRef.current.state, diagnostics))
    }
  }, [])

  const run = useCallback(async () => {
    setIsCompiling(true)
    const result = await compileRust(code)
    const compileDiagnostics = diagnosticsFromRustStderr(code, result.stderr)
    applyDiagnostics(compileDiagnostics)

    if (!result.success) {
      const stderrLines = result.stderr.split(/\r?\n/).filter(Boolean).slice(0, 12)
      setOutput([
        { text: '   Compiling rust-dojo v0.1.0 (playground)', color: '#5a7290' },
        ...stderrLines.map(line => ({ text: line, color: '#ff8a5c' })),
      ])
      setRan(false)
      setTests([])
      setChat(prev => [...prev, { role: 'ferris', text: 'Le compilateur Rust a trouvé des erreurs — elles sont soulignées dans l\'éditeur.', timestamp: Date.now() }])
      setIsCompiling(false)
      return
    }

    const { tests: newTests, allPass } = evaluateKataTests(kata, code)
    setTests(newTests)
    setRan(true)

    const outputLines: Array<{ text: string; color: string }> = []
    outputLines.push({ text: '   Compiling rust-dojo v0.1.0 (rust playground)', color: '#5a7290' })
    if (result.stdout) {
      outputLines.push({ text: '   Running...', color: '#5a7290' })
      result.stdout.split(/\r?\n/).filter(Boolean).forEach(line => {
        outputLines.push({ text: line, color: '#c0caf5' })
      })
    }
    outputLines.push({ text: '', color: '#4a6080' })
    outputLines.push({ text: `   Kata tests: ${newTests.filter(t => t.pass).length}/${newTests.length} passed`, color: allPass ? '#8af0c0' : '#ff8a5c' })

    setOutput(outputLines)

    const msg: ChatMessage = allPass
      ? { role: 'ferris', text: `🎉 Les ${newTests.length} tests passent ! +${kata.xpReward} XP ! ${kata.id === 'kata-12' ? 'Emprunt propre, sans .clone(). Joli zero-cost abstraction !' : 'Excellent travail !'}`, timestamp: Date.now() }
      : { role: 'ferris', text: `Pas encore — ${newTests.filter(t => !t.pass).map(t => t.name).join(', ')} échoue(nt). Clique 💡 Indice +1 si tu bloques.`, timestamp: Date.now() }

    setChat(prev => [...prev, msg])

    if (allPass && !alreadyCompleted.current) {
      alreadyCompleted.current = true
      completeKata(kata.id, kata.concept, kata.xpReward)
    }
    setIsCompiling(false)
  }, [kata, code, completeKata, applyDiagnostics])

  const hint = useCallback(() => {
    const idx = Math.min(hintIndex, kata.hints.length - 1)
    setChat(prev => [...prev, { role: 'hint', text: kata.hints[idx], timestamp: Date.now() }])
    setHintIndex(i => Math.min(i + 1, kata.hints.length))
  }, [hintIndex, kata.hints])

  const buildFerrisContext = useCallback(() => ({
    kataTitle: kata.title,
    kataDescription: kata.description,
    kataConcept: kata.concept,
    kataDifficulty: kata.difficulty,
    code,
    tests,
    output,
    history: chat,
  }), [kata.title, kata.description, kata.concept, kata.difficulty, code, tests, output, chat])

  const doExplain = useCallback(async () => {
    setIsReplying(true)
    const msgId = Date.now()
    setChat(prev => [...prev, { role: 'ferris', text: '', timestamp: msgId }])
    await explainCode(code, kata.title, buildFerrisContext(), (token) => {
      setChat(prev => prev.map(m => m.timestamp === msgId ? { ...m, text: m.text + token } : m))
    })
    setIsReplying(false)
  }, [code, kata.title, buildFerrisContext])

  const doReview = useCallback(async () => {
    setIsReplying(true)
    const msgId = Date.now()
    setChat(prev => [...prev, { role: 'review', text: '', timestamp: msgId }])
    await reviewCode(code, kata.title, buildFerrisContext(), (token) => {
      setChat(prev => prev.map(m => m.timestamp === msgId ? { ...m, text: m.text + token } : m))
    })
    setIsReplying(false)
  }, [code, kata.title, buildFerrisContext])

  const send = useCallback(async () => {
    const v = input.trim()
    if (!v) return
    setInput('')
    const msgId = Date.now()
    setChat(prev => [...prev, { role: 'user', text: v, timestamp: msgId }])
    setIsReplying(true)
    const replyMsgId = Date.now() + 1
    setChat(prev => [...prev, { role: 'ferris', text: '', timestamp: replyMsgId }])
    await askFerris(v, code, kata.title, chat, buildFerrisContext(), (token) => {
      setChat(prev => prev.map(m => m.timestamp === replyMsgId ? { ...m, text: m.text + token } : m))
    }, !useKataContext)
    setIsReplying(false)
  }, [input, code, kata.title, chat, buildFerrisContext, useKataContext])

  const reset = useCallback(() => {
    if (editorViewRef.current) {
      editorViewRef.current.dispatch({
        changes: { from: 0, to: editorViewRef.current.state.doc.length, insert: kata.starterCode }
      })
      editorViewRef.current.dispatch(setLintDiagnostics(editorViewRef.current.state, []))
    }
    saveCode(kata.id, kata.starterCode)
    setCode(kata.starterCode)
    setRan(false)
    setTests([])
    setOutput([])
    diagnosticsRef.current = []
  }, [kata.id, kata.starterCode])

  const passCount = tests.filter(t => t.pass).length
  const testColor = tests.length === 0 ? '#7f9cc4' : passCount === tests.length ? '#8af0c0' : passCount === 0 ? '#7f9cc4' : '#ffd08a'

  function getBubbleClass(role: string) {
    if (role === 'user') return 'bubble bubble--user'
    if (role === 'hint') return 'bubble bubble--hint'
    if (role === 'review') return 'bubble bubble--review'
    return 'bubble bubble--ferris'
  }

  const difficultyColor = { facile: '#8af0c0', moyen: '#ffd08a', difficile: '#ff8a5c', expert: '#c9b6ff' }[kata.difficulty]
  const difficultyBg = { facile: 'rgba(74,222,128,.12)', moyen: 'rgba(255,194,75,.12)', difficile: 'rgba(255,138,92,.12)', expert: 'rgba(167,139,250,.12)' }[kata.difficulty]

  const nextKata = KATAS.find(k => k.number === kata.number + 1)

  return (
    <div className="kata-screen">
      {/* Brief + tests */}
      <div className="kata-brief">
        <div className="kata-tags">
          <span className="tag" style={{ color: difficultyColor, background: difficultyBg }}>● {kata.difficulty.charAt(0).toUpperCase() + kata.difficulty.slice(1)}</span>
          <span className="tag" style={{ color: '#9fd0ff', background: 'rgba(61,155,255,.14)' }}>{kata.concept}</span>
          <span className="tag" style={{ color: '#ffd08a', background: 'rgba(255,194,75,.12)' }}>+{kata.xpReward} XP</span>
        </div>

        <div>
          <h2 className="kata-title">{kata.title}</h2>
          <div className="kata-subtitle">{kata.titleEn} · Kata {kata.number}/{kata.total}</div>
        </div>

        <p
          className="kata-desc"
          dangerouslySetInnerHTML={{ __html: kata.description }}
        />

        <div className="kata-tests-panel">
          <div className="kata-tests-header">
            <span className="mono-label">Tests</span>
            <span style={{ color: testColor, fontWeight: 800, fontSize: 13 }}>
              {ran ? `${passCount} / ${kata.tests.length}` : '— / ' + kata.tests.length}
            </span>
          </div>

          {ran ? (
            <div className="test-list">
              {tests.map(t => (
                <div key={t.name} className="test-row" style={{ color: t.pass ? '#8af0c0' : '#ff8a5c' }}>
                  <span>{t.pass ? '✓' : '✗'}</span>
                  <span>{t.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="kata-test-hint">Clique sur <b style={{ color: '#9fd0ff' }}>▶ Exécuter</b> pour compiler et exécuter ton code sur le Rust Playground.</p>
          )}
        </div>

        {progress.katasCompleted.includes(kata.id) && (
          <div className="kata-completed-badge">
            ✅ Kata complété ! +{kata.xpReward} XP engrangés
          </div>
        )}

        {nextKata && progress.katasCompleted.includes(kata.id) && (
          <button
            className="btn btn--primary"
            style={{ width: '100%', marginTop: 8 }}
            onClick={() => setCurrentKata(nextKata.id)}
          >
            Kata suivant → {nextKata.title}
          </button>
        )}
      </div>

      {/* Editor */}
      <div className="kata-editor">
        <div className="editor-toolbar">
          <span className="editor-tab">main.rs</span>
            <button className="btn-ghost" onClick={reset}>↺ Réinitialiser</button>
            <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
            <button className="btn btn--run" onClick={run} disabled={isCompiling}>{isCompiling ? 'Compiling…' : '▶ Exécuter'}</button>
            </div>
          </div>

        <div className="code-editor" ref={editorRef} />

        <div className="editor-output">
          {output.length === 0
            ? <span style={{ color: '#4a6080' }}>// Prêt — clique ▶ Exécuter (compile + run sur Rust Playground)</span>
            : output.map((o, i) => <div key={i} style={{ color: o.color }}>{o.text}</div>)
          }
        </div>
      </div>

      {/* Ferris AI Chat */}
      <div className="ferris-panel">
        <div className="ferris-header">
          <div className="ferris-avatar floaty">🦀</div>
          <div>
            <div className="ferris-name">Ferris</div>
            <div className="ferris-status">
              <span className={`status-dot ${modelReady ? 'status-dot--green' : 'status-dot--yellow'}`} />
              Mentor{modelReady
                ? ` · prêt · ${getModelInfo().multithread ? getModelInfo().threads + ' threads' : 'mono-thread'}`
                : dlProgress.phase === 'downloading'
                  ? ` · téléchargement ${dlProgress.pct}%`
                  : dlProgress.phase === 'error'
                    ? ' · erreur de chargement'
                    : ' · téléchargement...'
              }
            </div>
          </div>
        </div>

        <div className="chat-messages">
          {chat.map((msg, i) => (
            <div key={i} className={getBubbleClass(msg.role)}>
              {msg.text}
            </div>
          ))}
          {isReplying && (
            <div className="bubble bubble--ferris">
              <span className="typing-dots"><span/><span/><span/></span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="ferris-actions">
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 11, color: 'var(--text-dim)', cursor: 'pointer', userSelect: 'none' }}>
            <input type="checkbox" checked={useKataContext} onChange={e => setUseKataContext(e.target.checked)} disabled={!modelReady} style={{ accentColor: 'var(--blue)' }} />
            Contexte kata
          </label>
          <div className="quick-actions">
            <button className="quick-btn quick-btn--blue" onClick={doExplain} disabled={!modelReady || isReplying}>Explique le code</button>
            <button className="quick-btn quick-btn--yellow" onClick={hint}>💡 Indice +1</button>
            <button className="quick-btn quick-btn--purple" onClick={doReview} disabled={!modelReady || isReplying}>Code review</button>
          </div>
          <div className="chat-input-row">
            <input
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && modelReady) send() }}
              placeholder={modelReady ? "Demande à Ferris…" : "Téléchargement du modèle…"}
              disabled={!modelReady || isReplying}
            />
            <button className="chat-send" onClick={send} disabled={!modelReady || isReplying}>➤</button>
          </div>
        </div>
      </div>
    </div>
  )
}
