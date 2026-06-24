import { LoggerWithoutDebug, Wllama, WllamaAbortError } from '@wllama/wllama';
import type { ChatCompletionChunk, RawCompletionChunk } from '@wllama/wllama';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import wasmUrl from '@wllama/wllama/esm/wasm/wllama.wasm?url';

const MODEL = {
  repo: 'LiquidAI/LFM2.5-350M-GGUF',
  file: 'LFM2.5-350M-Q4_K_M.gguf',
  displayName: 'LFM2.5-350M-Q4_K_M.gguf',
};

const DEFAULT_PROMPT = "Explique en français, en trois points, pourquoi Rust utilise l'ownership.";
const DEFAULT_INITIAL_MESSAGE =
  "Pose-moi une question sur Rust ou sur un kata. Je te guiderai avec des indices progressifs.";
const FIRST_TOKEN_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_TOKENS = 1024;
const MAX_TOKENS_LIMIT = 2048;
const LOW_INFO_WARNING_THRESHOLD = 20;
const LOW_INFO_ABORT_THRESHOLD = 80;
const SYSTEM_PROMPT =
  "Tu es Kani-sensei, un vieux crabe sage, patient et malicieux, expert du Rust Dojo. Tu aides les apprenants à comprendre Rust avec des explications concises, pédagogiques et encourageantes. Réponds en français par défaut. Si la question concerne un kata, guide l'apprenant avec des indices progressifs et ne donne pas la solution complète sauf demande explicite. Évite les grands tableaux Markdown : si un tableau est utile, limite-le à 5 lignes maximum et préfère ensuite une courte synthèse en puces.";

type UiState = 'idle' | 'downloading' | 'loading' | 'ready' | 'generating' | 'error';
type GenerationMode = 'chat-system' | 'chat-user' | 'raw';

export interface AssistantOptions {
  initialPrompt?: string;
  initialMessage?: string;
  title?: string;
  placeholder?: string;
  debug?: boolean;
  maxTokens?: number;
  autoLoad?: boolean;
  contextProvider?: () => string;
}

export interface AssistantWidget {
  loadModel: () => Promise<void>;
  generate: (prompt?: string) => Promise<void>;
  stop: () => void;
  destroy: () => Promise<void>;
}

