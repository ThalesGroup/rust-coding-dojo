# Changelog

All notable changes to this project are documented in this file.

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
