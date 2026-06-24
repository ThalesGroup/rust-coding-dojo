import { useState, useEffect, useRef, useCallback } from 'react'
import { useApp } from '../store/AppContext'
import { getKataById, KATAS } from '../data/katas'
import { askFerris, preloadModel, isModelReady, getModelInfo, getDownloadProgress } from '../llm/ferris'
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
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const CODE_LS_PREFIX = 'rust-dojo-kata-code:'
const SOL_CACHE_PREFIX = 'rust-dojo-solution-out:'
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

function getCachedSolutionOutput(kataId: string): string | null {
  try {
    return localStorage.getItem(SOL_CACHE_PREFIX + kataId)
  } catch {
    return null
  }
}

function setCachedSolutionOutput(kataId: string, output: string): void {
  try {
    localStorage.setItem(SOL_CACHE_PREFIX + kataId, output)
  } catch {
    // ignore
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

function renderKataMarkdown(markdown: string): string {
  try {
    const html = marked.parse(markdown, { async: false, breaks: true, gfm: true }) as string
    return DOMPurify.sanitize(html)
  } catch {
    return markdown
  }
}

export function KataScreen() {
  const { progress, currentKataId, completeKata } = useApp()
  const kata = getKataById(currentKataId) ?? KATAS[0]
  const initialCode = loadSavedCode(kata.id, kata.starterCode)

  const [code, setCode] = useState(initialCode)
  const [ran, setRan] = useState(false)
  const [tests, setTests] = useState<Array<{ name: string; pass: boolean }>>([])
  const [output, setOutput] = useState<Array<{ text: string; color: string }>>([])
  const [chat, setChat] = useState<ChatMessage[]>([
    { role: 'ferris', text: "Hi! I’m Ferris 🦀, your mentor. Run the code with ▶ Run, or ask me for a hint 💡.", timestamp: Date.now() }
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
  const [dlProgress, setDlProgress] = useState<DownloadProgress>({ phase: 'idle', loaded: 0, total: 0, pct: 0 })
  const [useKataContext, setUseKataContext] = useState(true)
  const [showKataModal, setShowKataModal] = useState(true)

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
    setShowKataModal(true)
    setChat([{ role: 'ferris', text: `Kata: "${kata.title}". ${kata.difficulty === 'facile' ? 'An easy-level kata — good luck!' : 'A challenge to strengthen your ownership skills!'}`, timestamp: Date.now() }])
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
    const userResult = await compileRust(code)
    const compileDiagnostics = diagnosticsFromRustStderr(code, userResult.stderr)
    applyDiagnostics(compileDiagnostics)

    if (!userResult.success) {
      const stderrLines = userResult.stderr.split(/\r?\n/).filter(Boolean).slice(0, 12)
      setOutput([
        { text: '   Compiling rust-dojo v0.1.0 (playground)', color: '#5a7290' },
        ...stderrLines.map(line => ({ text: line, color: '#ff8a5c' })),
      ])
      setRan(false)
      setTests([])
      setChat(prev => [...prev, { role: 'ferris', text: 'The Rust compiler found errors — they are highlighted in the editor.', timestamp: Date.now() }])
      setIsCompiling(false)
      return
    }

    const { tests: newTests, allPass: regexPass } = evaluateKataTests(kata, code)

    // Execute solution to get reference stdout (with cache)
    let solutionStdout: string | null = getCachedSolutionOutput(kata.id)
    let stdoutMatch = true
    let solExecuted = false
    if (!solutionStdout && kata.solutionCode && kata.solutionCode.trim()) {
      const solResult = await compileRust(kata.solutionCode)
      if (solResult.success) {
        solutionStdout = solResult.stdout
        setCachedSolutionOutput(kata.id, solutionStdout)
        solExecuted = true
      } else {
        solutionStdout = null
      }
    } else if (solutionStdout) {
      solExecuted = true
    }
    if (solutionStdout !== null) {
      stdoutMatch = userResult.stdout.trim() === solutionStdout.trim()
    }

    setTests(newTests)
    setRan(true)

    const allPass = regexPass && stdoutMatch
    const outputLines: Array<{ text: string; color: string }> = []
    outputLines.push({ text: '   Compiling rust-dojo v0.1.0 (rust playground)', color: '#5a7290' })
    if (userResult.stdout) {
      outputLines.push({ text: '   Running...', color: '#5a7290' })
      userResult.stdout.split(/\r?\n/).filter(Boolean).forEach(line => {
        outputLines.push({ text: line, color: '#c0caf5' })
      })
    }
    outputLines.push({ text: '', color: '#4a6080' })

    if (solExecuted) {
      const matchLabel = stdoutMatch ? '✓ identique' : '✗ différent'
      const matchColor = stdoutMatch ? '#8af0c0' : '#ff8a5c'
      outputLines.push({ text: `   Output vs solution: ${matchLabel}`, color: matchColor })
    } else if (kata.solutionCode && kata.solutionCode.trim()) {
      outputLines.push({ text: '   Solution output: (not available)', color: '#7f9cc4' })
    }
    outputLines.push({ text: `   Kata tests: ${newTests.filter(t => t.pass).length}/${newTests.length} passed`, color: allPass ? '#8af0c0' : '#ff8a5c' })

    setOutput(outputLines)

    const msg: ChatMessage = allPass
      ? { role: 'ferris', text: `🎉 Les ${newTests.length} tests passent et la sortie correspond à la solution ! +${kata.xpReward} XP !`, timestamp: Date.now() }
      : stdoutMatch
        ? { role: 'ferris', text: `Pas encore — ${newTests.filter(t => !t.pass).map(t => t.name).join(', ')} échoue(nt). Clique 💡 Indice +1 si tu bloques.`, timestamp: Date.now() }
        : { role: 'ferris', text: `La sortie de ton code ne correspond pas à la solution attendue. Vérifie les println!().`, timestamp: Date.now() }

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
    }, true)
    setIsReplying(false)
  }, [input, code, kata.title, chat, buildFerrisContext])

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

  function renderMarkdown(text: string, role: string): string {
    if (role === 'user') return escapeHtml(text)
    try {
      const html = marked.parse(text, { async: false }) as string
      return DOMPurify.sanitize(html)
    } catch {
      return escapeHtml(text)
    }
  }

  function escapeHtml(text: string): string {
    return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
  }

  function getBubbleClass(role: string) {
    if (role === 'user') return 'bubble bubble--user'
    if (role === 'hint') return 'bubble bubble--hint'
    return 'bubble bubble--ferris'
  }

  const difficultyColor = { facile: '#8af0c0', moyen: '#ffd08a', difficile: '#ff8a5c', expert: '#c9b6ff' }[kata.difficulty]
  const difficultyBg = { facile: 'rgba(74,222,128,.12)', moyen: 'rgba(255,194,75,.12)', difficile: 'rgba(255,138,92,.12)', expert: 'rgba(167,139,250,.12)' }[kata.difficulty]

  return (
    <div className="kata-screen">
      {/* Editor */}
        <div className="kata-editor">
          <div className="editor-toolbar">
          <span className="editor-tab">main.rs</span>
            <div className="kata-toolbar-title-wrap">
              <div className="kata-toolbar-title">{kata.title}</div>
              <div className="kata-tags kata-tags--toolbar">
                <span className="tag" style={{ color: difficultyColor, background: difficultyBg }}>● {kata.difficulty.charAt(0).toUpperCase() + kata.difficulty.slice(1)}</span>
                <span className="tag" style={{ color: '#9fd0ff', background: 'rgba(61,155,255,.14)' }}>{kata.concept}</span>
                <span className="tag" style={{ color: '#ffd08a', background: 'rgba(255,194,75,.12)' }}>+{kata.xpReward} XP</span>
              </div>
            </div>
            <button className="btn-ghost" onClick={() => setShowKataModal(true)}>📘 Instructions</button>
            <button className="btn-ghost" onClick={reset}>↺ Reset</button>
            <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
            <button className="btn btn--run" onClick={run} disabled={isCompiling}>{isCompiling ? 'Compiling…' : '▶ Run'}</button>
            </div>
          </div>

        <div className="code-editor" ref={editorRef} />

        <div className="editor-output">
          {output.length === 0
            ? <span style={{ color: '#4a6080' }}>// Ready — click ▶ Run (compile + run on Rust Playground)</span>
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
                ? ` · ready · ${getModelInfo().multithread ? getModelInfo().threads + ' threads' : 'single-thread'}`
                : dlProgress.phase === 'downloading'
                  ? ` · downloading ${dlProgress.pct}%`
                  : dlProgress.phase === 'error'
                    ? ' · load error'
                    : ' · downloading...'
              }
            </div>
          </div>
        </div>

        <div className="chat-messages">
          {chat.map((msg, i) => (
            <div key={i} className={getBubbleClass(msg.role)}>
              <div className="bubble-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text, msg.role) }} />
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
          Kata context
          </label>
          <div className="quick-actions">
            <button className="quick-btn quick-btn--yellow" onClick={hint}>💡 Hint +1</button>
          </div>
          <div className="chat-input-row">
            <input
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && modelReady) send() }}
              placeholder={modelReady ? "Ask Ferris…" : "Model downloading…"}
              disabled={!modelReady || isReplying}
            />
            <button className="chat-send" onClick={send} disabled={!modelReady || isReplying}>➤</button>
          </div>
        </div>
      </div>

      {showKataModal && (
        <div className="kata-modal-overlay" onClick={() => setShowKataModal(false)}>
          <div className="kata-modal" onClick={e => e.stopPropagation()}>
            <div className="kata-modal-header">
              <div>
                <div className="kata-tags" style={{ marginBottom: 8 }}>
                  <span className="tag" style={{ color: difficultyColor, background: difficultyBg }}>● {kata.difficulty.charAt(0).toUpperCase() + kata.difficulty.slice(1)}</span>
                  <span className="tag" style={{ color: '#9fd0ff', background: 'rgba(61,155,255,.14)' }}>{kata.concept}</span>
                  <span className="tag" style={{ color: '#ffd08a', background: 'rgba(255,194,75,.12)' }}>+{kata.xpReward} XP</span>
                </div>
                <h2 className="kata-title" style={{ marginBottom: 6 }}>{kata.title}</h2>
                <div className="kata-subtitle">{kata.titleEn} · Kata {kata.number}/{kata.total}</div>
              </div>
              <button className="btn-ghost" onClick={() => setShowKataModal(false)}>✕ Close</button>
            </div>

            <div className="kata-modal-body">
              <div className="kata-desc kata-desc--markdown" dangerouslySetInnerHTML={{ __html: renderKataMarkdown(kata.description) }} />

              <div className="kata-tests-panel" style={{ marginTop: 14 }}>
                <div className="kata-tests-header">
                    <span className="mono-label">Expected tests</span>
                  <span style={{ color: '#7f9cc4', fontWeight: 700, fontSize: 12 }}>{kata.tests.length}</span>
                </div>
                <div className="test-list">
                  {kata.tests.map(t => (
                    <div key={t.name} className="test-row" style={{ color: '#9db6d6' }}>
                      <span>•</span>
                      <span>{t.description || t.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
