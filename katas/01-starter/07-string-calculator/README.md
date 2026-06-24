# String Calculator

Kata for the STARTER package of the Rust coding DOJO

## Level / Duration

Intermediate / 60 minutes

This kata as a part of the STARTER package targets Rust beginners and intermediate learners.

## Context
This kata is based on [String Calculator from Coding Dojo](https://codingdojo.org/kata/StringCalculator/).

Create a calculator that receives a String as input and returns the sum of numbers.

Steps:
1. Handle 0, 1 or 2 numbers separated by comma
2. Handle an unknown number of numbers
3. Handle newlines as separators
4. Handle custom delimiters: `//[delimiter]\n[numbers]`
5. Reject negative numbers with an error message

## Objective
Implement the `add` function that takes a string and returns a Result containing the sum or an error message.

## How to run a kata
All katas share the same structure:
```
/XX-package/XX-kataname
|- src
|   main.rs
|- solutions
|   main.rs
Cargo.lock
Cargo.toml
```

## Prerequisites
The SETUP package must have been completed

Access to the Rust documentation at https://doc.rust-lang.org/std/index.html
Access to the Rust book at https://doc.rust-lang.org/book/
