# Christmas Delivery

Kata for the ADVANCED package of the Rust coding DOJO

## Level / Duration

Expert / 90 minutes

## Context
This kata is based on [Christmas Delivery from Coding Dojo](https://codingdojo.org/kata/christmas-delivery/).

Santa needs multiple Elves to load presents onto his Sleigh concurrently. Only one Elf can place a present at a time (mutual exclusion). Design a concurrent system where multiple Elf threads work in parallel to load the sleigh, demonstrating safe shared-state concurrency in Rust.

The challenge highlights Rust's ownership model and the `Send + Sync` guarantees that prevent data races at compile time.

## Objective
Implement `Sleigh` (shared mutable state protected by `Mutex`) loaded concurrently by multiple `Elf` threads via `Arc<Mutex<Sleigh>>`. The `run_delivery` function spawns one thread per elf and returns the total number of presents loaded.

## Domaines

- **Multithreading sécurisé (Arc, Mutex, RwLock, Channels)** : Arc<Mutex<T>> pour l'état partagé entre threads, spawn et join de threads
- **Programmation Asynchrone** : compréhension du modèle de concurrence de Rust, garanties Send/Sync, alternative async/await avec Tokio
- **Software Craftsmanship et Architecture** : pattern producteur/consommateur, gestion de la concurrence sans data race, design thread-safe

## How to run a kata
All katas share the same structure:
```
/03-advanced/05-christmas-delivery
|- src
|   main.rs
|- solutions
|   main.rs
Cargo.lock
Cargo.toml
```

## Prerequisites
The SETUP, STARTER and STRUCTURE packages must have been completed

Access to the Rust documentation at https://doc.rust-lang.org/std/index.html
Access to the Rust book at https://doc.rust-lang.org/book/
