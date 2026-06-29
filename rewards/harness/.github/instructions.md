# GitHub Rust Instructions

## Latest Rust Documentation
When working with Rust code in GitHub Copilot or any GitHub-integrated AI tool, always reference the latest stable Rust documentation.

### Primary Documentation Sources (always use latest stable)
- **Std API docs**: https://doc.rust-lang.org/stable/std/
- **The Rust Reference**: https://doc.rust-lang.org/reference/
- **The Rust Book**: https://doc.rust-lang.org/book/
- **Rust by Example**: https://doc.rust-lang.org/rust-by-example/
- **The Cargo Book**: https://doc.rust-lang.org/cargo/
- **Edition Guide (2024)**: https://doc.rust-lang.org/edition-guide/
- **Rustdoc Guide**: https://doc.rust-lang.org/rustdoc/
- **The Nomicon** (unsafe Rust): https://doc.rust-lang.org/nomicon/
- **Async Book**: https://rust-lang.github.io/async-book/
- **Performance Book**: https://nnethercote.github.io/perf-book/

### Tooling Documentation
- **Clippy lints**: https://rust-lang.github.io/rust-clippy/
- **Crates.io**: https://crates.io/
- **Docs.rs** (crate docs): https://docs.rs/

## Behavior Rules for Rust Tasks

1. **Before generating Rust code**, always look up APIs on the latest stable docs.
2. **When suggesting a crate**, check its latest version on crates.io and its documentation on docs.rs.
3. **For Clippy warnings**, reference the official Clippy lint list.
4. **For unsafe code**, consult the Nomicon.
5. **For async code**, reference the Async Book and latest tokio docs.
6. **Edition**: Default to Rust Edition 2024 syntax and conventions.
7. **Do not guess APIs**. Look them up on `https://doc.rust-lang.org/stable/std/`.
8. **Cargo.toml**: Suggest latest crate versions from crates.io.

## Pre-Coding Checklist
- [ ] Relevant doc pages consulted.
- [ ] Crate versions verified on crates.io/docs.rs.
- [ ] Edition 2024 features considered.
- [ ] Clippy lint rules understood.
