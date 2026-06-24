# Handoff - Issue #27 wllama Assistant POC

This document summarizes the work done for issue `#27` and explains how to reimplement the same assistant + context-window pattern on another frontend.

## Goal

Build a browser-local Rust Dojo mentor assistant named Kani-sensei, powered by `@wllama/wllama`, with no backend and no API key.

The POC validates that a host page can embed an assistant sidepanel and provide page context, such as a kata exercise, to the local model at generation time.

## Current Branch And Commit

- Branch: `feature/wllama`
- Latest pushed commit: `36c27ad feat: make wllama assistant embeddable`
- Issue comment: https://github.com/NicolasPayneauT0132431/rust-coding-dojo/issues/27#issuecomment-4791528783

## POC Location

All implementation lives in:

```txt
poc_wllama/
```

Important files:

```txt
poc_wllama/src/assistant-widget.ts  Embeddable assistant widget and wllama runtime
poc_wllama/src/main.ts              Standalone demo host page wiring
poc_wllama/src/styles.css           Widget and demo styling
poc_wllama/index.html               Standalone demo shell
poc_wllama/vite.config.ts           COOP/COEP headers for WASM multithreading
poc_wllama/README.md                User-facing POC docs
```

## Model

The POC currently loads this GGUF model from Hugging Face:

```ts
repo: 'LiquidAI/LFM2.5-350M-GGUF'
file: 'LFM2.5-350M-Q4_K_M.gguf'
displayName: 'LFM2.5-350M-Q4_K_M.gguf'
```

Approximate GGUF size: 338 MB.

The model is downloaded client-side by wllama and cached by the browser when possible.

## Runtime Architecture

There is no traditional backend.

The assistant runs entirely in the browser:

```txt
Host frontend
  -> mountAssistant(container, options)
  -> @wllama/wllama
  -> WASM runtime
  -> GGUF model downloaded from Hugging Face
  -> local inference
  -> streamed tokens rendered into the widget
```

The widget creates a `Wllama` instance with the bundled WASM URL:

```ts
import { Wllama } from '@wllama/wllama';
import wasmUrl from '@wllama/wllama/esm/wasm/wllama.wasm?url';

const wllama = new Wllama({ default: wasmUrl }, { allowOffline: true });
```

Generation uses wllama's OpenAI-compatible chat API:

```ts
wllama.createChatCompletion({
  messages: [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: prompt },
  ],
  stream: true,
  onData: handleChunk,
});
```

The streamed text is rendered as Markdown with `marked` and sanitized with `DOMPurify` before insertion into the DOM.

## Public Embedding API

The reusable API is exported from `poc_wllama/src/assistant-widget.ts`:

```ts
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

export function mountAssistant(container: HTMLElement, options?: AssistantOptions): AssistantWidget;
```

Minimal integration:

```ts
import { mountAssistant } from './assistant-widget';
import './styles.css';

const container = document.getElementById('assistant-root');

if (!container) throw new Error('Missing assistant container');

const widget = mountAssistant(container, {
  title: 'Kani-sensei',
  placeholder: 'Pose ta question sur Rust...',
  debug: false,
  autoLoad: false,
});
```

React integration:

```tsx
import { useEffect, useRef } from 'react';
import { mountAssistant, type AssistantWidget } from './assistant-widget';
import './styles.css';

export function AssistantPanel() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const widget: AssistantWidget = mountAssistant(ref.current, {
      title: 'Kani-sensei',
      debug: false,
      autoLoad: false,
    });

    return () => {
      void widget.destroy();
    };
  }, []);

  return <div ref={ref} style={{ height: '100%' }} />;
}
```

## Host Page Context Pattern

The key integration pattern is `contextProvider`.

The assistant widget stays generic. The host page decides which DOM content is relevant and provides it to the assistant at generation time.

In the POC, the left-side kata workspace is identified as:

```html
<div id="exercise" class="demo-workspace">
  ...
  <textarea id="kata-zone"></textarea>
</div>
```

The host page passes a provider that reads the current live content from `#exercise`:

```ts
const widget = mountAssistant(assistantRoot, {
  debug: false,
  contextProvider: getExerciseContext,
});

function getExerciseContext() {
  const exercise = document.getElementById('exercise');
  if (!exercise) return '';

  const fields = exercise.querySelectorAll('textarea, input, select');
  if (fields.length === 0) {
    return exercise.textContent?.trim() ?? '';
  }

  return Array.from(fields)
    .map((field) => getFieldContext(field))
    .filter(Boolean)
    .join('\n\n')
    .trim();
}

function getFieldContext(field: Element) {
  if (field instanceof HTMLTextAreaElement || field instanceof HTMLInputElement) {
    return field.value.trim();
  }

  if (field instanceof HTMLSelectElement) {
    return field.selectedOptions[0]?.textContent?.trim() ?? field.value.trim();
  }

  return '';
}
```

When a user sends a prompt, the widget combines the exercise context with the user question:

```txt
Contexte de l'exercice :

<current #exercise content>

Question de l'apprenant :

<user prompt>
```

This makes the assistant aware of the current exercise regardless of what the user typed in the assistant input.

## Demo Page Behavior

The current standalone POC page has two zones:

