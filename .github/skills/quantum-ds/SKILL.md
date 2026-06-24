---
name: quantum-ds
description: >-
    Règles et conventions du Quantum Design System pour l'ACADEMY Rust Learning Platform (React/Vite/TypeScript). Stack front-end, composants, state management, WebLLM, exécution WASM.
user-invocable: false
---

# Quantum Design System — Rust ACADEMY Platform

Plateforme d'apprentissage Rust gamifiée, 100% front-end statique (React/Vite/TypeScript + WebAssembly).

## STACK TECHNIQUE

| Technologie | Usage |
|-------------|-------|
| **React 19** | UI components, hooks, Suspense |
| **Vite 6** | Build tool, HMR, static export |
| **TypeScript 5** | Typage strict, pas de `any` |
| **React Router 7** | Routing déclaratif |
| **CodeMirror 6** | Éditeur de code Rust embarqué |
| **WebLLM (MLC)** | LLM local dans le navigateur (Gemma 2B / Qwen2.5-Coder) |
| **WASM Runtime** | Exécution Rust sandboxée côté client |

## RÈGLE ABSOLUE

> **Zéro backend.** Tout tourne côté client : compilation WASM, inférence LLM, persistance IndexedDB.
> **Zéro appel réseau** nécessaire après le chargement initial (PWA offline-first).
> Le LLM est optionnel : si WebGPU absent, l'app fonctionne sans IA.

---

## Architecture des dossiers

```
src/
├── app/               # App root, router, providers
│   ├── router.tsx
│   └── providers.tsx
├── features/          # Feature modules (kata, skill-tree, dashboard)
│   ├── kata-editor/   # Éditeur, exécution, tests
│   ├── skill-tree/    # Arbre de compétences D3.js
│   ├── mentor/        # Chat LLM, code review, hints
│   ├── profile/       # Dashboard, badges, XP
│   └── landing/       # Page d'accueil
├── shared/            # Composants réutilisables
│   ├── ui/            # Design system components
│   ├── layout/        # Header, sidebar, shell
│   └── lib/           # Hooks, utils, types
├── data/              # Katas JSON, progression IndexedDB
├── wasm/              # Runtime WASM bridge
└── llm/               # WebLLM integration
```

## Composants du Design System

Tous les composants UI sont dans `src/shared/ui/`, exportés depuis un barrel `index.ts`.

