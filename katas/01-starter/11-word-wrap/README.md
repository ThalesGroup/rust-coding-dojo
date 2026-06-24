# WordWrap

Kata for the STARTER package of the Rust coding DOJO

## Level / Duration

Beginner / 30 minutes

This kata as a part of the STARTER package targets Rust beginners.

## Context
This kata is based on [WordWrap from Coding Dojo](https://codingdojo.org/kata/WordWrap/).

Implement a `wrap(text: &str, column: usize) -> String` function that wraps a string at word boundaries so that no line exceeds `column` characters.

Rules:
- Insert newlines so no line exceeds `column` characters
- Break at word boundaries (spaces) whenever possible
- If a single word is longer than `column`, break it mid-word

## Objective
Implement `wrap(text: &str, column: usize) -> String` that correctly wraps text at the given column width.

## Domaines

- **Fondamentaux et Mécanique du Langage** : manipulation de strings, itérateurs, slices, boucles

## How to run a kata
All katas share the same structure:
```
/XX-package/XX-kataname
|- src
|   main.rs
|- solutions
|   main.rs
Cargo.lock
Cargo.toml
```

Run the exercise:
```bash
cargo run
cargo test
```

Run the solution:
```bash
cargo run --bin solutions
```

## Prerequisites
The SETUP package must have been completed

Access to the Rust documentation at https://doc.rust-lang.org/std/index.html
Access to the Rust book at https://doc.rust-lang.org/book/
