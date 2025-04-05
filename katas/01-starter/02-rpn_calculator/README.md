# Text Based RPN calculator

Kata for the STARTER package of the Rust coding DOJO

## Level / Duration
Beginner / 45-60 minutes

This kata as a part of the STARTER package targets Rust beginners.
This kata targets 45 minutes sessions

## Context
RPN : https://en.wikipedia.org/wiki/Reverse_Polish_notation

In this kata, participants will work on the following :
 - Creating and Using Variables
 - Control Flow Concepts
 - Loops
 - Functions

## Objective
Build a text based Reverse Polish Notation (RPN) calculator.

## Instructions
In this kata you will develop a simple CLI (Command Line interface) Reverse Polish Notation Calculator.
RPN functions with a last-in first out stack (LIFO) of 64 bits floating point elements.
Supported operation are:
 - add
 - substract
 - multiply
 - divide

Users can input numbers to be added to the stack.
Users can input operators (+, -, *, /). An operator input will apply the corresponding operation to the two last operand in the stack.
User can exit the application by inputting "q".
User can reset the application by inputting "r".
Any other input will print an error message.

>[!IMPORTANT]
>This kata contains 10 exercices labelled "TODO 1" to "TODO 10".
>All exercices are in the main.rs file of the "src" folder.
>After all exercices, it should complie without any warning.
>Solution is provided in the "solutions" folder.

## How to run a kata
All katas share the same structure:
```
/XX-package/XX-kataname
|- src
   |- bin
      |- exercise_1.rs
      |- exercise_2.rs
   main.rs
   ...
|- solutions
   |- exercise_1.rs
   |- exercise_2.rs
   ...
Cargo.lock
Cargo.toml
```
The kata may consist in a single program with gaps, then we put the program source in the `src` folder at kata's root, and the main function in `src/main.rs`. Then, it can just be run by calling the command `cargo run`.

If the kata consists in several small exercise programs, we put all the exercises in a `src/bin` folder at kata's root.
We can just run the exercise by calling `cargo run --bin <exercise_n>` to run the targeted exercise, without needing the others to compile, or to comment anything.

## Prerequisites
The SETUP package must have been completed

Access to the Rust documentation at https://doc.rust-lang.org/std/index.html

Acces to the Rust book at https://doc.rust-lang.org/book/