export function mountAssistant(container: HTMLElement, options: AssistantOptions = {}): AssistantWidget {
  const debugEnabled = options.debug ?? false;
  container.innerHTML = getWidgetTemplate({
    debug: debugEnabled,
    title: options.title ?? 'Kani-sensei',
    placeholder: options.placeholder ?? 'Pose ta question sur Rust...',
  });

  const statusLabel = getElement(container, 'status-label');
  const statusDetail = getElement(container, 'status-detail');
  const errorMessage = getElement(container, 'error-message');
  const output = getElement(container, 'output');
  const promptInput = getElement(container, 'prompt-input') as HTMLTextAreaElement;
  const progress = getElement(container, 'download-progress') as HTMLProgressElement;
  const progressLabel = getElement(container, 'progress-label');
  const generateButton = getElement(container, 'generate-button') as HTMLButtonElement;
  const stopButton = getElement(container, 'stop-button') as HTMLButtonElement;
  const clearButton = getElement(container, 'clear-button') as HTMLButtonElement;

  const modelSource = getOptionalElement(container, 'model-source');
  const webGpuLabel = getOptionalElement(container, 'webgpu-label');
  const threadLabel = getOptionalElement(container, 'thread-label');
  const generationModeInput = getOptionalElement(container, 'generation-mode') as HTMLSelectElement | null;
  const debugToggle = getOptionalElement(container, 'debug-toggle') as HTMLInputElement | null;
  const gpuToggle = getOptionalElement(container, 'gpu-toggle') as HTMLInputElement | null;
  const maxTokensInput = getOptionalElement(container, 'max-tokens-input') as HTMLInputElement | null;
  const threadsInput = getOptionalElement(container, 'threads-input') as HTMLInputElement | null;
  const promptLength = getOptionalElement(container, 'prompt-length');
  const firstTokenTime = getOptionalElement(container, 'first-token-time');
  const chunkCount = getOptionalElement(container, 'chunk-count');
  const lowInfoCount = getOptionalElement(container, 'low-info-count');
  const lastChunk = getOptionalElement(container, 'last-chunk') as HTMLPreElement | null;

  const wllama = new Wllama(
    { default: wasmUrl },
    {
      allowOffline: true,
      logger: LoggerWithoutDebug,
      parallelDownloads: 3,
    },
  );

  let state: UiState = 'idle';
  let generationMode: GenerationMode = 'chat-system';
  let debugLogs = debugEnabled;
  let gpuOffload = true;
  let maxTokens = clampMaxTokens(options.maxTokens ?? DEFAULT_MAX_TOKENS);
  let threadCount = getDefaultThreadCount();
  let abortController: AbortController | null = null;
  let firstTokenTimeout: number | null = null;
  let generationStartedAt = 0;
  let firstTokenAt: number | null = null;
  let chunksReceived = 0;
  let markdownBuffer = '';
  let consecutiveLowInfoChunks = 0;
  let lowInfoWarningShown = false;
  let destroyed = false;

  promptInput.value = options.initialPrompt ?? DEFAULT_PROMPT;
  if (options.initialMessage ?? DEFAULT_INITIAL_MESSAGE) {
    appendMarkdown(options.initialMessage ?? DEFAULT_INITIAL_MESSAGE);
  }

  modelSource && (modelSource.textContent = `Modèle : ${MODEL.repo} / ${MODEL.file}`);
  webGpuLabel && (webGpuLabel.textContent = wllama.isSupportWebGPU() ? 'Disponible' : 'Indisponible, fallback WASM CPU');
  threadLabel &&
    (threadLabel.textContent = crossOriginIsolated
      ? `${threadCount} threads demandés`
      : 'Indisponible : COOP/COEP manquants');
  debugToggle && (debugToggle.checked = debugLogs);
  gpuToggle && (gpuToggle.checked = gpuOffload);
  maxTokensInput && (maxTokensInput.value = String(maxTokens));
  threadsInput && (threadsInput.value = String(threadCount));

  const onGenerateClick = () => void generate();
  const onPromptInput = () => updatePromptLength();
  const onClearClick = () => {
    clearOutput();
    lastChunk && (lastChunk.textContent = '');
    resetGenerationMetrics();
    clearError();
  };
  const onGenerationModeChange = () => {
    generationMode = (generationModeInput?.value as GenerationMode | undefined) ?? 'chat-system';
  };
  const onDebugToggleChange = () => {
    debugLogs = debugToggle?.checked ?? false;
  };
  const onGpuToggleChange = () => {
    gpuOffload = gpuToggle?.checked ?? true;
  };
  const onMaxTokensChange = () => {
    maxTokens = clampMaxTokens(Number.parseInt(maxTokensInput?.value ?? '', 10));
  };
  const onThreadsChange = () => {
    threadCount = clampThreadCount(Number.parseInt(threadsInput?.value ?? '', 10));
    if (threadLabel && !wllama.isModelLoaded()) {
      threadLabel.textContent = crossOriginIsolated ? `${threadCount} threads demandés` : 'Indisponible : COOP/COEP manquants';
    }
  };

  generateButton.addEventListener('click', onGenerateClick);
  stopButton.addEventListener('click', stopGeneration);
  promptInput.addEventListener('input', onPromptInput);
  clearButton.addEventListener('click', onClearClick);
  generationModeInput?.addEventListener('change', onGenerationModeChange);
  debugToggle?.addEventListener('change', onDebugToggleChange);
  gpuToggle?.addEventListener('change', onGpuToggleChange);
  maxTokensInput?.addEventListener('input', onMaxTokensChange);
  threadsInput?.addEventListener('input', onThreadsChange);

  setState('idle');
  updatePromptLength();

  if (options.autoLoad) {
    void loadModel();
  }

  async function loadModel() {
    if (destroyed) return;
    if (wllama.isModelLoaded()) {
      setState('ready');
      return;
    }

    clearError();
    updateProgress(0, '0%');
    setState('downloading');

    try {
      await wllama.loadModelFromHF(
        { repo: MODEL.repo, file: MODEL.file },
        {
          n_ctx: 2048,
          n_threads: threadCount,
          n_gpu_layers: gpuOffload && wllama.isSupportWebGPU() ? 99999 : 0,
          useCache: true,
          progressCallback: ({ loaded, total }) => {
            setState('downloading');
            if (total > 0) {
              const percentage = Math.min(100, Math.round((loaded / total) * 100));
              updateProgress(percentage, `${percentage}%`);
            } else {
              progress.removeAttribute('value');
              progressLabel.textContent = formatBytes(loaded);
              statusDetail.textContent = `Téléchargé : ${formatBytes(loaded)}`;
            }
          },
        },
      );

      setState('loading');
      updateProgress(100, '100%');
      debugLog('model metadata', wllama.getModelMetadata());
      debugLog('chat template', wllama.getChatTemplate());
      threadLabel && (threadLabel.textContent = wllama.isMultithread() ? `${wllama.getNumThreads()} threads` : 'Mono-thread fallback');
      setState('ready');
    } catch (error) {
      handleError(error);
    }
  }

  async function generate(promptOverride?: string) {
    if (destroyed) return;
    if (!wllama.isModelLoaded()) {
      await loadModel();
    }

    if (!wllama.isModelLoaded()) return;

    if (promptOverride !== undefined) {
      promptInput.value = promptOverride;
      updatePromptLength();
    }

    const userPrompt = promptInput.value.trim();
    if (!userPrompt) {
      showError('Le prompt ne peut pas être vide.');
      return;
    }

    const context = options.contextProvider?.().trim();
    const prompt = context
      ? `Contexte de l'exercice :\n\n${context}\n\nQuestion de l'apprenant :\n\n${userPrompt}`
      : userPrompt;

    abortController = new AbortController();
    clearError();
    clearOutput();
    lastChunk && (lastChunk.textContent = '');
    resetGenerationMetrics();
    setState('generating');
    generationStartedAt = performance.now();
    debugLog('generation input', {
      mode: generationMode,
      maxTokens,
      prompt,
      userPrompt,
      contextLength: context?.length ?? 0,
      promptLength: prompt.length,
      webGpu: wllama.isSupportWebGPU(),
      gpuOffloadRequested: gpuOffload,
      threadCountRequested: threadCount,
      crossOriginIsolated,
    });
    firstTokenTimeout = window.setTimeout(() => {
      showError(
        "Aucun token reçu après 30 secondes. La génération continue peut-être encore, mais le modèle semble bloqué sur ce prompt.",
      );
    }, FIRST_TOKEN_TIMEOUT_MS);

    try {
      if (generationMode === 'raw') {
        await generateRaw(prompt, maxTokens, abortController.signal);
      } else {
        await generateChat(prompt, maxTokens, generationMode, abortController.signal);
      }
      setState('ready');
    } catch (error) {
      if (error instanceof WllamaAbortError || abortController?.signal.aborted) {
        appendMarkdown('\n\n_Génération interrompue._');
        setState('ready');
      } else {
        handleError(error);
      }
    } finally {
      clearFirstTokenTimeout();
      abortController = null;
    }
  }

  async function generateChat(
    prompt: string,
    tokenLimit: number,
    mode: Exclude<GenerationMode, 'raw'>,
    abortSignal: AbortSignal,
  ) {
    await wllama.createChatCompletion({
      messages:
        mode === 'chat-system'
          ? [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: prompt },
            ]
          : [{ role: 'user', content: prompt }],
      stream: true,
      max_tokens: tokenLimit,
      temperature: 0.4,
      top_p: 0.9,
      top_k: 40,
      abortSignal,
      onData: (chunk) => handleChatChunk(chunk),
    });
  }

  async function generateRaw(prompt: string, tokenLimit: number, abortSignal: AbortSignal) {
    await wllama.createCompletion({
      prompt,
      stream: true,
      max_tokens: tokenLimit,
      temperature: 0.4,
      top_p: 0.9,
      top_k: 40,
      abortSignal,
      onData: (chunk) => handleRawChunk(chunk),
    });
  }

  function handleChatChunk(chunk: ChatCompletionChunk) {
    recordChunk(chunk);
    const token = chunk.choices[0]?.delta.content;
    if (token) {
      recordFirstToken();
      appendMarkdown(token);
    }
  }

  function handleRawChunk(chunk: RawCompletionChunk) {
    recordChunk(chunk);
    const token = chunk.choices[0]?.text;
    if (token) {
      recordFirstToken();
      appendMarkdown(token);
    }
  }

  function recordChunk(chunk: ChatCompletionChunk | RawCompletionChunk) {
    chunksReceived += 1;
    chunkCount && (chunkCount.textContent = `Chunks : ${chunksReceived}`);
    lastChunk && (lastChunk.textContent = JSON.stringify(chunk, null, 2));
    debugLog('chunk', chunk);
  }

  function recordFirstToken() {
    clearFirstTokenTimeout();
    clearError();
    if (firstTokenAt === null) {
      firstTokenAt = performance.now();
      firstTokenTime && (firstTokenTime.textContent = `Premier token : ${Math.round(firstTokenAt - generationStartedAt)} ms`);
    }
  }

  function stopGeneration() {
    abortController?.abort();
  }

  function setState(nextState: UiState) {
    state = nextState;
    statusLabel.textContent = getStateLabel(state);
    statusDetail.textContent = getStateDetail(state);
    generateButton.disabled = state === 'generating' || state === 'downloading' || state === 'loading';
    stopButton.disabled = state !== 'generating';
    promptInput.disabled = state === 'generating' || state === 'downloading' || state === 'loading';
    gpuToggle && (gpuToggle.disabled = state !== 'idle' || wllama.isModelLoaded());
    threadsInput && (threadsInput.disabled = state !== 'idle' || wllama.isModelLoaded());
    maxTokensInput && (maxTokensInput.disabled = state === 'generating');
    generationModeInput && (generationModeInput.disabled = state === 'generating');
  }

  function getStateLabel(currentState: UiState) {
    switch (currentState) {
      case 'idle':
        return 'Prêt à discuter';
      case 'downloading':
        return 'Téléchargement du modèle';
      case 'loading':
        return 'Chargement du modèle';
      case 'ready':
        return 'Prêt';
      case 'generating':
        return 'Réponse en cours';
      case 'error':
        return 'Erreur';
    }
  }

  function getStateDetail(currentState: UiState) {
    switch (currentState) {
      case 'idle':
        return 'Le modèle sera chargé au premier envoi.';
      case 'downloading':
        return `Téléchargement : ${progressLabel.textContent}`;
      case 'loading':
        return 'Préparation du runtime local.';
      case 'ready':
        return 'Le mentor local est disponible.';
      case 'generating':
        return 'Tu peux arrêter la génération si nécessaire.';
      case 'error':
        return 'Consulte le message ci-dessous.';
    }
  }

  function updateProgress(value: number, label: string) {
    progress.value = value;
    progressLabel.textContent = label;
    statusDetail.textContent = `Téléchargement : ${label}`;
  }

  function appendMarkdown(token: string) {
    trackLowInformationToken(token);
    markdownBuffer += token;
    output.innerHTML = DOMPurify.sanitize(marked.parse(markdownBuffer, { async: false }));
  }

  function clearOutput() {
    markdownBuffer = '';
    output.innerHTML = '';
  }

  function handleError(error: unknown) {
    console.error(error);
    showError(error instanceof Error ? error.message : String(error));
    setState('error');
  }

  function showError(message: string) {
    errorMessage.textContent = message;
  }

  function clearError() {
    errorMessage.textContent = '';
  }

  function clearFirstTokenTimeout() {
    if (firstTokenTimeout !== null) {
      window.clearTimeout(firstTokenTimeout);
      firstTokenTimeout = null;
    }
  }

  function resetGenerationMetrics() {
    firstTokenAt = null;
    chunksReceived = 0;
    consecutiveLowInfoChunks = 0;
    lowInfoWarningShown = false;
    firstTokenTime && (firstTokenTime.textContent = 'Premier token : -');
    chunkCount && (chunkCount.textContent = 'Chunks : 0');
    lowInfoCount && (lowInfoCount.textContent = 'Chunks formatage : 0');
    updatePromptLength();
  }

  function trackLowInformationToken(token: string) {
    if (isLowInformationToken(token)) {
      consecutiveLowInfoChunks += 1;
    } else {
      consecutiveLowInfoChunks = 0;
      lowInfoWarningShown = false;
    }

    lowInfoCount && (lowInfoCount.textContent = `Chunks formatage : ${consecutiveLowInfoChunks}`);

    if (consecutiveLowInfoChunks >= LOW_INFO_WARNING_THRESHOLD && !lowInfoWarningShown) {
      lowInfoWarningShown = true;
      showError(
        `Kani-sensei génère surtout du formatage (${consecutiveLowInfoChunks} chunks consécutifs). La génération sera arrêtée automatiquement si cela continue.`,
      );
    }

    if (consecutiveLowInfoChunks >= LOW_INFO_ABORT_THRESHOLD) {
      showError(
        `Génération arrêtée : trop de chunks de formatage consécutifs (${consecutiveLowInfoChunks}). Essaie une réponse plus courte ou sans tableau.`,
      );
      abortController?.abort();
    }
  }

  function isLowInformationToken(token: string) {
    if (!token) return true;
    if (token.trim() === '') return true;

    const normalized = token.trim();
    if (/^[|:\-\s]+$/.test(normalized)) return true;
    if (/^`+$/.test(normalized)) return true;

    return false;
  }

  function updatePromptLength() {
    promptLength && (promptLength.textContent = `Prompt : ${promptInput.value.trim().length} caractères`);
  }

  function debugLog(message: string, payload: unknown) {
    if (debugLogs) {
      console.log(`[wllama-poc] ${message}`, payload);
    }
  }

  return {
    loadModel,
    generate,
    stop: stopGeneration,
    destroy: async () => {
      destroyed = true;
      stopGeneration();
      clearFirstTokenTimeout();
      generateButton.removeEventListener('click', onGenerateClick);
      stopButton.removeEventListener('click', stopGeneration);
      promptInput.removeEventListener('input', onPromptInput);
      clearButton.removeEventListener('click', onClearClick);
      generationModeInput?.removeEventListener('change', onGenerationModeChange);
      debugToggle?.removeEventListener('change', onDebugToggleChange);
      gpuToggle?.removeEventListener('change', onGpuToggleChange);
      maxTokensInput?.removeEventListener('input', onMaxTokensChange);
      threadsInput?.removeEventListener('input', onThreadsChange);
      await wllama.exit();
      container.innerHTML = '';
    },
  };
}

function getWidgetTemplate({ debug, title, placeholder }: { debug: boolean; title: string; placeholder: string }) {
  return `
    <main class="assistant-widget">
      <header class="assistant-header">
        <div>
          <p class="assistant-kicker">Mentor local</p>
          <h1>${escapeHtml(title)}</h1>
        </div>
        <span id="status-label" class="assistant-status">Initialisation</span>
      </header>

      <section class="assistant-response" aria-labelledby="output-title">
        <h2 id="output-title" class="sr-only">Réponse</h2>
        <div id="output" class="markdown-output" aria-live="polite"></div>
      </section>

      <section class="assistant-composer" aria-label="Composer une question">
        <p id="status-detail" class="assistant-detail"></p>
        <div class="progress-wrap" aria-label="Progression du téléchargement">
          <progress id="download-progress" value="0" max="100"></progress>
          <span id="progress-label">0%</span>
        </div>
        <p id="error-message" class="error" role="alert"></p>
        <textarea id="prompt-input" rows="3" placeholder="${escapeHtml(placeholder)}"></textarea>
        <div class="actions">
          <button id="generate-button" type="button">Envoyer</button>
          <button id="stop-button" type="button" disabled>Arrêter</button>
          <button id="clear-button" type="button">Effacer</button>
        </div>
      </section>

      ${debug ? getDebugTemplate() : ''}
    </main>`;
}

function getDebugTemplate() {
  return `
      <details class="assistant-debug" open>
        <summary>Diagnostics wllama</summary>
        <div class="debug-runtime">
          <p id="model-source" class="muted"></p>
          <dl class="status-grid">
            <div><dt>WebGPU</dt><dd id="webgpu-label">Détection...</dd></div>
            <div><dt>Multi-thread</dt><dd id="thread-label">COOP/COEP requis</dd></div>
          </dl>
        </div>
        <div class="debug-controls" aria-label="Contrôles de diagnostic">
          <label>Mode<select id="generation-mode"><option value="chat-system">Chat + system prompt</option><option value="chat-user">Chat sans system prompt</option><option value="raw">Raw completion</option></select></label>
          <label class="checkbox-row"><input id="debug-toggle" type="checkbox" /> Logs debug console</label>
          <label class="checkbox-row"><input id="gpu-toggle" type="checkbox" checked /> Offload WebGPU si disponible</label>
          <label>Max tokens<input id="max-tokens-input" type="number" min="1" max="2048" value="1024" /></label>
          <label>Threads WASM<input id="threads-input" type="number" min="1" max="16" value="2" /></label>
        </div>
        <div class="debug-metrics">
          <span id="prompt-length">Prompt : 0 caractères</span>
          <span id="first-token-time">Premier token : -</span>
          <span id="chunk-count">Chunks : 0</span>
          <span id="low-info-count">Chunks formatage : 0</span>
        </div>
        <details class="debug-details"><summary>Dernier chunk reçu</summary><pre id="last-chunk"></pre></details>
      </details>`;
}

function getElement(container: HTMLElement, id: string) {
  const element = container.querySelector(`#${id}`);
  if (!element) {
    throw new Error(`Élément introuvable : ${id}`);
  }
  return element as HTMLElement;
}

function getOptionalElement(container: HTMLElement, id: string) {
  return container.querySelector(`#${id}`) as HTMLElement | null;
}

function getDefaultThreadCount() {
  return Math.max(2, Math.min(8, Math.floor((navigator.hardwareConcurrency || 4) / 2)));
}

function clampThreadCount(value: number) {
  if (!Number.isFinite(value) || value < 1) {
    return getDefaultThreadCount();
  }
  return Math.min(value, 16);
}

function clampMaxTokens(value: number) {
  if (!Number.isFinite(value) || value < 1) {
    return DEFAULT_MAX_TOKENS;
  }
  return Math.min(value, MAX_TOKENS_LIMIT);
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
