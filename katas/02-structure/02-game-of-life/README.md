# Game of Life

Kata for the STRUCTURE package of the Rust coding DOJO

## Level / Duration

Intermediate / 60 minutes

## Context
This kata is based on [Game of Life from Coding Dojo](https://codingdojo.org/kata/GameOfLife/).

Conway's Game of Life is a cellular automaton. Given a grid of cells (alive or dead), compute the next generation using these rules:
1. Any live cell with fewer than 2 live neighbours dies (underpopulation)
2. Any live cell with more than 3 live neighbours dies (overcrowding)
3. Any live cell with 2 or 3 live neighbours lives on
4. Any dead cell with exactly 3 live neighbours becomes alive

## Objective
Implement the Game of Life grid and the `next_generation` function.

### Tasks
1. Grid representation (10 min): [grid.rs](src/grid.rs)
2. Neighbour counting (15 min): [grid.rs](src/grid.rs)
3. Next generation logic (15 min): [life.rs](src/life.rs)
4. Display and testing (10 min): [main.rs](src/main.rs)

Resolved exercises: [solutions](solutions/)

## Domains

`Structs` `Iterators` `2D Grid` `Algorithms` `Simulation`

## How to run a kata
All katas share the same structure:
```
/XX-package/XX-kataname
|- src
|   main.rs
|   grid.rs
|   life.rs
|- solutions
|   main.rs
|   grid.rs
|   life.rs
Cargo.lock
Cargo.toml
```

## Prerequisites
The SETUP and STARTER packages must have been completed

Access to the Rust documentation at https://doc.rust-lang.org/std/index.html
Access to the Rust book at https://doc.rust-lang.org/book/
