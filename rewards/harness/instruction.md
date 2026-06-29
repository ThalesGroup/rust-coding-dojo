# Rust Developer Instructions — Harness

## Overview
This harness provides a set of skills designed to assist Rust developers across the entire development lifecycle. Load the relevant skill before working on a task to receive structured guidance.

## How to Use This Harness

### Loading a Skill
When you encounter a Rust development task, load the corresponding skill from `skills/`:

| Task Type | Skill File | When to Use |
|-----------|-----------|-------------|
| **Development** | `skills/rust-development.md` | Writing new Rust code, implementing features |
| **Quality** | `skills/rust-quality.md` | Code review, CI setup, linting, formatting |
| **Security** | `skills/rust-security.md` | Auditing unsafe code, dependency review, security review |
| **Refactoring** | `skills/rust-refactoring.md` | Restructuring existing code, reducing tech debt |
| **Testing** | `skills/rust-testing.md` | Writing tests, improving test coverage |

### Workflow Order
For the best results, follow this order when working on a feature:

1. **rust-development** — Write the implementation.
2. **rust-testing** — Write tests for the implementation.
3. **rust-refactoring** — Improve the code structure.
4. **rust-quality** — Ensure formatting, linting, and documentation.
5. **rust-security** — Audit for safety and vulnerabilities.

### Pre-Commit Checklist
Before committing any Rust code, verify:
```bash
cargo check --all-targets --all-features
cargo fmt -- --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --all-targets --all-features
cargo doc --no-deps
cargo audit
```

### Key Rust Commands Reference
| Command | Purpose |
|---------|---------|
| `cargo check` | Fast compilation check (no codegen) |
| `cargo build` | Compile the project |
| `cargo run` | Build and run the binary |
| `cargo test` | Run tests |
| `cargo fmt` | Format code with rustfmt |
| `cargo clippy` | Run the Clippy linter |
| `cargo doc --open` | Generate and open documentation |
| `cargo audit` | Check dependencies for vulnerabilities |
| `cargo update` | Update dependency versions |
| `cargo tree` | Display dependency tree |
| `cargo bench` | Run benchmarks |
| `cargo install` | Install a binary crate |
| `cargo add <crate>` | Add a dependency (requires cargo-edit) |

### Recommended Tooling
- **IDE**: VS Code with `rust-analyzer` extension, or RustRover
- **Linting**: `clippy` + `rustfmt`
- **Security**: `cargo-audit`, `cargo-deny`
- **Coverage**: `cargo-tarpaulin` or `cargo-llvm-cov`
- **Mocking**: `mockall`
- **Property Testing**: `proptest`
- **Snapshot Testing**: `insta`
- **Fixtures**: `rstest`

### Project Setup Essentials
A well-configured `Cargo.toml` should include:
```toml
[package]
name = "my-project"
version = "0.1.0"
edition = "2024"
rust-version = "1.85"

[lints.rust]
unsafe_code = "deny"
missing_docs = "warn"

[lints.clippy]
pedantic = "warn"
nursery = "warn"
unwrap_used = "warn"
expect_used = "warn"
```

---

*This harness is part of the A4I hackathon rewards system. Use it to level up your Rust development workflow.*
