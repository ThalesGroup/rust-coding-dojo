# Tennis

Kata for the STARTER package of the Rust coding DOJO

## Level / Duration

Intermediate / 45 minutes

This kata as a part of the STARTER package targets Rust intermediate learners.

## Context
This kata is based on [Tennis from Coding Dojo](https://codingdojo.org/kata/Tennis/).

Implement a simple tennis scoring system:
- Points: "love" (0), "15" (1), "30" (2), "40" (3)
- If both have 40: "deuce"
- If deuce, winner gets "advantage"
- Player with advantage who wins wins the game
- Player without advantage who wins brings it back to deuce
- Game won when a player has 4+ points and leads by 2

## Objective
Implement a Tennis struct with `point_won` and `score` methods.

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

## Prerequisites
The SETUP package must have been completed

Access to the Rust documentation at https://doc.rust-lang.org/std/index.html
Access to the Rust book at https://doc.rust-lang.org/book/
