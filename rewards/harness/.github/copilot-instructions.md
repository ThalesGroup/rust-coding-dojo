# GitHub Copilot Instructions — Rust Development

## Always Use Latest Rust Documentation

When generating Rust code, consulting APIs, or explaining Rust concepts, always reference the **latest stable** Rust documentation:

- **Standard Library**: https://doc.rust-lang.org/stable/std/index.html
- **Rust Reference**: https://doc.rust-lang.org/reference/
- **The Rust Book**: https://doc.rust-lang.org/book/
- **Rust by Example**: https://doc.rust-lang.org/rust-by-example/
- **Cargo Book**: https://doc.rust-lang.org/cargo/
- **Edition Guide (2024)**: https://doc.rust-lang.org/edition-guide/
- **The Nomicon** (unsafe Rust): https://doc.rust-lang.org/nomicon/
- **Async Book**: https://rust-lang.github.io/async-book/
- **Clippy Lint Reference**: https://rust-lang.github.io/rust-clippy/
- **Crate Docs**: https://docs.rs/

## Code Generation Rules

1. **Edition**: Use Rust Edition 2024 syntax and idioms.
2. **Types**: Prefer `&str` over `&String`, `&[T]` over `&Vec<T>`, `impl Trait` where appropriate.
3. **Error handling**: Use `Result<T, E>` and the `?` operator. Avoid `unwrap()` and `expect()` outside tests.
4. **Traits**: Derive standard traits (`Debug`, `Clone`, `PartialEq`, `Eq`, `Hash`). Use `#[derive(...)]`.
5. **Documentation**: All `pub` items must have `///` doc comments with examples.
6. **Unsafe**: Never generate `unsafe` code unless explicitly requested and with `// SAFETY:` comments.
7. **Formatting**: Follow `rustfmt` default style.
8. **Naming**: Follow Rust naming conventions (snake_case for functions/variables, CamelCase for types, SCREAMING_SNAKE_CASE for consts/statics).
9. **Dependencies**: Prefer well-maintained crates. Check crates.io for latest versions.
10. **Async**: Use `tokio` as the default async runtime unless the project specifies otherwise.

## Code Review Rules

- Suggest `cargo clippy` fixes referencing the actual lint name and rationale.
- Flag missing documentation on public items.
- Flag unnecessary `.clone()` calls.
- Suggest `matches!` macro where appropriate.
- Suggest `let-else` for pattern-matching early returns.
- Recommend `#[must_use]` on functions returning `Result` or `Option`.

## Testing Rules

- Generate unit tests alongside implementation code in `#[cfg(test)] mod tests`.
- Use `rstest` for parameterized tests when multiple cases exist.
- Test happy-path, edge cases, and error cases.
