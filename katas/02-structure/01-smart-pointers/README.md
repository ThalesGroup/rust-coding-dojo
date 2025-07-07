# Smart Pointers

## Level / Duration
[Intermediate] / 90 minutes

---

## Context

### Ownership and Memory Management

This module introduces **smart pointers** in Rust, which extend the ownership model to manage memory and resources with more flexibility.

Rust’s default variables are allocated on the **stack** when possible. For dynamic and **heap-allocated** data, Rust provides ownership and borrowing mechanisms to ensure memory safety without a garbage collector.

However, some situations require more advanced control over how data is **shared, mutated, or freed**. This is where **smart pointers** come in.

---

### What is a Smart Pointer?

A **smart pointer** is a data structure that behaves like a pointer but also has additional metadata and capabilities.

While a *regular* pointer (like a reference `&T`) just **points to data** without owning it, a smart pointer **owns** or **manages** data and may enforce specific rules about:

- Memory allocation and deallocation
- Mutability
- Shared access (reference counting)
- Thread safety

---

### Examples of Smart Pointers in Rust

Rust’s standard library offers several smart pointers for different use-cases:

- `Box<T>` – Heap allocation for single ownership  
- `Rc<T>` – Reference-counted shared ownership (single-threaded)  
- `Arc<T>` – Atomic reference counting (multi-threaded)  
- `RefCell<T>` – Interior mutability with dynamic borrow checking  
- `Mutex<T>` – Thread-safe interior mutability

---

### Why use Smart Pointers?

Without smart pointers, advanced data structures become impossible or unsafe to implement.

For example:

A **recursive data structure** like a linked list cannot work with plain references because Rust needs to know sizes at compile time:

```rust
enum List {
    Cons(i32, Box<List>),
    Nil,
}
```
Here, `Box` provides **indirection** to allow recursive types.

---

**Shared ownership** is impossible with normal references (only one owner allowed).  
Using `Rc` lets you **share the same data among multiple owners**:

```rust
use std::rc::Rc;

let a = Rc::new(5);
let b = Rc::clone(&a);
```
Both `a` and `b` now point to the same value on the heap.
Rust tracks the reference count automatically and deallocates the data when the count reaches zero.

Interior mutability is required when you want to mutate data even if it’s behind an immutable reference (for example in shared contexts).
For this, Rust offers `RefCell` (single-threaded) and `Mutex` (thread-safe).

**Example: RefCell**  
Enables interior mutability:

```rust
use std::cell::RefCell;

let data = RefCell::new(5);
*data.borrow_mut() = 10;
```
Allows mutation even when the `RefCell` itself is immutable.

---

### Objective

Master the basics of smart pointers in Rust

---

### Tasks

- Introduction (5 minutes): `introduction.rs`
- Box and Heap Allocation (15 minutes): `box.rs`
- Rc and Shared Ownership (20 minutes): `rc.rs`
- RefCell and Interior Mutability (20 minutes): `refcell.rs`
- Combined Exercise (15 minutes): `combined.rs`
- Q&A and Closing (5 minutes)

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


