# Rust Code Quality Skill

## Purpose
Ensure Rust code meets high quality standards through tooling, linting, and best practices.

## Quality Gates

### Clippy — The Official Linter
- Run `cargo clippy -- -D warnings` to treat warnings as errors.
- Enable additional lints in `Cargo.toml`:
  ```toml
  [lints.clippy]
  pedantic = "warn"
  nursery = "warn"
  cargo = "warn"
  ```
- Address every clippy warning — they exist for a reason.
- Use `#[allow(clippy::...)]` sparingly and document why.

### Rustfmt — Code Formatting
- Run `cargo fmt -- --check` in CI to enforce formatting.
- Configure `rustfmt.toml` for team conventions.
- Never commit unformatted code.

### Code Organization
- Files should not exceed 300 lines. Split into submodules when needed.
- Functions should not exceed 50 lines. Extract helpers.
- Avoid deep nesting (>3 levels). Use early returns and guard clauses.

### Documentation
- Every `pub` item must have a doc comment.
- Document invariants, panics, and unsafe conditions.
- Use `# Examples` sections in doc comments for non-trivial APIs.
- Run `cargo doc --no-deps --open` to review generated docs.

### Dependency Hygiene
- Audit dependencies with `cargo audit`.
- Minimize dependency count — each dep is a liability.
- Pin dependency versions in `Cargo.toml`.
- Use `cargo tree` to understand the dependency graph.

### Continuous Integration Checks
```yaml
# Recommended CI steps for Rust quality
steps:
  - cargo check --all-targets --all-features
  - cargo fmt -- --check
  - cargo clippy --all-targets --all-features -- -D warnings
  - cargo doc --no-deps --document-private-items
  - cargo test --all-targets --all-features
  - cargo audit
```

## Checklist
- [ ] No clippy warnings remain.
- [ ] Code is formatted with `rustfmt`.
- [ ] All public items are documented.
- [ ] `cargo audit` reports no vulnerabilities.
- [ ] No file exceeds 300 lines.
- [ ] No function exceeds 50 lines.
