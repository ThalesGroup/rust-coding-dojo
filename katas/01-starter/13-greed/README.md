# Greed

Kata for the STARTER package of the Rust coding DOJO

## Level / Duration

Beginner / 30 minutes

This kata as a part of the STARTER package targets Rust beginners.

## Context
This kata is based on [Greed from Coding Dojo](https://codingdojo.org/kata/Greed/).

Greed is a dice game. Given up to 6 dice values (1–6), compute the score according to these rules:

| Roll              | Score                          |
|-------------------|-------------------------------|
| Single 1          | 100                            |
| Single 5          | 50                             |
| Triple 1s         | 1000                           |
| Triple 2s         | 200                            |
| Triple 3s         | 300                            |
| Triple 4s         | 400                            |
| Triple 5s         | 500                            |
| Triple 6s         | 600                            |
| Four of a kind    | triple score × 2               |
| Five of a kind    | triple score × 4               |
| Six of a kind     | triple score × 8               |

All other dice score 0.

## Objective
Implement `score(dice: &[u32]) -> u32` that computes the total score for a given set of dice.

## Domains

`Basics` `Arrays` `Counting` `Iterators`

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
