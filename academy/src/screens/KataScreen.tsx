import { useState, useEffect, useRef, useCallback } from 'react'
import { useApp } from '../store/AppContext'
import { getKataById, KATAS } from '../data/katas'
import { askFerris, explainCode, reviewCode } from '../llm/ferris'
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

// Simulated WASM sandbox result
function runInSandbox(kata: ReturnType<typeof getKataById>, code: string) {
  if (!kata) return { tests: [], output: [], allPass: false }

  const tests = kata.tests.map(t => ({
    name: t.name,
    pass: t.check(code)
  }))

  const allPass = tests.every(t => t.pass)
  const output: Array<{ text: string; color: string }> = []

  if (allPass) {
    output.push({ text: `   Compiling rust-dojo v0.1.0 (wasm sandbox)`, color: '#5a7290' })
    output.push({ text: `   Running tests...`, color: '#5a7290' })
    output.push({ text: `test result: ok. ${tests.length} passed; 0 failed`, color: '#8af0c0' })
  } else {
    const failed = tests.filter(t => !t.pass)
    if (code.includes('error') || failed.some(t => t.name.includes('error'))) {
      output.push({ text: `error[E0382]: borrow of moved value`, color: '#ff8a5c' })
      output.push({ text: `  --> main.rs  — valeur déplacée puis utilisée`, color: '#9db6d6' })
    } else {
      output.push({ text: `   Compiling rust-dojo v0.1.0 (wasm sandbox)`, color: '#5a7290' })
      output.push({ text: `test result: FAILED. ${tests.filter(t => t.pass).length} passed; ${failed.length} failed`, color: '#ff8a5c' })
      for (const f of failed) {
        output.push({ text: `  ✗ ${f.name}`, color: '#ff8a5c' })
      }
    }
  }

  return { tests, output, allPass }
}

export function KataScreen() {
  const { progress, currentKataId, setCurrentKata, completeKata, setScreen } = useApp()
  const kata = getKataById(currentKataId) ?? KATAS[11]
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
  const chatEndRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const editorViewRef = useRef<EditorView | null>(null)
  const diagnosticsRef = useRef<Diagnostic[]>([])
  const alreadyCompleted = useRef(false)
  const [isCompiling, setIsCompiling] = useState(false)

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
    const compile = await compileRust(code)
    const compileDiagnostics = diagnosticsFromRustStderr(code, compile.stderr)
    applyDiagnostics(compileDiagnostics)

    if (!compile.success) {
      const stderrLines = compile.stderr.split(/\r?\n/).filter(Boolean).slice(0, 8)
      setOutput([
        { text: '   Compiling rust-dojo v0.1.0 (playground)', color: '#5a7290' },
        ...stderrLines.map(line => ({ text: line, color: '#ff8a5c' })),
      ])
      setRan(false)
      setTests([])
      setChat(prev => [...prev, { role: 'ferris', text: 'Le compilateur Rust réel a trouvé des erreurs. Elles sont soulignées dans l\'éditeur.', timestamp: Date.now() }])
      setIsCompiling(false)
      return
    }

    const { tests: newTests, output: newOutput, allPass } = runInSandbox(kata, code)
    setTests(newTests)
    setOutput(newOutput)
    setRan(true)

    const msg: ChatMessage = allPass
      ? { role: 'ferris', text: `🎉 Les ${newTests.length} tests passent ! ${allPass ? '+' + kata.xpReward + ' XP !' : ''} ${kata.id === 'kata-12' ? 'Emprunt propre, sans .clone(). Joli zero-cost abstraction !' : 'Excellent travail !'}`, timestamp: Date.now() }
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

  const doExplain = useCallback(async () => {
    setIsReplying(true)
    const msg = await explainCode(code, kata.title)
    setChat(prev => [...prev, { role: 'ferris', text: msg, timestamp: Date.now() }])
    setIsReplying(false)
  }, [code, kata.title])

  const doReview = useCallback(async () => {
    setIsReplying(true)
    const msg = await reviewCode(code, kata.title)
    setChat(prev => [...prev, { role: 'review', text: msg, timestamp: Date.now() }])
    setIsReplying(false)
  }, [code, kata.title])

  const send = useCallback(async () => {
    const v = input.trim()
    if (!v) return
    setInput('')
    setChat(prev => [...prev, { role: 'user', text: v, timestamp: Date.now() }])
    setIsReplying(true)
    const reply = await askFerris(v, code, kata.title, chat)
    setChat(prev => [...prev, { role: 'ferris', text: reply, timestamp: Date.now() }])
    setIsReplying(false)
  }, [input, code, kata.title, chat])

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
            <p className="kata-test-hint">Clique sur <b style={{ color: '#9fd0ff' }}>▶ Exécuter</b> pour lancer les tests dans le bac à sable WASM.</p>
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
            ? <span style={{ color: '#4a6080' }}>// Prêt — clique ▶ Exécuter</span>
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
              <span className="status-dot status-dot--green" />
              Mentor · règles contextuelles
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
          <div className="quick-actions">
            <button className="quick-btn quick-btn--blue" onClick={doExplain}>Explique le code</button>
            <button className="quick-btn quick-btn--yellow" onClick={hint}>💡 Indice +1</button>
            <button className="quick-btn quick-btn--purple" onClick={doReview}>Code review</button>
          </div>
          <div className="chat-input-row">
            <input
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') send() }}
              placeholder="Demande à Ferris…"
            />
            <button className="chat-send" onClick={send}>➤</button>
          </div>
        </div>
      </div>
    </div>
  )
}