### Principes
- **Composants atomiques** : Button, Input, Badge, Modal, ProgressBar
- **Composés** : FormField (label + input + caption), Card (header + body + footer)
- **headless** : hooks réutilisables (`useToggle`, `useDebounce`, `useKeyboardShortcut`)
- **Pas de librairie UI externe** (sauf CodeMirror pour l'éditeur). Tout est custom, léger, tailwindé.

### Palette (CSS variables tailwind)

```css
:root {
  --color-rust:      #CE422B;     /* Rust signature */
  --color-rust-dark: #8B2C1A;
  --color-rust-light:#FDE8E4;
  --color-surface:   #FFFFFF;
  --color-bg:        #F8F9FA;
  --color-border:    #E2E8F0;
  --color-text:      #1A1A2E;
  --color-muted:     #64748B;
  --color-success:   #10B981;
  --color-warning:   #F59E0B;
  --color-error:     #EF4444;
  --color-accent:    #6366F1;     /* ownership/borrowing accent */
}
```

### Composants disponibles

| Composant | Props | Usage |
|-----------|-------|-------|
| `<Button>` | `variant: primary|secondary|ghost|danger`, `size: sm|md|lg`, `disabled`, `loading` | Toutes les actions |
| `<CodeBlock>` | `code`, `language`, `showLineNumbers` | Affichage de code Rust |
| `<ProgressBar>` | `value`, `max`, `color`, `animated` | XP bar, quêtes |
| `<Badge>` | `variant: info|success|warning|error`, `icon?` | Badges, statuts |
| `<Modal>` | `open`, `onClose`, `title`, `size` | Dialogues |
| `<Tooltip>` | `content`, `position` | Infobulles |
| `<SkillNode>` | `skill: SkillDef`, `state: locked|unlocked|completed` | Nœud de l'arbre |
| `<Toast>` | `message`, `type`, `duration` | Notifications (badges, level up) |
| `<Editor>` | `value`, `onChange`, `errors[]`, `readOnly` | CodeMirror wrapper Rust |
| `<MemoryView>` | `frames: StackFrame[]` | Visualisation stack/heap |
| `<ChatMessage>` | `role: user|assistant`, `content`, `code?` | Messages du mentor IA |

---

## State Management

Pas de librairie externe (Redux/Zustand). On utilise React 19 hooks + Context :

```typescript
// Provider stack
<QueryClientProvider>      // React Query (cache katas, pas de fetch réseau)
  <RouterProvider>         // React Router
    <ProgressProvider>     // XP, niveaux, streak (IndexedDB)
      <MentorProvider>     // WebLLM state (loaded, ready, generating)
        <EditorProvider>   // Code actuel dans l'éditeur
        </EditorProvider>
      </MentorProvider>
    </ProgressProvider>
  </RouterProvider>
</QueryClientProvider>
```

### Hooks clés

```typescript
useProgress()     // XP, niveau, streak, badges → ProgressContext
useMentor()       // WebLLM prêt ?, chat messages, hints → MentorContext
useKata(id)       // Récupère un kata depuis le JSON statique
useCode()         // Code actuel, reset, diff → EditorContext
useWasm()         // Exécution WASM, résultats, erreurs
useStorage<T>()   // Wrapper générique IndexedDB (hook personnalisable)
```

### Persistance

```
localStorage  → préférences UI (thème, taille police)
IndexedDB     → progression (XP, badges, streak, code sauvegardé, modèle LLM)
```

---

## Patterns WebLLM

```typescript
// Initialisation dans MentorProvider
const [engine, setEngine] = useState<MLCEngine | null>(null);
const [progress, setProgress] = useState(0);

useEffect(() => {
  const init = async () => {
    const mlc = await CreateMLCEngine("Qwen2.5-Coder-1.5B-Q4_1", {
      initProgressCallback: (p: number) => setProgress(p),
    });
    setEngine(mlc);
  };
  init();
}, []);

// Chat streaming
const chat = async (messages: ChatMessage[]) => {
  const reply = await engine.chat.completions.create({
    messages: [
      { role: "system", content: SYSTEM_PROMPT_MENTOR },
      ...messages.map(m => ({
        role: m.role as "user" | "assistant",
        content: buildContextPrompt(m.content, currentKata, currentCode),
      })),
    ],
    stream: true,
  });
  for await (const chunk of reply) {
    setStreamedText(prev => prev + chunk.choices[0]?.delta?.content || "");
  }
};
```

---

## Patterns CodeMirror + Rust

```typescript
import { EditorView, basicSetup } from "codemirror";
import { rust } from "@codemirror/lang-rust";
import { lintGutter } from "@codemirror/lint";
import { oneDark } from "@codemirror/theme-one-dark";

// Création de l'éditeur Rust
const editor = new EditorView({
  doc: initialCode,
  extensions: [
    basicSetup,
    rust(),                              // Coloration syntaxique Rust
    lintGutter(),                         // Gutter d'erreurs
    oneDark,                              // Thème sombre
    EditorView.updateListener.of(update => {
      if (update.docChanged) onCodeChange(update.state.doc.toString());
    }),
  ],
  parent: editorRef.current,
});
```

---

## Patterns Exécution WASM

```typescript
// Bridge WASM vers l'éditeur
interface WasmResult {
  stdout: string;
  stderr: string;
  testResults: TestResult[];
  memorySnapshots: MemorySnapshot[];  // Pour visualisation
}

async function executeRust(code: string, tests: string): Promise<WasmResult> {
  const wasmModule = await WebAssembly.instantiate(WASM_BYTES, {
    env: { print: (ptr: number) => captureStdout(ptr) },
  });
  return wasmModule.instance.exports.run(code, tests) as WasmResult;
}
```

---

## Règles systématiques

1. **Tout est typé** : pas de `any`, pas de `as` cast. Utiliser les guards (`isResult`, `isError`)
2. **Components React** : function components + hooks, pas de classes
3. **CSS** : Tailwind utility classes. Les styles customs vont dans `*.module.css` (CSS Modules)
4. **Code Rust** : jamais modifié côté front. Le parsing produit un JSON frozen au build
5. **LLM** : toujours streamer, jamais `await` bloquant. Afficher un squelette UI pendant le chargement
6. **Erreurs** : `Result<T, E>` pattern (type `<T, E>` union). Pas de try/catch sauf à la limite du système
7. **Accessibilité** : `aria-*` sur tous les composants interactifs, `role` sur les icônes décoratives, focus trap dans les modales et l'éditeur
8. **Performance** : `React.memo` sur les composants lourds (SkillNode, MemoryView). `Suspense` + `lazy` par route. `useMemo`/`useCallback` uniquement si profilé

## Tests

```
vitest          → Tests unitaires composants + hooks
playwright      → E2E : ouverture kata, édition, run tests, level up
```

---

## Déploiement

```bash
npm run build    # Vite exporte dans dist/ (statique)
npm run preview  # Preview local
```

Déploiement sur **GitHub Pages** ou **Netlify** (SPA avec fallback `index.html` pour le routing).
