## Basics

### Level / duration

[Intermediate] / 90 minutes

### Context

#### Data structures and traits basics

This module introduces data structures and the basics of traits in Rust.

In computer science and programming, a *Data Structure* is both a way of laying out the memory used by the program (physical) and to provide a relevant level of abstraction for using data of any kind (logical).

#### Colors as an example

For instance, a color could be strucutured as three numbers, each for the strength of one primary color (traditionally red-yellow-blue, more commonly in computing red-green-blue).

But it could also be structured as a base primary color (from a limited set), then three optional numbers to represent biases towards this base (hue shifting, luminosity, saturation).

Although the second data structure would be suboptimal in general, it could outperform where colors tend to stay within a knwon standard. As such, even for a trivial program, data structures must be carefully crafted.

Rust uses the keyword `struct` to introducte new data structures. For instance, such is the Color Data Structure from the first example (for [bikeshedding](https://en.wikipedia.org/wiki/Law_of_triviality) reasons, we will use RYB) :

```rust
struct ColorRyb {
  red: u8,
  yellow: u8,
  blue: u8,
}
```

From there on, a new `Color` may be instanciated as such:
```rust
let red = ColorRyb {
  red: 255,
  yellow: 0,
  blue: 0,
}
```

The second way of introducing colors is more abstract. For starters, "base primary colors" need to be introduced somehow. For this, we will use Rust’s enumerations:
```rust
enum BaseColor {
  Red,
  Yellow,
  Blue,
}
```

Any value of type `BaseColor` may be one of these three.

Then we could define:
```rust
struct ColorBias {
  base: BaseColor,
  hue_shift: Option<u8>,
  luminosity: Option<u8>,
  saturation: Option<u8>,
}
```


### Objective

Master the basics about structure handling in Rust

### Tasks

1. Introduction (5 minutes) : [introduction.rs](examples/src/introduction.rs)
2. Strings and Vectors (15 minutes) : [string.rs](examples/src/string.rs)
3. Pattern Matching (20 minutes): [pattern_matching.rs](examples/src/pattern_matching.rs)
4. Basics of Traits (20 minutes): [trait.rs](examples/src/traits)
5. Combined Exercise (15 minutes): [combined.rs](examples/src/combined.rs)
6. Q&A and Closing (5 minutes)

Resolved exercises : [solutions](solutions/src/main.rs)

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
The SETUP and STARTER packages must have been completed

Access to the Rust documentation at https://doc.rust-lang.org/std/index.html

Acces to the Rust book at https://doc.rust-lang.org/book/
