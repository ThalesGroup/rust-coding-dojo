# Rust Security Skill

## Purpose
Identify and mitigate security vulnerabilities in Rust codebases, with a focus on unsafe code, dependency security, and secure coding patterns.

## Unsafe Code Audit

### When Unsafe Is Necessary
- FFI (Foreign Function Interface) with C libraries.
- Low-level memory manipulation for performance-critical paths.
- Implementing core data structures (e.g., custom allocators, lock-free structures).

### Unsafe Safety Checklist
- [ ] All `unsafe` blocks are minimized to the smallest possible scope.
- [ ] Every `unsafe` block has a `// SAFETY:` comment explaining why invariants hold.
- [ ] Raw pointers are properly checked for null and alignment.
- [ ] No use-after-free or double-free — verify ownership semantics.
- [ ] Use `UnsafeCell` correctly with appropriate synchronization.
- [ ] Verify pointer provenance rules are respected.

### Unsafe Audit Command
Run the following to locate all unsafe code:
```bash
rg "unsafe\s*(\{|fn|impl|trait)" --type rust
```

## Dependency Security

### Vulnerability Scanning
- Run `cargo audit` before every commit and in CI.
- Use `cargo deny` to check for:
  - Vulnerabilities (advisory database)
  - License compliance
  - Duplicate dependencies
  - Banned crates

### Supply Chain
- Prefer well-maintained crates with >10k downloads.
- Review crate authors and maintainer activity.
- Avoid crates with unmaintained or deprecated status.
- Pin exact versions; use lockfiles (`Cargo.lock` for binaries).

## Secure Coding Patterns

### Input Validation
- Never trust external input. Validate length, encoding, and type.
- Use `serde` with strict deserialization. Deny unknown fields.
- Sanitize user input before constructing file paths, SQL, or shell commands.

### Secrets Management
- Never hardcode secrets. Use environment variables or a vault.
- Redact secrets from logs and error messages.
- Use the `secrecy` crate for sensitive data in memory.

### Cryptography
- Use well-audited crates: `ring`, `rustls`, `aes-gcm`, `sha2`.
- Never implement your own crypto algorithms.
- Use constant-time comparison for secrets (`subtle` crate).

### Memory Safety
- Prefer `&str` over `&[u8]` for text — encoding matters.
- Use `std::mem::take()` or `std::mem::replace()` to avoid cloning when moving out.
- Be cautious with `std::mem::transmute` — it bypasses all safety checks.

### Panic Safety
- Avoid `unwrap()` and `expect()` in production code paths.
- Use `catch_unwind` at FFI boundaries to prevent undefined behavior.
- Ensure `Drop` implementations don't panic.

## Checklist
- [ ] All `unsafe` blocks have `// SAFETY:` documentation.
- [ ] `cargo audit` reports zero vulnerabilities.
- [ ] `cargo deny check` passes all checks.
- [ ] No secrets in source code or configuration files.
- [ ] Input validation is present on all external entry points.
- [ ] Crypto uses well-audited libraries only.
