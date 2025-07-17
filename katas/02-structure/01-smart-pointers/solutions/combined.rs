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

 use std::cell::RefCell;
 use std::rc::{Rc, Weak};
 use std::panic;
 
 
 // Section 4 : Rc + RefCell Combined - Exercise 1
 
 #[derive(Debug)]
 pub struct Person {
     pub name: String,
     pub friend: RefCell<Option<Rc<Person>>>,
 }
 
 impl Person {
     pub fn new(name: &str) -> Rc<Self> {
         Rc::new(Person {
             name: name.to_string(),
             friend: RefCell::new(None),
         })
     }
 
     pub fn befriend(a: &Rc<Person>, b: &Rc<Person>) {
         *a.friend.borrow_mut() = Some(Rc::clone(b));
         *b.friend.borrow_mut() = Some(Rc::clone(a));
     }
 }
 
 // Section 4 : Rc + RefCell Combined - Exercise 2
 
 #[derive(Debug)]
 pub struct GraphNode {
     pub name: String,
     pub neighbors: RefCell<Vec<Weak<GraphNode>>>,
 }
 
 impl GraphNode {
     pub fn new(name: &str) -> Rc<Self> {
         Rc::new(GraphNode {
             name: name.to_string(),
             neighbors: RefCell::new(vec![]),
         })
     }
 
     pub fn connect(a: &Rc<Self>, b: &Rc<Self>) {
         a.neighbors.borrow_mut().push(Rc::downgrade(b));
         b.neighbors.borrow_mut().push(Rc::downgrade(a));
     }
 
     pub fn print_neighbors(&self) {
         for weak in self.neighbors.borrow().iter() {
             if let Some(neigh) = weak.upgrade() {
                 println!("{} is connected to {}", self.name, neigh.name);
             }
         }
     }
 }
 
 // Section 4 : Rc + RefCell Combined - Exercise 3
 
 pub struct Trap {
     value: RefCell<i32>,
 }
 
 impl Trap {
     pub fn new(x: i32) -> Self {
         Trap {
             value: RefCell::new(x),
         }
     }
 
     pub fn double_mut_borrow(&self) {
         let _first = self.value.borrow_mut();
         let _second = self.value.borrow_mut(); // PANIC at the execution
     }
 }
 
 pub fn run_trap() {
     let trap = Trap::new(10);
     // This will crash the program with a panic, but that's the point
     trap.double_mut_borrow();
 }