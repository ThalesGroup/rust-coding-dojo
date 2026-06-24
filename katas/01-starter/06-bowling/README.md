# Bowling

Kata for the STARTER package of the Rust coding DOJO

## Level / Duration

Beginner / 45-60 minutes

This kata as a part of the STARTER package targets Rust beginners.

## Context
This kata is based on [Bowling from Coding Dojo](https://codingdojo.org/kata/Bowling/).

Create a program which, given a valid sequence of rolls for one line of American Ten-Pin Bowling, produces the total score for the game.

Scoring rules:
- Each game includes ten frames
- In each frame, the bowler gets up to two tries to knock down all pins
- Open frame: total pins knocked down in two tries
- Spare (/): 10 + pins knocked down on next throw
- Strike (X): 10 + pins knocked down on next two throws
- Tenth frame: if spare or strike, bonus throws are added

## Objective
Implement the `score` function that takes a sequence of rolls and returns the total score.

## Domains

`Basics` `Iterators` `Algorithms` `Arrays`

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
