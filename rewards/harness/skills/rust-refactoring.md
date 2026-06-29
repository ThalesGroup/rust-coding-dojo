# Rust Refactoring Skill

## Purpose
Guide systematic refactoring of Rust code to improve structure, readability, and maintainability without changing external behavior.

## Refactoring Workflow

### Phase 1 — Code Smell Detection
Look for common Rust-specific smells:

| Smell | Example | Improvement |
|-------|---------|-------------|
| **Deep match nesting** | `match a { X => match b { ... } }` | Extract functions, use combinators |
| **`.clone()` everywhere** | `let x = data.clone();` | Pass references, use `Rc`/`Arc` if needed |
| **Long generic parameter lists** | `fn foo<A: Trait1, B: Trait2, C: Trait3>(...)` | Introduce associated types or a config struct |
| **God modules** | 500+ line files | Split into submodules by concern |
| **Boolean blindness** | `fn process(flag: bool)` | Replace with meaningful enums |
| **`unwrap()` in production** | `let x = opt.unwrap();` | Use `?`, `match`, or `unwrap_or_else` |
| **Mutable global state** | `static mut STATE: ...` | Use `OnceCell`, `LazyLock`, or dependency injection |
| **Stringly-typed APIs** | `fn lookup(key: &str)` where key is an enum variant | Use actual enums |

### Phase 2 — Structural Refactoring

#### Extract Function
- Functions over 50 lines are candidates for extraction.
- Extract pure logic into testable helper functions.
- Use `impl` blocks to group related methods.

#### Introduce Type Alias / Newtype
```rust
// Before
fn process(users: Vec<(String, u32, String)>) { ... }

// After
struct User { name: String, age: u32, email: String }
fn process(users: Vec<User>) { ... }
```

#### Enum-Driven Design
Replace chains of `if/else` or boolean flags with enums:
```rust
// Before
fn handle(mode: &str) {
    if mode == "read" { ... }
    else if mode == "write" { ... }
}

// After
enum Mode { Read, Write }
fn handle(mode: Mode) { ... }
```

#### Result / Option Chains
Use combinator methods for cleaner error handling:
```rust
// Before
let x = match opt {
    Some(v) => Some(v + 1),
    None => None,
};

// After
let x = opt.map(|v| v + 1);
```

### Phase 3 — Pattern Modernization

- Replace `&Vec<T>` parameters with `&[T]` for flexibility.
- Use `impl Trait` in argument position for generics.
- Replace manual `Drop` impls with `ManuallyDrop` or RAII wrappers.
- Use `let-else` for early returns on pattern mismatch.
- Prefer `matches!` macro over verbose `match` for boolean checks.

### Phase 4 — Test After Refactoring
- Run `cargo test` after every refactoring step.
- Existing tests must still pass — behavior must not change.
- Add tests for extracted functions if they weren't previously covered.
- Run `cargo clippy` and `cargo fmt` after refactoring.

## Checklist
- [ ] All existing tests pass.
- [ ] No behavioral changes (verified by tests).
- [ ] No new `unwrap()` calls introduced.
- [ ] Functions are under 50 lines.
- [ ] Files are under 300 lines.
- [ ] Clippy and rustfmt pass without warnings.
