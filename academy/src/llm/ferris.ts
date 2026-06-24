import { generateLocalFerrisReply, preloadModel, isModelReady, getModelInfo, getDownloadProgress, type FerrisContext } from './localWllama'
import type { ChatMessage } from '../types'

export { preloadModel, isModelReady, getModelInfo, getDownloadProgress }

/**
 * Module Ferris — mentor local wllama avec fallback règles.
 */

export async function askFerris(
  userMessage: string,
  kataCode: string,
  kataTitle: string,
  history: ChatMessage[],
  context?: Partial<FerrisContext>,
  onToken?: (token: string) => void,
  skipContext?: boolean
): Promise<string> {
  try {
    return await generateLocalFerrisReply(userMessage, {
      kataTitle,
      code: kataCode,
      history,
      ...context,
    }, onToken, skipContext)
  } catch (error) {
    console.warn('[ferris] local wllama unavailable, using fallback', error)
    return fallbackReply(userMessage, kataCode)
  }
}

export async function explainCode(code: string, kataTitle: string, context?: Partial<FerrisContext>, onToken?: (token: string) => void): Promise<string> {
  try {
    return await generateLocalFerrisReply('Explain this code without giving the full kata solution directly.', {
      kataTitle,
      code,
      ...context,
    }, onToken)
  } catch (error) {
    console.warn('[ferris] local wllama unavailable, using fallback', error)
    return fallbackExplain(code, kataTitle)
  }
}

export async function reviewCode(code: string, kataTitle: string, context?: Partial<FerrisContext>, onToken?: (token: string) => void): Promise<string> {
  try {
    return await generateLocalFerrisReply('Do a short, actionable code review of my Rust code.', {
      kataTitle,
      code,
      ...context,
    }, onToken)
  } catch (error) {
    console.warn('[ferris] local wllama unavailable, using fallback', error)
    return fallbackReview(code)
  }
}

function fallbackReply(text: string, code: string): string {
  const t = text.toLowerCase()
  if (t.includes('usize')) return '`usize` is an unsigned integer the size of a pointer — it is the type returned by `.len()` because a length cannot be negative.'
  if (t.includes('clone')) return '`.clone()` duplicates the data on the heap. It works but is costly here — borrowing with `&` is free and intended for this kata.'
  if (t.includes('&') || t.includes('ref') || t.includes('emprun')) return 'Exactly: `&s` creates a shared reference. `main` keeps ownership; the function only reads. 👌'
  if (t.includes('lifetime') || t.includes("'a")) return 'Lifetimes ensure references remain valid. `\'a` is an annotation that ties parameter lifetimes to the return.'
  if (t.includes('merci') || t.includes('thanks')) return 'You’re welcome! 🦀 Keep it up.'
  if (/error|erreur/.test(t)) return 'Look at the compiler error message — it is very informative. Click 💡 Hint +1 for a progressive nudge.'
  const hasRef = /&[A-Za-z]/.test(code)
  if (!hasRef) return 'For this kata, the key is to borrow with `&` rather than move. Run the tests with ▶ to see where you stand!'
  return 'Good progress! Run the tests with ▶ to validate, or click 💡 Hint +1 for a nudge.'
}

function fallbackExplain(code: string, kataTitle: string): string {
  if (/fn calc_len/.test(code)) return 'Your `calc_len` takes `s: String` → it becomes owned and the value is dropped at the end. That is why `println!` can no longer use `s`. A `&String` reference fixes this: borrow without taking ownership.'
  if (/&mut/.test(code)) return 'This code uses a mutable reference `&mut`. Only one `&mut` can exist at a time in a scope — the borrow checker prevents data races.'
  if (/<'a>/.test(code)) return 'Lifetime annotations like `\'a` tell the compiler that input and output references share a minimal lifetime. This avoids dangling references.'
  return `Kata "${kataTitle}" : each value has a single owner. References (\`&\`) allow borrowing without transferring ownership — this is the heart of Rust memory safety.`
}

function fallbackReview(code: string): string {
  if (/\.clone\(\)/.test(code)) return 'Code review: you use `.clone()` — it copies the whole buffer to the heap. Prefer borrowing with `&`: zero allocation, more idiomatic.'
  if (/&String/.test(code)) return 'Code review: prefer `&str` over `&String` — your function will also accept literals and slices. More idiomatic.'
  if (/unwrap\(\)/.test(code)) return 'Code review: `.unwrap()` will panic on `None`/`Err`. Prefer `?`, `unwrap_or`, or an explicit `match`.'
  return 'Code review: clear structure. To go further, explore the `Display` and `Debug` traits to improve printing of custom types.'
}
