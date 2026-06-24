# Brainfuck

Kata for the ADVANCED package of the Rust coding DOJO

## Level / Duration

Expert / 90 minutes

## Context
This kata is based on [Brainfuck from Coding Dojo](https://codingdojo.org/kata/Brainfuck/).

Implement a complete Brainfuck interpreter. Brainfuck is an esoteric programming language with only 8 commands operating on a tape of byte cells:

| Command | Effect |
|---------|--------|
| `>` | Move data pointer right |
| `<` | Move data pointer left |
| `+` | Increment current cell (wraps 255→0) |
| `-` | Decrement current cell (wraps 0→255) |
| `.` | Output current cell as ASCII |
| `,` | Read one byte of input into current cell |
| `[` | Jump past matching `]` if current cell is 0 |
| `]` | Jump back to matching `[` if current cell is non-zero |

## Objective
Implement `Interpreter::run(program: &str, input: &str) -> Result<String, String>` that executes a Brainfuck program and returns its output, or an error on invalid programs.

## Domaines

- **Ingénierie Système et Intégration** : implémentation d'une machine virtuelle minimale avec tape, pointeur de données et pointeur d'instruction
- **Modélisation de types (Enums, Pattern Matching, Option/Result)** : Result pour la gestion d'erreurs, matching sur les commandes
- **Fondamentaux et Mécanique du Langage** : manipulation de vecteurs, itérateurs, HashMap pour le bracket matching

## How to run a kata
All katas share the same structure:
```
/03-advanced/03-brainfuck
|- src
|   main.rs
|- solutions
|   main.rs
Cargo.lock
Cargo.toml
```

## Prerequisites
The SETUP, STARTER and STRUCTURE packages must have been completed

Access to the Rust documentation at https://doc.rust-lang.org/std/index.html
Access to the Rust book at https://doc.rust-lang.org/book/
