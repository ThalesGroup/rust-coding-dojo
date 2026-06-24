# Bank OCR

Kata for the STRUCTURE package of the Rust coding DOJO

## Level / Duration

Intermediate / 60 minutes

## Context
This kata is based on [Bank OCR from Coding Dojo](https://codingdojo.org/kata/BankOCR/).

Parse scanned bank account numbers. Each digit is represented as a 3×3 pattern of pipes (`|`) and underscores (`_`). Input is 4 lines (3 content lines + 1 blank), 27 characters wide, encoding a 9-digit account number. After parsing, validate with a checksum: `(d9 + 2×d8 + 3×d7 + … + 9×d1) mod 11 == 0`.

## Objective
Implement `parse_digits(input: &str) -> Result<u64, String>` that parses the OCR input into a number and returns `Err` if any digit is unrecognised or the checksum is invalid.

## Domains

`Strings` `Parsing` `Error Handling` `Slices`

## How to run a kata
All katas share the same structure:
```
/02-structure/15-bank-ocr
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
