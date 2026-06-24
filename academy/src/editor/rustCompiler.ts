import type { Diagnostic } from '@codemirror/lint'

export interface CompileResult {
  success: boolean
  stdout: string
  stderr: string
}

interface PlaygroundCompileResponse {
  success?: boolean
  stdout?: string
  stderr?: string
}

const PLAYGROUND_COMPILE_URL = 'https://play.rust-lang.org/compile'

export async function compileRust(code: string): Promise<CompileResult> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 12000)

  try {
    const response = await fetch(PLAYGROUND_COMPILE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: 'stable',
        mode: 'debug',
        edition: '2021',
        crateType: 'bin',
        tests: false,
        code,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      return {
        success: false,
        stdout: '',
        stderr: `error: rust compiler request failed (${response.status})`,
      }
    }

    const payload = (await response.json()) as PlaygroundCompileResponse
    return {
      success: Boolean(payload.success),
      stdout: payload.stdout ?? '',
      stderr: payload.stderr ?? '',
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown compile error'
    return {
      success: false,
      stdout: '',
      stderr: `error: unable to reach rust compiler (${message})`,
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

function lineColToOffset(code: string, line: number, col: number): number {
  const safeLine = Math.max(1, line)
  const safeCol = Math.max(1, col)
  const lines = code.split('\n')
  let offset = 0
  for (let i = 1; i < safeLine; i += 1) {
    offset += (lines[i - 1] ?? '').length + 1
  }
  return Math.min(code.length, offset + safeCol - 1)
}

export function diagnosticsFromRustStderr(code: string, stderr: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = []
  const lines = stderr.split(/\r?\n/)

  for (let i = 0; i < lines.length; i += 1) {
    const head = lines[i].match(/^(error|warning)(?:\[[^\]]+\])?:\s*(.+)$/)
    if (!head) continue

    let line = 1
    let col = 1
    for (let j = i + 1; j < Math.min(i + 8, lines.length); j += 1) {
      const loc = lines[j].match(/^\s*-->\s*[^:]+:(\d+):(\d+)$/)
      if (loc) {
        line = Number(loc[1])
        col = Number(loc[2])
        break
      }
    }

    const from = lineColToOffset(code, line, col)
    const to = Math.min(code.length, from + 1)
    diagnostics.push({
      from,
      to,
      severity: head[1] === 'warning' ? 'warning' : 'error',
      message: head[2],
      source: 'rustc',
    })
  }

  if (diagnostics.length === 0 && stderr.trim().startsWith('error:')) {
    diagnostics.push({
      from: 0,
      to: Math.min(1, code.length),
      severity: 'error',
      message: stderr.trim(),
      source: 'rustc',
    })
  }

  return diagnostics
}
