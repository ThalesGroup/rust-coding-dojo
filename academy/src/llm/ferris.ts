import { generateLocalFerrisReply, preloadModel, isModelReady, getModelInfo, type FerrisContext } from './localWllama'
import type { ChatMessage } from '../types'

export { preloadModel, isModelReady, getModelInfo }

/**
 * Module Ferris — mentor local wllama avec fallback règles.
 */

export async function askFerris(
  userMessage: string,
  kataCode: string,
  kataTitle: string,
  history: ChatMessage[],
  context?: Partial<FerrisContext>,
  onToken?: (token: string) => void
): Promise<string> {
  try {
    return await generateLocalFerrisReply(userMessage, {
      kataTitle,
      code: kataCode,
      history,
      ...context,
    }, onToken)
  } catch (error) {
    console.warn('[ferris] local wllama unavailable, using fallback', error)
    return fallbackReply(userMessage, kataCode)
  }
}

export async function explainCode(code: string, kataTitle: string, context?: Partial<FerrisContext>, onToken?: (token: string) => void): Promise<string> {
  try {
    return await generateLocalFerrisReply('Explique ce code sans donner directement la solution complète du kata.', {
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
    return await generateLocalFerrisReply('Fais une code review courte et actionnable de mon code Rust.', {
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
  if (t.includes('usize')) return '`usize` est un entier non signé de la taille d\'un pointeur — c\'est le type renvoyé par `.len()` car une longueur ne peut pas être négative.'
  if (t.includes('clone')) return '`.clone()` duplique la donnée sur le tas. Ça marche mais c\'est coûteux ici — l\'emprunt `&` est gratuit et c\'est le but du kata.'
  if (t.includes('&') || t.includes('ref') || t.includes('emprun')) return 'Exactement : `&s` crée une référence partagée. `main` garde la possession, la fonction ne fait que lire. 👌'
  if (t.includes('lifetime') || t.includes("'a")) return 'Les lifetimes garantissent que les références restent valides. `\'a` est une annotation qui lie la durée de vie des paramètres à celle du retour.'
  if (t.includes('merci') || t.includes('thanks')) return 'Avec plaisir ! 🦀 Continue comme ça.'
  if (/error|erreur/.test(t)) return 'Regarde le message d\'erreur du compilateur — il est très informatif. Clique 💡 Indice +1 pour un coup de pouce progressif.'
  const hasRef = /&[A-Za-z]/.test(code)
  if (!hasRef) return 'Pour ce kata, la clé est d\'emprunter avec `&` plutôt que de déplacer. Lance les tests avec ▶ pour voir où tu en es !'
  return 'Bonne progression ! Lance les tests avec ▶ pour valider, ou clique 💡 Indice +1 pour un coup de pouce.'
}

function fallbackExplain(code: string, kataTitle: string): string {
  if (/fn calc_len/.test(code)) return 'Ton `calc_len` prend `s: String` → il devient propriétaire et la valeur est libérée à la fin. C\'est pour ça que `println!` ne peut plus utiliser `s`. Une référence `&String` règle ça : on emprunte sans posséder.'
  if (/&mut/.test(code)) return 'Ce code utilise une référence mutable `&mut`. Il ne peut exister qu\'une seule `&mut` à la fois dans un scope — le borrow checker garantit l\'absence de data races.'
  if (/<'a>/.test(code)) return 'Les annotations de lifetime `\'a` indiquent au compilateur que les références en entrée et en sortie ont la même durée de vie minimale. Ça évite les dangling references.'
  return `Code du kata "${kataTitle}" : chaque valeur a un propriétaire unique. Les références (\`&\`) permettent d'emprunter sans transférer la possession — c'est le cœur de la sûreté mémoire de Rust.`
}

function fallbackReview(code: string): string {
  if (/\.clone\(\)/.test(code)) return 'Code review : tu utilises `.clone()` — ça copie tout le buffer sur le tas. Préfère un emprunt `&` : zéro allocation, idiomatique.'
  if (/&String/.test(code)) return 'Code review : préfère `&str` plutôt que `&String` → ta fonction marchera aussi avec des littéraux et des slices. C\'est plus idiomatique.'
  if (/unwrap\(\)/.test(code)) return 'Code review : `.unwrap()` panique si la valeur est `None`/`Err`. Préfère `?`, `unwrap_or`, ou un `match` explicite.'
  return 'Code review : structure claire. Pour aller plus loin, explore les traits `Display` et `Debug` pour améliorer l\'affichage de tes types personnalisés.'
}
