# Mathematical AST

Kata for the ADVANCED package of the Rust coding DOJO

## Level / Duration

Expert / 90 minutes

## Context
This kata is based on [Mathematical AST from Coding Dojo](https://codingdojo.org/kata/mathematical-ast/).

Parse a Reverse Polish Notation (RPN) expression into an Abstract Syntax Tree (AST), then implement functions to evaluate and pretty-print the tree.

Examples:
- `"3 6 +"` → `Add(3, 6)` → evaluates to `9`, prints as `(3 + 6)`
- `"3 6 -6 * +"` → `Add(3, Mul(6, -6))` → evaluates to `-33`, prints as `(3 + (6 * -6))`

## Objective
Implement the `Expr` enum representing AST nodes, `parse_rpn(expr: &str) -> Result<Expr, String>` to build the tree from RPN input, `evaluate(expr: &Expr) -> f64` to compute the result, and `pretty_print(expr: &Expr) -> String` for infix display.

## Domaines

- **Traits, Généricité et Dispatch (statique/dynamique)** : enums récursifs avec Box pour éviter les types de taille infinie, pattern matching exhaustif
- **Modélisation de types (Enums, Pattern Matching, Option/Result)** : AST en enum récursif avec Box<Expr>, Result pour les erreurs de parsing
- **Software Craftsmanship et Architecture** : séparation parsing/évaluation/affichage, principe de responsabilité unique

## How to run a kata
All katas share the same structure:
```
/03-advanced/04-mathematical-ast
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
