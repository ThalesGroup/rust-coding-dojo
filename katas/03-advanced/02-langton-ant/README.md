# Langton Ant

Kata for the ADVANCED package of the Rust coding DOJO

## Level / Duration

Expert / 90 minutes

## Context
This kata is based on [Langton's Ant from Coding Dojo](https://codingdojo.org/kata/LangtonAnt/).

Langton's Ant is a two-dimensional cellular automaton. An ant moves on an infinite grid of white and black squares following two simple rules:
- On a white square: turn right 90°, flip the square to black, move one step forward
- On a black square: turn left 90°, flip the square to white, move one step forward

Despite the simplicity of the rules, after roughly 10,000 steps the ant starts building a "highway" — a regular, repeating pattern that extends indefinitely.

## Objective
Implement `Direction`, `Ant`, and `Grid` structs with a `step()` function and a `simulate(n)` function that runs the simulation for n steps.

## Domains

`Enums` `HashSet` `Simulation` `Cellular Automaton`

## How to run a kata
All katas share the same structure:
```
/03-advanced/02-langton-ant
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
