/**
 * Section 3 : RefCell & Interior Mutability
 * 
 * - *Exercise 1:* Define a struct `Counter` that wraps an integer inside a `RefCell<i32>`.
 *     - Implement methods `increment`, `get`, and `reset`.
 *     - Demonstrate how interior mutability allows mutation through an immutable reference.
 *
 * - *Exercise 2:* Create a struct `SharedLog` with a `RefCell<Vec<String>>` to simulate logging.
 *     - Use `Rc<SharedLog>` to allow multiple components to push logs into the same buffer.
 *     - Implement a `log(&self, msg: &str)` method that appends to the log.
 *     - Implement a `show(&self)` method to display the log.
 *
 * - *Exercise 3:* Build a mutable tree structure using `Rc<RefCell<TreeNode2>>`.
 *     - Each node holds a value and optional mutable children (`left`, `right`).
 *     - Implement methods to create nodes, attach children, and print the tree in-order.
 *     - Demonstrate that nodes can be modified from multiple owners thanks to `RefCell`.
 *
 * Define in this module the types, methods, and functions, and use them in `main.rs`.
 * The exercises in this coding dojo are designed to explore real use-cases for RefCell in Rust.
 */