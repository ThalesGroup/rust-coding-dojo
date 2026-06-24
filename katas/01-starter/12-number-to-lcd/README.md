# NumberToLCD

Kata for the STARTER package of the Rust coding DOJO

## Level / Duration

Beginner / 45 minutes

This kata as a part of the STARTER package targets Rust beginners.

## Context
This kata is based on [NumberToLCD from Coding Dojo](https://codingdojo.org/kata/NumberToLCD/).

Display numbers in LCD style using 3 lines of text. Each digit is 3 characters wide:

```
   _  _     _  _  _  _  _
 | _| _||_||_ |_   ||_||_|
 ||_  _|  | _||_|  ||_| _|
```

The digits 0–9 are represented as follows (3 chars wide, top / middle / bottom row):

| Digit | Top   | Mid   | Bot   |
|-------|-------|-------|-------|
| 0     | ` _ ` | `\| \|` | `\|_\|` |
| 1     | `   ` | `  \|` | `  \|` |
| 2     | ` _ ` | ` _\|` | `\|_ ` |
| 3     | ` _ ` | ` _\|` | ` _\|` |
| 4     | `   ` | `\|_\|` | `  \|` |
| 5     | ` _ ` | `\|_ ` | ` _\|` |
| 6     | ` _ ` | `\|_ ` | `\|_\|` |
| 7     | ` _ ` | `  \|` | `  \|` |
| 8     | ` _ ` | `\|_\|` | `\|_\|` |
| 9     | ` _ ` | `\|_\|` | ` _\|` |

## Objective
Implement `to_lcd(number: &str) -> String` returning the 3-line LCD representation of the input number string, with lines separated by `\n`.

## Domains

`Basics` `Arrays` `String Manipulation` `Formatting`

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

Run the exercise:
```bash
cargo run
cargo test
```

Run the solution:
```bash
cargo run --bin solutions
```

## Prerequisites
The SETUP package must have been completed

Access to the Rust documentation at https://doc.rust-lang.org/std/index.html
Access to the Rust book at https://doc.rust-lang.org/book/
