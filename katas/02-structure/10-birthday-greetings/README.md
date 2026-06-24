# Birthday Greetings

Kata for the STRUCTURE package of the Rust coding DOJO

## Level / Duration

Intermediate / 60 minutes

## Context
This kata is based on [Birthday Greetings from Coding Dojo](https://codingdojo.org/kata/birthday-greetings/).

Given a list of friends (name, birthdate, email), send birthday greeting emails to those whose birthday matches today's date. The kata demonstrates **Hexagonal Architecture** (Ports & Adapters): the core business logic is completely isolated from I/O concerns (reading files, sending emails) through trait-based ports.

## Objective
Implement `BirthdayService` using traits for `FriendRepository` (input port) and `EmailSender` (output port), with in-memory test doubles to verify behavior without real I/O.

## Domains

`Traits` `Generics` `Hexagonal Architecture` `TDD`

## How to run a kata
All katas share the same structure:
```
/02-structure/10-birthday-greetings
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
