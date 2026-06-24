# Changelog

All notable changes to this project are documented in this file.

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
