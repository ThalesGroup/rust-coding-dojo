# OpenCode Rust Instructions

## Latest Rust Documentation
When working with Rust code, always reference the latest stable Rust documentation.

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

### Behavior Rules for Rust Tasks

1. **Before writing Rust code**, fetch the relevant doc page from the latest stable docs.
   - Use `webfetch` on `https://doc.rust-lang.org/stable/std/` or specific module pages.
   - Check for edition 2024 idioms and features.

2. **When using a crate**, fetch its latest docs from `https://docs.rs/<crate>/latest/`.

3. **For Clippy warnings**, reference `https://rust-lang.github.io/rust-clippy/stable/index.html`.

4. **For unsafe code**, consult the Nomicon first.

5. **For async code**, reference the Async Book and latest tokio docs.

6. **Edition**: Default to Rust Edition 2024 syntax and conventions unless the project specifies otherwise.

7. **Do not guess APIs**. If unsure about a standard library function signature, trait bound, or module path, look it up on `https://doc.rust-lang.org/stable/std/`.

8. **Cargo.toml**: Use the latest crate versions from crates.io. Run `cargo update` when appropriate.

### Pre-Coding Checklist
- [ ] Relevant doc pages fetched/consulted.
- [ ] Crate versions checked on crates.io/docs.rs.
- [ ] Edition 2024 features considered.
- [ ] Clippy lint rules understood for the code being written.
