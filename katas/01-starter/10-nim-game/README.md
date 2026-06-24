# NimGame

Kata for the STARTER package of the Rust coding DOJO

## Level / Duration

Beginner / 30 minutes

This kata as a part of the STARTER package targets Rust beginners.

## Context
This kata is based on [Nim from Coding Dojo](https://codingdojo.org/kata/Nim/).

Jeu de Nim à deux joueurs. Start with a pile of sticks. Each turn, a player removes 1, 2, or 3 sticks. The player who takes the **last** stick **loses**.

Given an initial number of sticks, determine which player wins with optimal play.

## Objective
Implement `nim_winner(sticks: u32) -> &'static str` that returns `"Player 1"` or `"Player 2"` (the winner with optimal play).

**Hint:** Think about multiples of 4 — positions that are losing for the current player follow a pattern.

## Domains

`Basics` `Pattern Matching` `Algorithms` `Game Theory`

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
