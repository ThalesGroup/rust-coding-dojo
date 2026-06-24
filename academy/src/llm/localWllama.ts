import { LoggerWithoutDebug, Wllama } from '@wllama/wllama'
import wasmUrl from '@wllama/wllama/esm/wasm/wllama.wasm?url'
import type { ChatMessage } from '../types'

const MODEL = {
  repo: 'LiquidAI/LFM2.5-350M-GGUF',
  file: 'LFM2.5-350M-Q4_K_M.gguf',
}

const SYSTEM_PROMPT = `Tu es Ferris, le mentor IA du Rust Dojo. Tu aides les apprenants à comprendre Rust avec des explications courtes, pédagogiques et encourageantes. Réponds en français par défaut. Si la question concerne un kata, donne des indices progressifs et n'écris pas la solution complète sauf demande explicite. Appuie-toi sur le contexte du kata, le code actuel et les résultats de tests fournis.`

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

export function isModelReady() {
  return wllama?.isModelLoaded() ?? false
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

export async function generateLocalFerrisReply(userMessage: string, context: FerrisContext, onToken?: (token: string) => void) {
  await ensureModelLoaded()
  if (!wllama) throw new Error('Le moteur local Ferris est indisponible.')

  let reply = ''
  await wllama.createChatCompletion({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...buildRecentHistory(context.history ?? []),
      { role: 'user', content: buildPrompt(userMessage, context) },
    ],
    stream: true,
    max_tokens: 300,
    temperature: 0.4,
    top_p: 0.9,
    top_k: 40,
    onData: (chunk) => {
      const token = chunk.choices[0]?.delta.content ?? ''
      reply += token
      onToken?.(token)
    },
  })

  return reply.trim() || 'Je n’ai pas réussi à produire une réponse exploitable. Essaie de reformuler ta question.'
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

  loadPromise ??= wllama.loadModelFromHF(
    { repo: MODEL.repo, file: MODEL.file },
    {
      n_ctx: 4096,
      n_threads: getThreadCount(),
      n_gpu_layers: wllama.isSupportWebGPU() ? 99999 : 0,
      useCache: true,
    },
  ).then(() => {
    if (wllama) {
      multithreadAvailable = wllama.isMultithread()
      actualThreads = wllama.getNumThreads()
      console.log(`[ferris] model loaded — ${actualThreads} threads, multithread=${multithreadAvailable}, webgpu=${wllama?.isSupportWebGPU() ?? false}`)
    }
  })

  return loadPromise
}

function buildPrompt(userMessage: string, context: FerrisContext) {
  return `Contexte du kata :

Titre : ${context.kataTitle}
Concept : ${context.kataConcept ?? 'non renseigné'}
Difficulté : ${context.kataDifficulty ?? 'non renseignée'}

Description :
${stripHtml(context.kataDescription ?? 'Non renseignée')}

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

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function getThreadCount() {
  if (!crossOriginIsolated) return 1
  return Math.max(2, Math.min(8, Math.floor((navigator.hardwareConcurrency || 4) / 2)))
}
