import { LoggerWithoutDebug, Wllama } from '@wllama/wllama'
import wasmUrl from '@wllama/wllama/esm/wasm/wllama.wasm?url'
import type { ChatMessage } from '../types'

const MODEL = {
  repo: 'LiquidAI/LFM2.5-350M-GGUF',
  file: 'LFM2.5-350M-Q4_K_M.gguf',
}

const SYSTEM_PROMPT = `You are Ferris, the Rust Dojo AI mentor. Help learners understand Rust with short, educational, and encouraging explanations. Respond in English by default. If the question concerns a kata, give progressive hints and do not write the full solution unless explicitly asked. Rely on the kata context, current code, and provided test results.`

export interface FerrisContext {
  kataTitle: string
  kataDescription?: string
  kataConcept?: string
  kataDifficulty?: string
  code: string
  tests?: Array<{ name: string; pass: boolean }>
  output?: Array<{ text: string; color?: string }>
  history?: ChatMessage[]
}

let wllama: Wllama | null = null
let loadPromise: Promise<void> | null = null
let actualThreads = 1
let multithreadAvailable = false

export interface DownloadProgress {
  phase: 'idle' | 'downloading' | 'loading' | 'ready' | 'error'
  loaded: number
  total: number
  pct: number
}

let downloadProgress: DownloadProgress = { phase: 'idle', loaded: 0, total: 0, pct: 0 }

export function isModelReady() {
  return wllama?.isModelLoaded() ?? false
}

export function getDownloadProgress(): DownloadProgress {
  return downloadProgress
}

export function getModelInfo() {
  return {
    threads: actualThreads,
    multithread: multithreadAvailable,
    webgpu: wllama?.isSupportWebGPU() ?? false,
    crossOriginIsolated: typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated,
  }
}

export function preloadModel() {
  ensureModelLoaded()
}

export async function generateLocalFerrisReply(userMessage: string, context: FerrisContext, onToken?: (token: string) => void, skipContext?: boolean) {
  await ensureModelLoaded()
  if (!wllama) throw new Error('Local Ferris engine is unavailable.')

  const history = skipContext ? [] : buildRecentHistory(context.history ?? [])
  const prompt = skipContext ? userMessage : buildPrompt(userMessage, context)

  let reply = ''
  await wllama.createChatCompletion({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: prompt },
    ],
    stream: true,
    max_tokens: 10000,
    temperature: 0,
    top_p: 0.9,
    top_k: 40,
    onData: (chunk) => {
      const token = chunk.choices[0]?.delta.content ?? ''
      reply += token
      onToken?.(token)
    },
  })

  return reply.trim() || 'I could not produce a useful answer. Try rephrasing your question.'
}

function ensureModelLoaded() {
  if (!wllama) {
    wllama = new Wllama(
      { default: wasmUrl },
      {
        allowOffline: true,
        logger: LoggerWithoutDebug,
        parallelDownloads: 3,
      },
    )
  }

  if (wllama.isModelLoaded()) return Promise.resolve()

  downloadProgress = { phase: 'downloading', loaded: 0, total: 0, pct: 0 }

  async function doLoad() {
    try {
      await wllama!.loadModelFromHF(
        { repo: MODEL.repo, file: MODEL.file },
        {
          n_ctx: 4096,
          n_threads: getThreadCount(),
          n_gpu_layers: wllama!.isSupportWebGPU() ? 99999 : 0,
          useCache: true,
          progressCallback: (opts) => {
            downloadProgress = {
              phase: 'downloading',
              loaded: opts.loaded,
              total: opts.total,
              pct: Math.round((opts.loaded / (opts.total || 1)) * 100),
            }
          },
        },
      )
    } catch (err) {
      // If first attempt fails, clear cache and retry once
      console.warn('[ferris] first load attempt failed, retrying with fresh cache', err)
      try {
        await wllama!.cacheManager.clear()
      } catch { /* ignore */ }
      downloadProgress = { phase: 'downloading', loaded: 0, total: 0, pct: 0 }
      await wllama!.loadModelFromHF(
        { repo: MODEL.repo, file: MODEL.file },
        {
          n_ctx: 4096,
          n_threads: getThreadCount(),
          n_gpu_layers: wllama!.isSupportWebGPU() ? 99999 : 0,
          useCache: true,
          progressCallback: (opts) => {
            downloadProgress = {
              phase: 'downloading',
              loaded: opts.loaded,
              total: opts.total,
              pct: Math.round((opts.loaded / (opts.total || 1)) * 100),
            }
          },
        },
      )
    }
  }

  loadPromise ??= doLoad().then(() => {
    if (wllama) {
      multithreadAvailable = wllama.isMultithread()
      actualThreads = wllama.getNumThreads()
      downloadProgress = { phase: 'ready', loaded: 1, total: 1, pct: 100 }
      console.log(`[ferris] model loaded — ${actualThreads} threads, multithread=${multithreadAvailable}, webgpu=${wllama?.isSupportWebGPU() ?? false}`)
    }
  }).catch((err) => {
    downloadProgress = { phase: 'error', loaded: 0, total: 0, pct: 0 }
    throw err
  })

  return loadPromise
}

function buildPrompt(userMessage: string, context: FerrisContext) {
  return `Contexte du kata :

Titre : ${context.kataTitle}
Concept : ${context.kataConcept ?? 'non renseigné'}
Difficulté : ${context.kataDifficulty ?? 'non renseignée'}

Code actuel :
\`\`\`rust
${context.code}
\`\`\`

Résultats des tests :
${formatTests(context.tests ?? [])}

Sortie d'exécution :
${formatOutput(context.output ?? [])}

Question de l'apprenant :
${userMessage}`
}

function buildRecentHistory(history: ChatMessage[]) {
  return history
    .filter((message) => message.role === 'user' || message.role === 'ferris' || message.role === 'review' || message.role === 'hint')
    .slice(-6)
    .map((message) => ({
      role: message.role === 'user' ? 'user' as const : 'assistant' as const,
      content: message.text,
    }))
}

function formatTests(tests: Array<{ name: string; pass: boolean }>) {
  if (tests.length === 0) return 'Les tests n’ont pas encore été lancés.'
  return tests.map((test) => `${test.pass ? 'PASS' : 'FAIL'} ${test.name}`).join('\n')
}

function formatOutput(output: Array<{ text: string }>) {
  if (output.length === 0) return 'Aucune sortie disponible.'
  return output.map((line) => line.text).join('\n')
}

function getThreadCount() {
  if (!crossOriginIsolated) return 1
  return Math.max(2, Math.min(8, Math.floor((navigator.hardwareConcurrency || 4) / 2)))
}
