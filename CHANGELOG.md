# Changelog

All notable changes to this project are documented in this file.

## [v1.0.0] - 2026-06-24

### Added
- **Academy** : assistant Ferris avec rendu Markdown, contexte permanent, et sanitization DOMPurify.
- **Academy** : écran onboarding avec parcours personnalisé (prénom « Nathan » débloque tous les katas et le Graal).
- **Academy** : toggle contexte kata pour des réponses Ferris plus rapides.
- **Academy** : écran Graal verrouillé jusqu'à complétion de tous les katas, avec bouton de récupération de la config Harness.
- **Academy** : barre de progression dans le header basée sur les katas complétés.
- **Academy** : tests unitaires (progression, skill tree, couverture élargie).
- **Academy** : validation par comparaison stdout utilisateur vs solution.
- **Docs** : GIF de démonstration intégré au README.
- **CI/CD** : déploiement Academy fonctionnel.

### Changed
- **Academy** : UI traduite en anglais (menus, boutons, écrans, prompts Ferris).
- **Academy** : suppression des onglets Dashboard et Profil.
- **Academy** : déplacement du titre et des badges dans le bandeau, retrait du panneau gauche.
- **Academy** : troncature des consignes dans le panneau gauche.
- **Academy** : affichage complet du README en markdown dans la modal kata.
- **Academy** : libellé « jours » retiré du header, badge streak supprimé.
- **Harness** : optimisation (température 0, max_tokens 10000, retrait des consignes du contexte).
- **Docs** : README enrichi avec section Academy et GIF centré.

### Fixed
- **Academy** : correction du build TypeScript (restauration useKataContext).
- **Academy** : forçage de l'affichage Graal et currentKata après onboarding.
- **Academy** : rollback modèle LiquidAI, ajout retry avec cache clear.
- **Academy** : modèle Wllama stabilisé, génération exhaustive des 36 katas.

### Removed
- Agent harness (supprimé).

### Merged Pull Requests
- #63 — feat(harness): harness agentique - skills Rust et configs AI
- #64 — feat(academy): remove dashboard and profile tabs
- #65 — feat(wllama): assistant Ferris improvements
- #61 — feat(wllama): onboarding, parcours, download progress

## [v0.5.0] - 2026-06-24

### Added
- **AI Features** : harness agentique `rewards/harness/` avec 5 skills Rust (development, qualite, securite, refactoring, tests), configuration OpenCode et instructions GitHub Copilot referencees aux dernieres docs Rust.
- **Academy** : chargement des katas depuis le répertoire `/katas` avec coloration syntaxique CodeMirror.
- **Academy** : exécution réelle Rust côté serveur via `play.rust-lang.org/execute`.
- **Academy** : diagnostics de compilation Rust en temps réel dans l'éditeur.
- **Academy** : pipeline de parsing des katas en JSON.
- **Academy** : assistant IA local Wllama intégré à Ferris.
- **Academy** : arbre de compétences interactif avec progression live et calcul de score.
- **Academy** : déploiement CI/CD du projet React/Vite vers `academy/`.
- **Docs** : pack d'instructions agent-agnostique `docs-sync`.
- **Docs** : spécifications de design pour l'arbre de compétences live et le POC Wllama.

### Changed
- **Academy** : arbre de compétences redimensionné (1.5x) et onglet renommé « Arbres de compétences ».
- **Style** : `rustfmt` appliqué sur l'ensemble des sources et solutions des katas.

### Fixed
- **Academy** : correction du double scroll sur les pages principales.
- **Academy** : `GITHUB_REPOSITORY` utilisé pour le chemin de base Vite au lieu d'un chemin codé en dur.
- **Academy CI** : mise à jour de Node 20 vers Node 22 (Node 20 déprécié sur GitHub Actions).
- **CI** : suppression du workflow `labeler` redondant.

### Resolved Issues
- #52, #53, #58, #62

### Merged Pull Requests
- #63 — feat(harness): harness agentique - skills Rust et configs AI
- #58 — feat: intégration Wllama dans l'assistant Academy Ferris
- #53 — feat: projet Academy React/Vite avec CI/CD
- #52 — docs: pack d'instructions docs-sync agent-agnostique

## [v0.4.0] - 2026-06-24

### Fixed
- **SECURITY** : Historique Git réécrit (`git filter-branch`) pour supprimer les tokens SonarQube hardcodés. Les tokens `squ_...` et `sqp_...` sont remplacés par des placeholders (`<ADMIN_TOKEN>`, `<SONAR_TOKEN>`).
- CI : retrait de `cargo publish --workspace --dry-run` du workflow de release.

### Merged Pull Requests
- PR #24 (ThalesGroup/rust-coding-dojo) — Nouvelle PR vers le repo de base après nettoyage des secrets.

## [v0.3.0] - 2026-06-24

### Added
- CI quality gates stabilized against kata baseline debt (clippy allowance, rustfmt skip).

### Changed
- README simplified and streamlined.
- `katas/README.md` removed (redundant with root README).

### Merged Pull Requests
- #50 — ci: stabilize quality gates against kata baseline debt

## [v0.2.0] - 2026-06-24

### Added
- 20 new katas (5 Beginner, 10 Intermediate, 5 Expert) via PR #47:
  - **Beginner**: FooBarQix, Nim Game, Word Wrap, Number to LCD, Greed
  - **Intermediate**: Yahtzee, Berlin Clock, Gilded Rose, Range, Birthday Greetings, Wallet, Trading Card Game, Social Network, Anagram, Bank OCR
  - **Expert**: Sudoku, Langton Ant, Brainfuck, Mathematical AST, Christmas Delivery
- Domains badges (English) to all 36 kata READMEs via PR #47.
- Repository summary image and banner in README via PR #47.
- GitHub issue template for hackathon task structure.

### Changed
- Cargo workspace updated to include all 36 kata members.
- Removed `[[bin]]` sections from all kata Cargo.toml files to fix output filename collision.

### Fixed
- Build failure: output filename collision across 28 kata `solutions` bins.
- Build failure: E0597 lifetime error in `christmas-delivery` solution (MutexGuard temporary).

### Resolved Issues
- #46, #48

### Merged Pull Requests
- #48 - [CI]: Fix build — remove duplicate [[bin]] names and fix christmas-delivery lifetime
- #47 - [KATA]: Ajouter 20 nouveaux katas depuis codingdojo.org

## [v0.1.0] - 2026-06-24

### Added
- CI foundation workflows for build/test/clippy/docs/audit via PR #38.
- CI quality workflows for coverage/MSRV/cargo-deny/nightly via PR #39.
- CI automation workflows for stale/labeler/PR lint/release via PR #40.
- 10 new katas across starter/structure/advanced tracks via PR #19.
- Hackathon contribution framework and issue governance via PR #21.

### Changed
- CI now validates kata solutions and excludes known incomplete solution sets.
- Coverage workflow removed.
- `cargo-deny` configuration migrated to current schema and deny workflow narrowed to advisories/bans/sources.

### Resolved Issues
- #3, #4, #5, #6, #7, #8, #9, #10, #11, #12, #13, #14, #15, #16
- #18, #20

### Merged Pull Requests
- #40 - ci: add stale bot, PR labeler, PR title lint, and release workflow
- #39 - ci: add coverage, MSRV, cargo-deny, and nightly build
- #38 - ci: add test, clippy, fmt, and doc jobs to CI pipeline
- #21 - Hackathon setup: add AGENTS.md framework
- #19 - [KATA]: Ajouter 10 nouveaux katas depuis codingdojo.org
