# Sudoku

Kata for the ADVANCED package of the Rust coding DOJO

## Level / Duration

Expert / 120 minutes

## Context
This kata is based on [Sudoku from Coding Dojo](https://codingdojo.org/kata/sudoku/).

Build a Sudoku solver using constraint propagation and backtracking. Each cell knows which values 1-9 are possible. When only one value remains possible, the cell's value is known. When a cell's value becomes known, that value is eliminated from all peer cells (same row, column, and 3x3 box). If constraint propagation alone cannot solve the puzzle, backtracking explores possible assignments.

## Objective
Implement `CellState`, `Board` with constraint propagation, and a `solve()` method combining propagation with backtracking.

## Domaines

- **Multithreading sécurisé (Arc, Mutex, RwLock, Channels)** : cellules communicant via channels ou Arc<Mutex> pour la propagation concurrente
- **Modélisation de types (Enums, Pattern Matching, Option/Result)** : état de la cellule (Unknown, Known, Contradiction) modélisé en enum
- **Software Craftsmanship et Architecture** : propagation de contraintes, séparation des responsabilités, résolution de puzzles par backtracking

## How to run a kata
All katas share the same structure:
```
/03-advanced/01-sudoku
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
