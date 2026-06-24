import { LoggerWithoutDebug, Wllama, WllamaAbortError } from '@wllama/wllama';
import wasmUrl from '@wllama/wllama/esm/wasm/wllama.wasm?url';
import './styles.css';

const MODEL = {
  repo: 'drmcbride/Qwen3-0.6B-Q8_0-GGUF',
  file: 'qwen3-0.6b-q8_0.gguf',
  displayName: 'Qwen3-0.6B-Q8_0.gguf',
};

type UiState = 'idle' | 'downloading' | 'loading' | 'ready' | 'generating' | 'error';

const statusLabel = getElement('status-label');
const webGpuLabel = getElement('webgpu-label');
const threadLabel = getElement('thread-label');
const progressLabel = getElement('progress-label');
const modelSource = getElement('model-source');
const errorMessage = getElement('error-message');
const output = getElement('output') as HTMLPreElement;
const promptInput = getElement('prompt-input') as HTMLTextAreaElement;
const progress = getElement('download-progress') as HTMLProgressElement;
const loadButton = getElement('load-button') as HTMLButtonElement;
const generateButton = getElement('generate-button') as HTMLButtonElement;
const stopButton = getElement('stop-button') as HTMLButtonElement;
const clearButton = getElement('clear-button') as HTMLButtonElement;

const wllama = new Wllama(
  { default: wasmUrl },
  {
    allowOffline: true,
    logger: LoggerWithoutDebug,
    parallelDownloads: 3,
  },
);

let state: UiState = 'idle';
let abortController: AbortController | null = null;

modelSource.textContent = `Modèle : ${MODEL.repo} / ${MODEL.file}`;
webGpuLabel.textContent = wllama.isSupportWebGPU() ? 'Disponible' : 'Indisponible, fallback WASM CPU';

loadButton.addEventListener('click', () => void loadModel());
generateButton.addEventListener('click', () => void generate());
stopButton.addEventListener('click', stopGeneration);
clearButton.addEventListener('click', () => {
  output.textContent = '';
  clearError();
});

setState('idle');

async function loadModel() {
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
        n_threads: 1,
        n_gpu_layers: wllama.isSupportWebGPU() ? 99999 : 0,
        useCache: true,
        progressCallback: ({ loaded, total }) => {
          setState('downloading');
          if (total > 0) {
            const percentage = Math.min(100, Math.round((loaded / total) * 100));
            updateProgress(percentage, `${percentage}%`);
          } else {
            progress.removeAttribute('value');
            progressLabel.textContent = formatBytes(loaded);
          }
        },
      },
    );

    setState('loading');
    updateProgress(100, '100%');
    threadLabel.textContent = wllama.isMultithread()
      ? `${wllama.getNumThreads()} threads`
      : 'Désactivé pour ce POC';
    setState('ready');
  } catch (error) {
    handleError(error);
  }
}

async function generate() {
  if (!wllama.isModelLoaded()) {
    await loadModel();
  }

  const prompt = promptInput.value.trim();
  if (!prompt) {
    showError('Le prompt ne peut pas être vide.');
    return;
  }

  abortController = new AbortController();
  clearError();
  output.textContent = '';
  setState('generating');

  try {
    await wllama.createChatCompletion({
      messages: [
        {
          role: 'system',
          content:
            'Tu es un mentor Rust concis et pédagogue. Réponds en français, sans donner de solution complète si la question concerne un kata.',
        },
        { role: 'user', content: prompt },
      ],
      stream: true,
      max_tokens: 320,
      temperature: 0.4,
      top_p: 0.9,
      top_k: 40,
      abortSignal: abortController.signal,
      onData: (chunk) => {
        const token = chunk.choices[0]?.delta.content;
        if (token) {
          output.textContent += token;
        }
      },
    });
    setState('ready');
  } catch (error) {
    if (error instanceof WllamaAbortError || abortController?.signal.aborted) {
      output.textContent += '\n\n[Génération interrompue]';
      setState('ready');
    } else {
      handleError(error);
    }
  } finally {
    abortController = null;
  }
}

function stopGeneration() {
  abortController?.abort();
}

function setState(nextState: UiState) {
  state = nextState;
  statusLabel.textContent = getStateLabel(state);
  loadButton.disabled = state === 'downloading' || state === 'loading' || state === 'generating' || wllama.isModelLoaded();
  generateButton.disabled = !wllama.isModelLoaded() || state === 'generating' || state === 'downloading' || state === 'loading';
  stopButton.disabled = state !== 'generating';
  promptInput.disabled = state === 'generating' || state === 'downloading' || state === 'loading';
}

function getStateLabel(currentState: UiState) {
  switch (currentState) {
    case 'idle':
      return 'En attente';
    case 'downloading':
      return 'Téléchargement';
    case 'loading':
      return 'Chargement';
    case 'ready':
      return 'Prêt';
    case 'generating':
      return 'En cours';
    case 'error':
      return 'Erreur';
  }
}

function updateProgress(value: number, label: string) {
  progress.value = value;
  progressLabel.textContent = label;
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

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function getElement(id: string) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Élément introuvable : ${id}`);
  }
  return element;
}
