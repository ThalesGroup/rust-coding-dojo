# Anagram

Kata for the STRUCTURE package of the Rust coding DOJO

## Level / Duration

Intermediate / 45 minutes

## Context
This kata is based on [Anagram from Coding Dojo](https://codingdojo.org/kata/Anagram/).

Given a word and a list of candidate words, return all candidates that are anagrams of the word. An anagram uses exactly the same letters in a different order. The comparison is case-insensitive, and a word is **not** considered an anagram of itself (even with different casing).

## Objective
Implement `anagrams_of(word: &str, candidates: &[&str]) -> Vec<String>` using idiomatic Rust: string manipulation, character sorting, iterators and closures.

## Domains

`Strings` `Iterators` `Sorting` `Closures`

## How to run a kata
All katas share the same structure:
```
/02-structure/14-anagram
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
