# Gilded Rose

Kata for the STRUCTURE package of the Rust coding DOJO

## Level / Duration

Intermediate / 90 minutes

## Context
This kata is based on [Gilded Rose from Coding Dojo](https://codingdojo.org/kata/gilded-rose/).

An inn manages items with a `sell_in` (days until expiry) and `quality` value. Each day `update_quality` is called. The rules are:

- Normal items: quality degrades by 1 each day, by 2 once `sell_in` has passed
- "Aged Brie": quality improves with age (by 1, then 2 past sell date)
- "Sulfuras, Hand of Ragnaros": legendary item — never changes
- "Backstage passes to a TAFKAL80ETC concert": quality rises (+1 normally, +2 within 10 days, +3 within 5 days, drops to 0 after the concert)
- Quality is never negative and never exceeds 50 (Sulfuras is always 80)
- **NEW**: "Conjured" items degrade in quality twice as fast as normal items

## Objective
Refactor the legacy `update_quality` function to be clean and readable, then extend it to support "Conjured" items.

## Domains

`Refactoring` `Pattern Matching` `TDD` `Legacy Code`

## How to run a kata
All katas share the same structure:
```
/02-structure/08-gilded-rose
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
