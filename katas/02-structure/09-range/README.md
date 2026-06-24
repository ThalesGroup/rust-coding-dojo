# Range

Kata for the STRUCTURE package of the Rust coding DOJO

## Level / Duration

Intermediate / 60 minutes

## Context
This kata is based on [Range from Coding Dojo](https://codingdojo.org/kata/Range/).

Implement integer ranges with open (exclusive) and closed (inclusive) bounds. Interval notation:
- `[a, b]` — closed on both ends (a and b are included)
- `(a, b)` — open on both ends (a and b are excluded)
- `[a, b)` — closed start, open end (a included, b excluded)

Support the following operations: `contains_point`, `get_all_points`, `endpoints`, `contains_range`, and `overlaps_range`.

## Objective
Implement a `Range` struct using `Bound::Open(i32)` and `Bound::Closed(i32)` enum variants, with all five range operations.

## Domains

`Enums` `Traits` `Iterators` `Pattern Matching`

## How to run a kata
All katas share the same structure:
```
/02-structure/09-range
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
