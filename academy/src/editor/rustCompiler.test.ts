import { describe, expect, test } from 'vitest'
import { diagnosticsFromRustStderr } from './rustCompiler'

describe('diagnosticsFromRustStderr', () => {
  test('parses rust error diagnostics with source location', () => {
    const code = 'fn main() {\n  let x = 1;\n}\n'
    const stderr = [
      'error[E0308]: mismatched types',
      '  --> src/main.rs:2:11',
      '   |',
      '2  |   let x = "a";',
    ].join('\n')

    const diagnostics = diagnosticsFromRustStderr(code, stderr)
    expect(diagnostics).toHaveLength(1)
    expect(diagnostics[0].severity).toBe('error')
    expect(diagnostics[0].source).toBe('rustc')
    expect(diagnostics[0].message).toContain('mismatched types')
  })

  test('parses warning diagnostics', () => {
    const diagnostics = diagnosticsFromRustStderr(
      'fn main() {}',
      'warning: unused variable\n  --> src/main.rs:1:1'
    )

    expect(diagnostics).toHaveLength(1)
    expect(diagnostics[0].severity).toBe('warning')
  })

  test('creates a fallback error diagnostic when no location is present', () => {
    const diagnostics = diagnosticsFromRustStderr('fn main() {}', 'error: rustc failed hard')
    expect(diagnostics).toHaveLength(1)
    expect(diagnostics[0].from).toBe(0)
    expect(diagnostics[0].severity).toBe('error')
  })
})
