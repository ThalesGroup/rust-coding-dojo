/**
 * Section 4 : Rc + RefCell Combined
 * 
 * - *Exercise 1:* Implement a bidirectional `Person` struct using `Rc<RefCell<T>>`.
 *     - Each `Person` has a name and an optional `friend`.
 *     - Use `Rc<RefCell<Person>>` to allow two persons to point to each other.
 *     - This creates a cycle: explain how and why it causes a memory leak.
 *
 * - *Exercise 2:* Create a mutable `GraphNode` struct.
 *     - Each node has a value and a list of neighbors (`Vec<Rc<RefCell<GraphNode>>>`).
 *     - Implement a method to connect two nodes.
 *     - Use `Weak` references to break cycles and prevent memory leaks.
 *
 * - *Exercise 3:* Build a trick example showing how `RefCell` can panic at runtime.
 *     - Create a struct that borrows mutably twice via `RefCell`, triggering a panic.
 *     - Show that Rust's borrow checker doesn't catch it at compile time.
 *
 * These exercises show both the power and the pitfalls of combining Rc and RefCell in Rust.
 */