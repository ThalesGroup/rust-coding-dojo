# Rust Development Skill

## Purpose
Guide and assist Rust developers in writing idiomatic, efficient, and maintainable code.

## Core Principles

### Ownership & Borrowing
- Prefer borrowing (`&T`, `&mut T`) over taking ownership when mutation is not required.
- Use `Cow<'_, T>` for copy-on-write semantics when appropriate.
- Avoid unnecessary `.clone()` — pass references instead.

### Error Handling
- Use `Result<T, E>` and `Option<T>` instead of panicking.
- Leverage `?` operator for concise error propagation.
- Define custom error types with `thiserror` or `anyhow` for application-level errors.
- Use `expect()` and `unwrap()` only in tests or when the invariant is truly unrecoverable.

### Traits & Generics
- Prefer trait bounds over concrete types for flexible APIs.
- Use `impl Trait` in return position for ergonomic interfaces.
- Leverage standard traits: `Debug`, `Clone`, `PartialEq`, `Eq`, `Hash`, `Display`, `Default`.
- Derive common traits with `#[derive(...)]` instead of manual impls.

### Modules & Organization
- Keep modules small and focused. One responsibility per module.
- Use `pub(crate)` for internal visibility, `pub` for public API.
- Re-export key types with `pub use` for a clean public API surface.

### Performance
- Prefer stack allocation over heap allocation when possible.
- Use iterators and combinators — they are zero-cost abstractions.
- Leverage `Vec::with_capacity()` when the size is known.
- Profile before optimizing; trust the compiler.

### Async
- Use `tokio` as the default async runtime.
- Prefer `async fn` over manual futures.
- Be mindful of `Send + Sync` bounds in async contexts.

## Checklist
- [ ] `cargo check` passes without warnings.
- [ ] `cargo clippy` passes without warnings.
- [ ] No unnecessary clones or allocations.
- [ ] Error types are descriptive and actionable.
- [ ] Public API is documented with doc comments (`///`).
