Each kata must be stored in its own directory and must contain a **README.md** or **0X-kata-topic.md** with the following template:

## Kata description

### Level / duration

[Beginner|Intermediate|Expert] / [XX] minutes

### Context

Describe the context of the kata

### Objective

Describe the objective of the kata

### Tasks

Details all the tasks of the kata, in addition you can provide a directory with the implementation solution.

### How to run a kata
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