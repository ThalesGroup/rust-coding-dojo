# Berlin Clock

Kata for the STRUCTURE package of the Rust coding DOJO

## Level / Duration

Intermediate / 60 minutes

## Context
This kata is based on [Berlin Clock from Coding Dojo](https://codingdojo.org/kata/BerlinClock/).

The Berlin Clock (Mengenlehreuhr) displays time using rows of illuminated lamps. Given a time string "HH:MM:SS", produce a 5-row string representation:
- Row 1 (1 lamp): seconds blink — "Y" if even, "O" if odd
- Row 2 (4 lamps): each lamp = 5 hours (R if lit, O if not)
- Row 3 (4 lamps): each lamp = 1 hour (R if lit, O if not)
- Row 4 (11 lamps): each lamp = 5 minutes (Y if lit, R at positions 3/6/9, O if not)
- Row 5 (4 lamps): each lamp = 1 minute (Y if lit, O if not)

## Objective
Implement `berlin_clock(time: &str) -> String` that converts a time to its Berlin Clock representation.

## Domains

`Enums` `Arithmetic` `Iterators` `Formatting`

## How to run a kata
All katas share the same structure:
```
/02-structure/07-berlin-clock
|- src
|   main.rs
|- solutions
|   main.rs
Cargo.lock
Cargo.toml
```

## Prerequisites
The SETUP and STARTER packages must have been completed

Access to the Rust documentation at https://doc.rust-lang.org/std/index.html
Access to the Rust book at https://doc.rust-lang.org/book/
