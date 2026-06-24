# Yahtzee

Kata for the STRUCTURE package of the Rust coding DOJO

## Level / Duration

Intermediate / 60 minutes

## Context
This kata is based on [Yahtzee from Coding Dojo](https://codingdojo.org/kata/Yahtzee/).

Score a Yahtzee hand. Given 5 dice values, compute the score for a chosen category: ones through sixes (sum of matching dice), pair (highest pair), two pairs, three/four of a kind, small straight (1-5=15), large straight (2-6=20), full house (sum of all), chance (sum of all), or Yahtzee (50 points for five of a kind).

## Objective
Implement `score(dice: &[u32; 5], category: Category) -> u32` for all scoring categories.

## Domains

`Enums` `Pattern Matching` `Arrays` `Counting`

## How to run a kata
All katas share the same structure:
```
/02-structure/06-yahtzee
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
