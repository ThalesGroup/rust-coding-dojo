# Rust Testing Skill

## Purpose
Guide Rust developers in writing comprehensive, maintainable, and effective tests.

## Testing Levels

### Unit Tests (`#[cfg(test)] mod tests`)
- Test one function or method in isolation.
- Place unit tests in the same file as the code they test (convention).
- Name test functions descriptively: `test_<function>_<scenario>_<expected_behavior>`.
- Cover:
  - Happy path
  - Edge cases (empty input, max values, boundary conditions)
  - Error cases (invalid input, missing data, timeouts)

### Integration Tests (`tests/` directory)
- Test the public API of your crate as a consumer would use it.
- Each file in `tests/` is compiled as a separate crate.
- Test end-to-end workflows, not individual functions.

### Documentation Tests
- Examples in doc comments are compiled and run as tests.
- Use `#` to hide setup code from rendered docs.
- Ensure doc examples are self-contained and representative.

## Test Patterns

### Arrange-Act-Assert (AAA)
```rust
#[test]
fn test_parse_valid_input_returns_ok() {
    // Arrange
    let input = "42";

    // Act
    let result = input.parse::<i32>();

    // Assert
    assert_eq!(result, Ok(42));
}
```

### Test Fixtures with `rstest`
```rust
#[rstest]
#[case("1", 1)]
#[case("42", 42)]
#[case("-7", -7)]
fn test_parse_valid_cases(#[case] input: &str, #[case] expected: i32) {
    assert_eq!(input.parse::<i32>().unwrap(), expected);
}
```

### Snapshot Testing with `insta`
Use for complex output types (HTML, JSON, long strings):
```rust
#[test]
fn test_render_report() {
    let report = generate_report(&data);
    insta::assert_snapshot!(report);
}
```

### Property-Based Testing with `proptest`
```rust
proptest! {
    #[test]
    fn test_roundtrip(s in ".*") {
        let parsed = parse(&s);
        let serialized = serialize(&parsed);
        assert_eq!(parse(&serialized), parsed);
    }
}
```

### Mocking with `mockall`
```rust
#[mockall::automock]
trait Database {
    fn query(&self, id: u32) -> Option<User>;
}

#[test]
fn test_service_handles_missing_user() {
    let mut db = MockDatabase::new();
    db.expect_query().returning(|_| None);
    let service = UserService::new(db);
    assert!(service.get_user(1).is_err());
}
```

## Test Quality

### What Makes a Good Test
- **Fast**: Unit tests should complete in milliseconds.
- **Deterministic**: No reliance on time, network, or randomness (or seed them).
- **Isolated**: Tests don't depend on execution order or shared state.
- **Readable**: A new developer can understand the behavior from the test name and code.

### What to Avoid
- Testing implementation details — test behavior, not internals.
- Tests that never fail — they give false confidence.
- Sleeping in tests — use `tokio::time::advance` or mock time.
- Testing external services — mock them or use testcontainers.

## Test Coverage

### Tools
```bash
# Install tarpaulin for coverage
cargo install cargo-tarpaulin

# Generate coverage report
cargo tarpaulin --out Html --output-dir coverage
```

### Target Coverage
- 80%+ line coverage for business logic.
- 100% coverage for critical paths (auth, payments, data integrity).
- Focus on branch coverage, not just line coverage.

## Running Tests
```bash
cargo test                          # All tests (single thread by default)
cargo test -- --test-threads=8      # Parallel tests
cargo test <test_name>              # Run specific test
cargo test -- --nocapture           # Show stdout/stderr
cargo test -- --ignored             # Run ignored tests
cargo test --all-targets            # Include benchmarks and doctests
```

## Checklist
- [ ] Unit tests for all public functions.
- [ ] Happy path, edge case, and error case covered.
- [ ] Integration tests for key workflows.
- [ ] Doc examples compile and pass.
- [ ] Test names clearly describe the scenario.
- [ ] Tests are fast and deterministic.
- [ ] No production code commented out "for testing".
