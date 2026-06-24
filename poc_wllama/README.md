# Kani-sensei - POC wllama

Proof of concept autonome pour valider Kani-sensei, le mentor IA du Rust Dojo, avec un LLM local dans le navigateur via [`@wllama/wllama`](https://github.com/ngxson/wllama).

Ce dossier n'est pas encore intégré à un front-end principal. Il sert uniquement à valider l'issue `#27` avant l'intégration dans la future plateforme academy.

## Persona

Kani-sensei est un vieux crabe sage, patient et malicieux, expert du Rust Dojo. Il aide les apprenants à comprendre Rust sans donner directement la solution complète des katas, sauf demande explicite.

## Modèle

Le POC charge le modèle suivant depuis Hugging Face :

- repo : `LiquidAI/LFM2.5-350M-GGUF`
- fichier : `LFM2.5-350M-Q4_K_M.gguf`
- taille : environ 338 Mo
- licence : LFM1.0

Le premier chargement peut être long. wllama met le modèle en cache via son gestionnaire de cache navigateur quand c'est possible.

## Installation

```bash
npm install
```

## Lancement local

```bash
npm run dev
```

Puis ouvrir l'URL indiquée par Vite.

## Utilisation dans React

Le POC expose une API de montage indépendante de React. Une application React peut fournir un simple `div` et monter l'assistant dedans. Par défaut, l'UI est compacte et pensée pour une sidepanel.

```tsx
import { useEffect, useRef } from 'react';
import { mountAssistant, type AssistantWidget } from './assistant-widget';
import './styles.css';

export function KaniSenseiPanel() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const widget: AssistantWidget = mountAssistant(containerRef.current, {
      initialPrompt: "Explique l'ownership avec une analogie simple.",
      title: 'Kani-sensei',
      placeholder: 'Pose ta question sur Rust...',
      maxTokens: 1024,
      debug: false,
      autoLoad: false,
      contextProvider: () => document.getElementById('exercise')?.textContent ?? '',
    });

    return () => {
      void widget.destroy();
    };
  }, []);

  return <div ref={containerRef} />;
}
```

L'API retournée permet aussi de piloter le widget depuis React :

```ts
await widget.loadModel();
await widget.generate('Résume ce kata sans donner la solution.');
widget.stop();
await widget.destroy();
```

Le style du widget est scoped sous `.assistant-widget`. Le POC standalone ajoute une coquille de démo autour du widget avec `.demo-shell`, `.demo-toolbar` et `.demo-panel`.

La page de démo contient un toggle `Debug mode` hors du `div` de rendu de l'assistant. Quand il change, la démo détruit le widget courant et le remonte avec `debug: true` ou `debug: false`, ce qui simule une intégration hôte qui pilote la configuration du widget.

La page de démo contient aussi une grande zone de texte éditable à gauche, préremplie avec un exercice du kata `01-starter/03-ownership-borrowing`. Cette zone est identifiée par `<div id="exercise">`.

Le widget reçoit un `contextProvider` fourni par la page hôte. Dans la démo, ce provider lit le contenu courant de `#exercise`, y compris la valeur live du textarea, et l'ajoute automatiquement à chaque génération. Le bouton `Demander un indice`, lui aussi hors du widget, appelle seulement `widget.generate(...)` : le contexte de l'exercice est ajouté par le widget via le provider.

Quand `debug: false`, l'assistant n'affiche que l'interface finale compacte : statut, réponse, champ de saisie et actions. Quand `debug: true`, les diagnostics wllama sont rendus dans un bloc dédié à l'intérieur du widget.

Le serveur Vite est configuré avec les headers :

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

Ces headers sont nécessaires pour permettre les capacités multi-thread de WASM dans les navigateurs compatibles.

Le POC demande plusieurs threads à wllama par défaut. Le nombre est calculé depuis `navigator.hardwareConcurrency` et peut être modifié dans le champ `Threads WASM` quand `debug: true`, avant de charger le modèle. Une fois le modèle chargé, ce réglage est verrouillé car wllama initialise son worker et son runtime WASM au chargement.

## Build

```bash
npm run build
```

## Fonctionnalités validées

- Chargement de `@wllama/wllama`
- Téléchargement d'un modèle GGUF depuis Hugging Face
- Barre de progression du téléchargement
- États UI : téléchargement, chargement, prêt, génération, erreur
- UI compacte embeddable dans une sidepanel
- Génération via l'API chat compatible OpenAI de wllama
- Affichage streamé token par token avec rendu Markdown sanitizé
- Bouton d'arrêt via `AbortController`
- Message de disponibilité WebGPU
- Fallback WASM CPU documenté quand WebGPU n'est pas disponible

## Debug génération

Avec `debug: true`, le POC affiche des contrôles pour isoler les problèmes de prompt, de chat template ou de backend :

- `Mode` permet de comparer `Chat + system prompt`, `Chat sans system prompt` et `Raw completion`.
- `Logs debug console` écrit dans la console le prompt envoyé, les métadonnées du modèle, le chat template et chaque chunk reçu.
- `Offload WebGPU si disponible` permet de désactiver l'offload GPU avant le chargement du modèle. Ce réglage est verrouillé après chargement.
- `Threads WASM` permet de choisir le nombre de threads demandé à wllama avant le chargement du modèle.
- `Max tokens` permet d'ajuster le budget de génération. La valeur par défaut est `1024`, avec un plafond à `2048` pour rester raisonnable dans le navigateur.
- Les métriques affichent la longueur du prompt, le délai avant premier token et le nombre de chunks reçus.
- `Chunks formatage` compte les chunks consécutifs qui ne contiennent que du formatage Markdown ou des espaces.
- Le bloc `Dernier chunk reçu` permet de voir si wllama stream des chunks sans contenu textuel visible.
- Si Kani-sensei génère trop de chunks de formatage consécutifs, le POC affiche un avertissement puis arrête automatiquement la génération.

Pour diagnostiquer un prompt qui semble bloquer :

1. Activer `Logs debug console`.
2. Tester d'abord `Chat + system prompt`.
3. Si aucun token n'arrive, tester `Chat sans system prompt`.
4. Si le problème persiste, tester `Raw completion`.
5. Si le problème persiste encore, recharger la page, désactiver `Offload WebGPU si disponible`, recharger le modèle puis retester.
6. Comparer le délai `Premier token` et le compteur `Chunks` entre les modes.

## Limites connues

- Le modèle Q4_K_M reste lourd pour un navigateur : prévoir bande passante, mémoire et stockage.
- Le fallback WASM CPU peut être lent selon la machine.
- Le mode multi-thread dépend des headers COOP/COEP et du support navigateur.
- Certains navigateurs peuvent nécessiter le mode compatibilité interne de wllama, potentiellement plus lent.
- Ce POC ne contient pas encore d'injection de contexte kata, de chat mentor complet ou de persistance conversationnelle.

## Vérification manuelle

1. Lancer `npm run dev`.
2. Cliquer sur `Charger le modèle`.
3. Vérifier que la progression avance et que l'état passe à `Prêt`.
4. Saisir un prompt court.
5. Cliquer sur `Générer`.
6. Vérifier que la sortie arrive progressivement.
7. Relancer une génération puis cliquer sur `Arrêter`.