```txt
Left:  editable kata workspace, id="exercise"
Right: assistant sidepanel, id="assistant-root"
```

The left kata workspace is prefilled from:

```txt
katas/01-starter/03-ownership-borrowing/src/bin/exercise_1.rs
```

There is a host-page button outside the assistant:

```html
<button id="ask-kata-button" type="button">Demander un indice</button>
```

This button calls:

```ts
widget.generate(getSelectedKataText() || 'Donne un indice progressif sans fournir directement la solution complète.');
```

If text is selected in the kata textarea, the selected text is used as the user prompt. The full `#exercise` context is still added automatically by `contextProvider`.

## Debug Mode

The final user-facing assistant is intentionally compact.

Diagnostics are rendered only when `debug: true` is passed to `mountAssistant`.

Debug mode includes:

- model source
- WebGPU availability
- thread count
- generation mode selector
- console log toggle
- WebGPU offload toggle
- max token input
- WASM thread input
- prompt/chunk metrics
- last raw chunk details

The standalone demo has a `Debug mode` checkbox outside the assistant render div. When toggled, the host destroys and remounts the widget:

```ts
debugToggle?.addEventListener('change', () => {
  const previousWidget = widget;
  widget = null;
  void previousWidget?.destroy().finally(mountCurrentAssistant);
});
```

## Browser Requirements

For best performance, serve the page with cross-origin isolation headers:

```http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

These are required for WASM multithreading. Without them, the model may still run, but performance is worse.

The POC configures these in `poc_wllama/vite.config.ts`.

Also expect:

- large initial network download for the GGUF model
- browser storage usage for model cache
- high memory usage compared to a normal frontend feature
- slower generation on CPU-only/WASM fallback

## Current Conversation Semantics

The current implementation is single-turn.

The model remains loaded after the first load, but each `generate()` call sends only:

- system prompt
- current context from `contextProvider`
- current user prompt

It does not preserve previous user and assistant messages as chat history. The UI clears the previous output for every new generation.

To implement multi-turn conversation later, keep an in-memory message history and pass all messages to `createChatCompletion`:

```ts
const messages = [
  { role: 'system', content: SYSTEM_PROMPT },
  { role: 'user', content: firstPrompt },
  { role: 'assistant', content: firstAnswer },
  { role: 'user', content: followUpPrompt },
];
```

The exercise context should probably be injected as a refreshed system/context message on every turn, not duplicated into every historical user message.

## Reimplementation Checklist

To reproduce this on another site:

1. Install dependencies:

```bash
npm install @wllama/wllama marked dompurify
```

2. Copy or recreate `assistant-widget.ts`.

3. Import the wllama WASM asset with your bundler:

```ts
import wasmUrl from '@wllama/wllama/esm/wasm/wllama.wasm?url';
```

4. Ensure the host app can serve WASM assets correctly.

5. Add COOP/COEP headers to the dev server and production server.

6. Create a sidepanel container with an explicit size:

```html
<aside class="assistant-sidepanel">
  <div id="assistant-root"></div>
</aside>
```

```css
.assistant-sidepanel {
  width: 420px;
  height: 100vh;
}

#assistant-root {
  width: 100%;
  height: 100%;
}
```

7. Identify the host exercise/context area:

```html
<div id="exercise">...</div>
```

8. Mount the assistant with a `contextProvider`:

```ts
const widget = mountAssistant(document.getElementById('assistant-root')!, {
  debug: false,
  contextProvider: () => document.getElementById('exercise')?.textContent ?? '',
});
```

9. If the exercise area contains editable form fields, use a provider that reads `.value` from `textarea`, `input`, and `select` elements.

10. Add host-page controls if desired:

```ts
document.getElementById('ask-hint')?.addEventListener('click', () => {
  void widget.generate('Donne un indice progressif sans donner la solution complète.');
});
```

11. Call `widget.destroy()` when the host route/panel unmounts.

12. Run a production build and manually verify:

- first model download
- cached reload behavior
- generation stop button
- context injection
- debug mode if enabled
- COOP/COEP headers

## Known Limitations

- No multi-turn conversation history yet.
- The model is still large for browser delivery.
- First load depends on Hugging Face availability and browser cache behavior.
- Performance varies significantly by machine and browser.
- WebGPU availability may be false; WASM CPU fallback is expected.
- `contextProvider` is synchronous today. If future context needs network or file loading, add async support.
- The widget currently owns both UI and runtime. A future production architecture could split `assistant-engine.ts` from `assistant-widget.ts`.

## Useful Commands

From `poc_wllama/`:

```bash
npm install
npm run dev
npm run build
```

The standalone dev server usually runs at:

```txt
http://localhost:5173/
```

## Issue Status Summary

Completed for the POC:

- browser-local model loading with wllama
- LiquidAI LFM2.5 350M GGUF model configuration
- compact embeddable assistant sidepanel
- generic `mountAssistant` API
- host-provided `contextProvider`
- editable `#exercise` kata workspace demo
- debug-only diagnostics
- Markdown rendering with sanitization
- stop generation via `AbortController`
- WASM multithreading headers in Vite

Recommended next work:

- add multi-turn conversation history
- split runtime engine from UI component
- add automated browser smoke tests
- evaluate real Academy frontend integration points
- decide production model hosting and caching strategy
