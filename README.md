# Welcome in Rust coding dojo repository !

This place is intended to provide resources, documentation and templates to organize coding dojo sessions about Rust language.
Feel free to open an issue if you wish to add a new one, update an existing one or if you have any question.

## Rust Katas

A code **kata** is a software development exercise in which the focus is not on solving a task or problem, but on **learning new skills and developing successful routines**. For each code kata, **several solutions** have to be found in order to **learn from mistakes, gain experience** and develop even better solutions.

You can find many katas here: https://codingdojo.org/kata/

In [katas](./katas) directory, you will find here all the available katas about Rust language organized in categories:
- **setup**: for beginners, to learn about Rust installation, dependencies management with Cargo, compiler
- **starter**: for beginners and intermediate, to learn about variables, control flow, loops and functions
- **structure**: for intermediates, to learn about String manipulation, data structures and enums
- **advanced**: for experts, to learn about advanced topics such as concurrency generics, lifetime, macros

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

## Contributing

If you are interested in contributing to this repository please send an email to oss@thalesgroup.com, find more details about how to contribute [here](https://github.com/ThalesGroup/rust-coding-dojo/blob/main/CONTRIBUTING.md)

## License

License under [Apache V2 license](https://github.com/ThalesGroup/rust-coding-dojo/blob/main/LICENSE) 
