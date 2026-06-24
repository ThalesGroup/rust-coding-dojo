# POC wllama

Proof of concept autonome pour valider l'exécution d'un LLM local dans le navigateur avec [`@wllama/wllama`](https://github.com/ngxson/wllama).

Ce dossier n'est pas encore intégré à un front-end principal. Il sert uniquement à valider l'issue `#27` avant l'intégration dans la future plateforme academy.

## Modèle

Le POC charge le modèle suivant depuis Hugging Face :

- repo : `drmcbride/Qwen3-0.6B-Q8_0-GGUF`
- fichier : `qwen3-0.6b-q8_0.gguf`
- taille : environ 805 Mo
- licence : Apache-2.0

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

Le serveur Vite est configuré avec les headers :

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

Ces headers sont nécessaires pour permettre les capacités multi-thread de WASM dans les navigateurs compatibles.

## Build

```bash
npm run build
```

## Fonctionnalités validées

- Chargement de `@wllama/wllama`
- Téléchargement d'un modèle GGUF depuis Hugging Face
- Barre de progression du téléchargement
- États UI : téléchargement, chargement, prêt, génération, erreur
- Génération via l'API chat compatible OpenAI de wllama
- Affichage streamé token par token
- Bouton d'arrêt via `AbortController`
- Message de disponibilité WebGPU
- Fallback WASM CPU documenté quand WebGPU n'est pas disponible

## Limites connues

- Le modèle Q8_0 est lourd pour un navigateur : prévoir bande passante, mémoire et stockage.
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
