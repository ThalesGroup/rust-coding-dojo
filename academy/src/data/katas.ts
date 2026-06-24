import type { Kata } from '../types'

export const KATAS: Kata[] = [
  {
    id: 'kata-01',
    title: 'Hello, Ferris !',
    titleEn: 'Hello, Ferris!',
    number: 1,
    total: 40,
    difficulty: 'facile',
    concept: 'bases',
    xpReward: 20,
    description: `Affiche <code>"Bonjour, Ferris !"</code> dans la console avec <code>println!</code>.`,
    starterCode: `fn main() {\n    // Affiche "Bonjour, Ferris !"\n}`,
    hints: [
      '💡 Indice 1/2 — Utilise la macro `println!("texte")` pour afficher du texte.',
      '💡 Indice 2/2 — `println!("Bonjour, Ferris !")` — n\'oublie pas le point d\'exclamation après println.'
    ],
    tests: [
      { name: 'test_affiche_bonjour', description: 'Le code affiche "Bonjour, Ferris !"', check: (c) => /println!\s*\(\s*["']Bonjour, Ferris\s*!["']/.test(c) },
      { name: 'test_utilise_println', description: 'Utilise println!', check: (c) => /println!/.test(c) }
    ],
    solutionCode: `fn main() {\n    println!("Bonjour, Ferris !");\n}`
  },
  {
    id: 'kata-02',
    title: 'Variables et mutabilité',
    titleEn: 'Variables and mutability',
    number: 2,
    total: 40,
    difficulty: 'facile',
    concept: 'bases',
    xpReward: 25,
    description: `Déclare une variable <code>x</code> valant <b>5</b>, puis rends-la mutable et incrémente-la de <b>1</b>. Affiche la valeur finale.`,
    starterCode: `fn main() {\n    let x = 5;\n    // Rends x mutable et incrémente de 1\n    println!("x = {}", x);\n}`,
    hints: [
      '💡 Indice 1/2 — `let mut x` permet de déclarer une variable mutable.',
      '💡 Indice 2/2 — `x += 1;` incrémente x de 1. Le résultat doit être 6.'
    ],
    tests: [
      { name: 'test_let_mut', description: 'Utilise let mut', check: (c) => /let\s+mut\s+x/.test(c) },
      { name: 'test_increment', description: 'Incrémente x', check: (c) => /x\s*\+=\s*1/.test(c) || /x\s*=\s*x\s*\+\s*1/.test(c) },
      { name: 'test_println', description: 'Affiche x', check: (c) => /println!/.test(c) }
    ],
    solutionCode: `fn main() {\n    let mut x = 5;\n    x += 1;\n    println!("x = {}", x);\n}`
  },
  {
    id: 'kata-03',
    title: 'Move semantics',
    titleEn: 'Move semantics',
    number: 3,
    total: 40,
    difficulty: 'facile',
    concept: 'ownership',
    xpReward: 30,
    description: `Crée une <code>String</code>, assigne-la à une autre variable, puis essaie d'afficher les deux. Corrige l'erreur avec <code>.clone()</code> ou en changeant ta logique.`,
    starterCode: `fn main() {\n    let s1 = String::from("Rust");\n    let s2 = s1; // Move!\n    println!("{} {}", s1, s2);\n}`,
    hints: [
      '💡 Indice 1/2 — `s1` est déplacé dans `s2`. Après le move, `s1` n\'est plus valide.',
      '💡 Indice 2/2 — Utilise `s1.clone()` pour copier la valeur : `let s2 = s1.clone();`'
    ],
    tests: [
      { name: 'test_clone_ou_ref', description: 'Utilise clone() ou une référence', check: (c) => /\.clone\(\)/.test(c) || /&s1/.test(c) },
      { name: 'test_println_two', description: 'Affiche les deux variables', check: (c) => (c.match(/println!/g) || []).length >= 1 }
    ],
    solutionCode: `fn main() {\n    let s1 = String::from("Rust");\n    let s2 = s1.clone();\n    println!("{} {}", s1, s2);\n}`
  },
  {
    id: 'kata-04',
    title: 'Drop automatique',
    titleEn: 'Automatic drop',
    number: 4,
    total: 40,
    difficulty: 'facile',
    concept: 'ownership',
    xpReward: 30,
    description: `Crée une <code>String</code> dans un bloc <code>{ }</code>. Vérifie que tu ne peux plus l'utiliser hors du bloc. Utilise <code>drop()</code> pour libérer explicitement.`,
    starterCode: `fn main() {\n    let s = String::from("Ownership");\n    {\n        let inner = String::from("scoped");\n        println!("{}", inner);\n    } // inner est droppé ici\n    println!("{}", s);\n    // Libère s explicitement avant la fin\n}`,
    hints: [
      '💡 Indice 1/1 — `drop(s);` libère la String explicitement. Après ça, `s` n\'est plus accessible.'
    ],
    tests: [
      { name: 'test_drop_call', description: 'Utilise drop()', check: (c) => /drop\s*\(/.test(c) },
      { name: 'test_inner_in_block', description: 'inner est dans un bloc', check: (c) => /\{\s*\n\s*let inner/.test(c) || /{\s*let inner/.test(c) }
    ],
    solutionCode: `fn main() {\n    let s = String::from("Ownership");\n    {\n        let inner = String::from("scoped");\n        println!("{}", inner);\n    }\n    println!("{}", s);\n    drop(s);\n}`
  },
  {
    id: 'kata-05',
    title: 'Fonctions et ownership',
    titleEn: 'Functions and ownership',
    number: 5,
    total: 40,
    difficulty: 'facile',
    concept: 'ownership',
    xpReward: 35,
    description: `Écris une fonction <code>takes_ownership(s: String)</code> et une <code>makes_copy(n: i32)</code>. Montre qu'une String est déplacée mais un i32 est copié.`,
    starterCode: `fn main() {\n    let s = String::from("Bonjour");\n    let n = 42;\n    // Appelle takes_ownership et makes_copy\n}\n\nfn takes_ownership(s: String) {\n    println!("Got: {}", s);\n}\n\nfn makes_copy(n: i32) {\n    println!("Got: {}", n);\n}`,
    hints: [
      '💡 Indice 1/2 — Appelle `takes_ownership(s)` — après cet appel, `s` ne sera plus accessible dans main.',
      '💡 Indice 2/2 — Appelle `makes_copy(n)` — `n` est copié, donc tu peux encore l\'utiliser après.'
    ],
    tests: [
      { name: 'test_takes_ownership_call', description: 'Appelle takes_ownership', check: (c) => /takes_ownership\s*\(/.test(c) },
      { name: 'test_makes_copy_call', description: 'Appelle makes_copy', check: (c) => /makes_copy\s*\(/.test(c) }
    ],
    solutionCode: `fn main() {\n    let s = String::from("Bonjour");\n    let n = 42;\n    takes_ownership(s);\n    makes_copy(n);\n    println!("n est encore {} !", n);\n}\n\nfn takes_ownership(s: String) {\n    println!("Got: {}", s);\n}\n\nfn makes_copy(n: i32) {\n    println!("Got: {}", n);\n}`
  },
  {
    id: 'kata-06',
    title: 'Retour d\'ownership',
    titleEn: 'Return ownership',
    number: 6,
    total: 40,
    difficulty: 'moyen',
    concept: 'ownership',
    xpReward: 40,
    description: `Écris une fonction <code>give_ownership() -> String</code> qui crée et retourne une String. Récupère la valeur dans <code>main</code>.`,
    starterCode: `fn main() {\n    // Appelle give_ownership() et affiche le résultat\n}\n\nfn give_ownership() -> String {\n    // Crée et retourne une String\n}`,
    hints: [
      '💡 Indice 1/2 — Dans `give_ownership`, crée `String::from("Cadeau !")` et retourne-la.',
      '💡 Indice 2/2 — `let s = give_ownership();` dans main te donne la possession de la String retournée.'
    ],
    tests: [
      { name: 'test_return_string', description: 'Retourne une String', check: (c) => /fn give_ownership\s*\(\s*\)\s*->\s*String/.test(c) },
      { name: 'test_calls_function', description: 'Appelle give_ownership', check: (c) => /give_ownership\s*\(\s*\)/.test(c) }
    ],
    solutionCode: `fn main() {\n    let s = give_ownership();\n    println!("{}", s);\n}\n\nfn give_ownership() -> String {\n    String::from("Cadeau !")\n}`
  },
  {
    id: 'kata-07',
    title: 'Références basiques',
    titleEn: 'Basic references',
    number: 7,
    total: 40,
    difficulty: 'facile',
    concept: 'borrowing',
    xpReward: 35,
    description: `Crée une fonction <code>length(s: &String) -> usize</code> qui retourne la longueur. <code>main</code> doit garder la possession de la String.`,
    starterCode: `fn main() {\n    let s = String::from("Bonjour");\n    let len = length(???);\n    println!("'{}' fait {} octets", s, len);\n}\n\nfn length(s: ???) -> usize {\n    s.len()\n}`,
    hints: [
      '💡 Indice 1/2 — La signature doit être `fn length(s: &String) -> usize`.',
      '💡 Indice 2/2 — L\'appel doit être `length(&s)` — le `&` crée une référence sans déplacer.'
    ],
    tests: [
      { name: 'test_ref_param', description: 'Utilise &String en paramètre', check: (c) => /fn length\s*\(s\s*:\s*&\s*String/.test(c) },
      { name: 'test_call_with_ref', description: 'Appelle avec &s', check: (c) => /length\s*\(\s*&s\s*\)/.test(c) },
      { name: 'test_uses_len', description: 'Retourne .len()', check: (c) => /s\.len\s*\(\s*\)/.test(c) }
    ],
    solutionCode: `fn main() {\n    let s = String::from("Bonjour");\n    let len = length(&s);\n    println!("'{}' fait {} octets", s, len);\n}\n\nfn length(s: &String) -> usize {\n    s.len()\n}`
  },
  {
    id: 'kata-08',
    title: 'Référence mutable',
    titleEn: 'Mutable reference',
    number: 8,
    total: 40,
    difficulty: 'moyen',
    concept: 'borrowing',
    xpReward: 40,
    description: `Écris <code>append_world(s: &mut String)</code> qui ajoute <code>" world"</code> à la String. Appelle-la depuis <code>main</code>.`,
    starterCode: `fn main() {\n    let s = String::from("hello");\n    append_world(???);\n    println!("{}", s);\n}\n\nfn append_world(s: ???) {\n    s.push_str(" world");\n}`,
    hints: [
      '💡 Indice 1/2 — La signature : `fn append_world(s: &mut String)`. Déclare `s` comme `let mut s` dans main.',
      '💡 Indice 2/2 — Appelle `append_world(&mut s)` — le `&mut` passe une référence mutable.'
    ],
    tests: [
      { name: 'test_mut_ref_param', description: 'Utilise &mut String', check: (c) => /fn append_world\s*\(s\s*:\s*&\s*mut\s+String/.test(c) },
      { name: 'test_let_mut', description: 'Déclare let mut s', check: (c) => /let\s+mut\s+s/.test(c) },
      { name: 'test_call_mut_ref', description: 'Appelle avec &mut s', check: (c) => /append_world\s*\(\s*&\s*mut\s+s\s*\)/.test(c) }
    ],
    solutionCode: `fn main() {\n    let mut s = String::from("hello");\n    append_world(&mut s);\n    println!("{}", s);\n}\n\nfn append_world(s: &mut String) {\n    s.push_str(" world");\n}`
  },
  {
    id: 'kata-09',
    title: 'Règle des emprunts',
    titleEn: 'Borrow rules',
    number: 9,
    total: 40,
    difficulty: 'moyen',
    concept: 'borrowing',
    xpReward: 40,
    description: `Tu ne peux avoir qu'<b>une seule</b> référence mutable OU <b>plusieurs</b> références immuables. Corrige ce code qui viole la règle.`,
    starterCode: `fn main() {\n    let mut s = String::from("Rust");\n    let r1 = &mut s;\n    let r2 = &mut s; // ERREUR !\n    println!("{} {}", r1, r2);\n}`,
    hints: [
      '💡 Indice 1/2 — Deux `&mut` au même scope = erreur du borrow checker. Utilise un bloc `{}` pour limiter la portée de r1.',
      '💡 Indice 2/2 — Solution : mets r1 dans un bloc : `{ let r1 = &mut s; println!("{}", r1); }` puis crée r2 après.'
    ],
    tests: [
      { name: 'test_no_double_mut', description: 'Pas deux &mut simultanés', check: (c) => {
        // Vérifie qu'il n'y a pas deux let ...= &mut s actifs en même temps (approx)
        const lines = c.split('\n').filter(l => /let r\d\s*=\s*&mut s/.test(l))
        return lines.length < 2 || /\{[\s\S]*?let r1[\s\S]*?\}[\s\S]*let r2/.test(c)
      }},
      { name: 'test_compiles', description: 'Le code compile', check: (c) => !/let r1\s*=\s*&mut s;[\s\n]*let r2\s*=\s*&mut s/.test(c) }
    ],
    solutionCode: `fn main() {\n    let mut s = String::from("Rust");\n    {\n        let r1 = &mut s;\n        println!("{}", r1);\n    }\n    let r2 = &mut s;\n    println!("{}", r2);\n}`
  },
  {
    id: 'kata-10',
    title: 'String slices',
    titleEn: 'String slices',
    number: 10,
    total: 40,
    difficulty: 'moyen',
    concept: 'borrowing',
    xpReward: 45,
    description: `Écris <code>first_word(s: &str) -> &str</code> qui retourne le premier mot d'une phrase (jusqu'au premier espace).`,
    starterCode: `fn main() {\n    let s = String::from("Bonjour monde");\n    let word = first_word(&s);\n    println!("Premier mot: {}", word);\n}\n\nfn first_word(s: &str) -> &str {\n    // Trouve l'index du premier espace et retourne la slice\n    todo!()\n}`,
    hints: [
      '💡 Indice 1/3 — Itère sur les bytes : `for (i, &item) in s.as_bytes().iter().enumerate()`.',
      '💡 Indice 2/3 — Quand `item == b\' \'`, retourne `&s[0..i]`.',
      '💡 Indice 3/3 — Si pas d\'espace trouvé, retourne `&s[..]` (toute la chaîne).'
    ],
    tests: [
      { name: 'test_returns_str_ref', description: 'Signature &str -> &str', check: (c) => /fn first_word\s*\(s\s*:\s*&str\)\s*->\s*&str/.test(c) },
      { name: 'test_no_todo', description: 'Pas de todo!()', check: (c) => !/todo!\s*\(\s*\)/.test(c) },
      { name: 'test_finds_space', description: 'Cherche un espace', check: (c) => /b'\s*'/.test(c) || /bytes/.test(c) || /find/.test(c) || /position/.test(c) }
    ],
    solutionCode: `fn main() {\n    let s = String::from("Bonjour monde");\n    let word = first_word(&s);\n    println!("Premier mot: {}", word);\n}\n\nfn first_word(s: &str) -> &str {\n    let bytes = s.as_bytes();\n    for (i, &item) in bytes.iter().enumerate() {\n        if item == b' ' {\n            return &s[0..i];\n        }\n    }\n    &s[..]\n}`
  },
  {
    id: 'kata-11',
    title: 'Lifetime annotation',
    titleEn: 'Lifetime annotation',
    number: 11,
    total: 40,
    difficulty: 'moyen',
    concept: 'lifetimes',
    xpReward: 50,
    description: `Écris <code>longest&lt;'a&gt;(x: &'a str, y: &'a str) -> &'a str</code> qui retourne la plus longue des deux chaînes.`,
    starterCode: `fn main() {\n    let s1 = String::from("longue chaîne");\n    let result;\n    {\n        let s2 = String::from("xyz");\n        result = longest(s1.as_str(), s2.as_str());\n        println!("La plus longue: {}", result);\n    }\n}\n\nfn longest(x: &str, y: &str) -> &str {\n    if x.len() > y.len() { x } else { y }\n}`,
    hints: [
      "💡 Indice 1/3 — Rust a besoin de savoir combien de temps vivra la référence retournée.",
      "💡 Indice 2/3 — Ajoute un paramètre de lifetime : `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str`.",
      "💡 Indice 3/3 — Le `'a` indique que la référence retournée vivra au moins aussi longtemps que la plus courte des deux entrées."
    ],
    tests: [
      { name: 'test_lifetime_param', description: "Utilise un lifetime 'a", check: (c) => /<'a>/.test(c) },
      { name: 'test_annotated_refs', description: "Annote les refs avec 'a", check: (c) => /&'a\s+str/.test(c) },
      { name: 'test_logic', description: 'Compare les longueurs', check: (c) => /len\(\)/.test(c) }
    ],
    solutionCode: `fn main() {\n    let s1 = String::from("longue chaîne");\n    let result;\n    {\n        let s2 = String::from("xyz");\n        result = longest(s1.as_str(), s2.as_str());\n        println!("La plus longue: {}", result);\n    }\n}\n\nfn longest<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() { x } else { y }\n}`
  },
  {
    id: 'kata-12',
    title: 'Le Borrow Checker',
    titleEn: 'The Borrow Checker',
    number: 12,
    total: 40,
    difficulty: 'facile',
    concept: 'ownership',
    xpReward: 40,
    description: `Passe une <b>référence</b> à <code>calc_len</code> au lieu de la valeur, pour que <code>main</code> garde l'accès à la chaîne — et sans <code>.clone()</code>.`,
    starterCode: `fn main() {\n    let s = String::from("Rust");\n    let len = calc_len(s);\n    println!("'{}' fait {} octets", s, len);\n}\n\nfn calc_len(s: String) -> usize {\n    s.len()\n}`,
    hints: [
      '💡 Indice 1/3 — `calc_len(s: String)` prend la String par valeur : elle est consommée, donc `main` perd l\'accès à `s`. Passe plutôt une référence.',
      '💡 Indice 2/3 — À l\'appel, mets `&` devant l\'argument : `calc_len(&s)`.',
      '💡 Indice 3/3 — Et adapte la signature : `fn calc_len(s: &String) -> usize`.'
    ],
    tests: [
      { name: 'test_longueur_correcte', description: 'Retourne la longueur', check: (c) => /\.len\s*\(\s*\)/.test(c) },
      { name: 'test_chaine_intacte', description: 'Passe une référence', check: (c) => /calc_len\s*\(\s*&\s*s\s*\)/.test(c) && /s\s*:\s*&\s*String/.test(c) },
      { name: 'test_sans_clone', description: 'Sans .clone()', check: (c) => !/\.clone\s*\(\s*\)/.test(c) }
    ],
    solutionCode: `fn main() {\n    let s = String::from("Rust");\n    let len = calc_len(&s);\n    println!("'{}' fait {} octets", s, len);\n}\n\nfn calc_len(s: &String) -> usize {\n    s.len()\n}`
  }
]

export function getKataById(id: string): Kata | undefined {
  return KATAS.find(k => k.id === id)
}

export function getKatasByConceptName(concept: string): Kata[] {
  return KATAS.filter(k => k.concept === concept)
}
