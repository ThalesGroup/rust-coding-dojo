# Social Network

Kata for the STRUCTURE package of the Rust coding DOJO

## Level / Duration

Intermediate / 90 minutes

## Context
This kata is based on [Social Network from Coding Dojo](https://codingdojo.org/kata/social-network/).

Build a simple social network with four commands: **Posting** (a user publishes a message), **Reading** (view a user's own timeline, newest first), **Following** (subscribe to another user's messages), and **Wall** (aggregated feed of a user and all users they follow, newest first).

## Objective
Implement `SocialNetwork` with `post`, `read`, `follow`, and `wall` methods. The design should keep business logic decoupled from I/O concerns, making it fully testable without any external dependencies.

## Domains

`HashMap` `Architecture` `CQRS` `TDD`

## How to run a kata
All katas share the same structure:
```
/02-structure/13-social-network
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
