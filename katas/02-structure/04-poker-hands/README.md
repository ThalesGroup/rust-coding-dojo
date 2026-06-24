# Poker Hands

Kata for the STRUCTURE package of the Rust coding DOJO

## Level / Duration

Intermediate / 90 minutes

## Context
This kata is based on [Poker Hands from Coding Dojo](https://codingdojo.org/kata/PokerHands/).

Compare two poker hands and determine the winner. Poker hands are ranked (lowest to highest):
- High Card, Pair, Two Pairs, Three of a Kind, Straight, Flush, Full House, Four of a Kind, Straight Flush

## Objective
Implement a poker hand comparator that determines which hand wins.

### Tasks
1. Card and Suit types (10 min): [card.rs](src/card.rs)
2. Hand parsing and ranking (30 min): [hand.rs](src/hand.rs)
3. Hand comparison (20 min): [compare.rs](src/compare.rs)
4. Integration and testing (15 min): [main.rs](src/main.rs)

Resolved exercises: [solutions](solutions/)

## Domains

`Enums` `Structs` `Sorting` `Pattern Matching` `HashMap`

## How to run a kata
All katas share the same structure:
```
/XX-package/XX-kataname
|- src
|   main.rs
|   card.rs
|   hand.rs
|   compare.rs
|- solutions
|   main.rs
|   card.rs
|   hand.rs
|   compare.rs
Cargo.lock
Cargo.toml
```

## Prerequisites
The SETUP and STARTER packages must have been completed

Access to the Rust documentation at https://doc.rust-lang.org/std/index.html
Access to the Rust book at https://doc.rust-lang.org/book/
