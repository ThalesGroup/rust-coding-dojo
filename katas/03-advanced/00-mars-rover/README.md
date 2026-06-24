# Mars Rover

Kata for the ADVANCED package of the Rust coding DOJO

## Level / Duration

Expert / 90 minutes

## Context
This kata is based on [Mars Rover from Coding Dojo](https://codingdojo.org/kata/mars-rover/).

Develop a simulator that takes commands and a map, executes the commands, and shows the resulting position and direction of the Rover.

Input:
- Rover starting point (x, y) and direction (N, S, E, W)
- A map describing obstacle locations
- A list of commands: 'f' (forward), 'r' (right), 'l' (left)

When the rover encounters an obstacle, it does nothing and reports it.

## Objective
Implement the Mars Rover simulator with obstacle detection.

### Tasks
1. Direction and Position types (15 min): [rover.rs](src/rover.rs)
2. Map with obstacles (20 min): [map.rs](src/map.rs)
3. Command execution (20 min): [rover.rs](src/rover.rs)
4. Integration and edge cases (15 min): [main.rs](src/main.rs)

Resolved exercises: [solutions](solutions/)

## How to run a kata
All katas share the same structure:
```
/XX-package/XX-kataname
|- src
|   main.rs
|   rover.rs
|   map.rs
|- solutions
|   main.rs
|   rover.rs
|   map.rs
Cargo.lock
Cargo.toml
```

## Prerequisites
The SETUP, STARTER and STRUCTURE packages must have been completed

Access to the Rust documentation at https://doc.rust-lang.org/std/index.html
Access to the Rust book at https://doc.rust-lang.org/book/
