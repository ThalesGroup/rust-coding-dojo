# FooBarQix

Kata for the STARTER package of the Rust coding DOJO

## Level / Duration

Beginner / 30 minutes

This kata as a part of the STARTER package targets Rust beginners.

## Context
This kata is based on [FooBarQix from Coding Dojo](https://codingdojo.org/kata/FooBarQix/).

Implement a function `compute(n: u32) -> String` that applies the following rules:
- If `n` is divisible by 3, append `"Foo"`
- If `n` is divisible by 5, append `"Bar"`
- If `n` is divisible by 7, append `"Qix"`
- For each digit `3` found in `n`, append `"Foo"`
- For each digit `5` found in `n`, append `"Bar"`
- For each digit `7` found in `n`, append `"Qix"`
- If none of the above apply, return `n` as a string

Examples: `3` → `"FooFoo"`, `5` → `"BarBar"`, `15` → `"FooBarBar"`, `7` → `"QixQix"`, `33` → `"FooFooFoo"`

## Objective
Implement `compute(n: u32) -> String` combining divisibility rules and digit scanning.

## Domains

`Basics` `Iterators` `Arithmetic` `Pattern Matching`

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
