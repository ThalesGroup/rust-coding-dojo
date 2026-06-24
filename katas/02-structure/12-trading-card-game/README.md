# Trading Card Game

Kata for the STRUCTURE package of the Rust coding DOJO

## Level / Duration

Intermediate / 90 minutes

## Context
This kata is based on [Trading Card Game from Coding Dojo](https://codingdojo.org/kata/TradingCardGame/).

A two-player trading card game loosely based on Hearthstone. Each player starts with 30 Health and 0 Mana slots. The deck contains 20 cards with costs `[0,0,1,1,2,2,2,3,3,3,3,4,4,4,5,5,6,6,7,8]`. Each turn, the active player gains +1 Mana slot (max 10), refills Mana, draws a card, then may play cards. Special rules: **Bleeding Out** (empty deck → 1 damage instead of draw), **Overload** (hand > 5 cards → drawn card discarded). The first player to reduce their opponent's Health to 0 or below wins.

## Objective
Implement `Player` and `Game` structs with turn-based gameplay: `start_turn`, `draw`, `can_play`, `play_card`, and `check_winner`.

## Domains

`Enums` `TDD` `State Machine` `Structs`

## How to run a kata
All katas share the same structure:
```
/02-structure/12-trading-card-game
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
