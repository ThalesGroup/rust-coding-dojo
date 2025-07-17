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

use std::cell::RefCell;
use std::rc::Rc;

// Section 3 RefCell & Interior Mutability - Exercise 1

pub struct Counter {
    value: RefCell<i32>,
}

impl Counter {
    pub fn new(initial: i32) -> Self {
        Counter {
            value: RefCell::new(initial),
        }
    }

    pub fn increment(&self) {
        *self.value.borrow_mut() += 1;
    }

    pub fn reset(&self) {
        *self.value.borrow_mut() = 0;
    }

    pub fn get(&self) -> i32 {
        *self.value.borrow()
    }
}

// Section 3 RefCell & Interior Mutability - Exercise 2

pub struct SharedLog {
    messages: RefCell<Vec<String>>,
}

impl SharedLog {
    pub fn new() -> Rc<Self> {
        Rc::new(SharedLog {
            messages: RefCell::new(Vec::new()),
        })
    }

    pub fn log(&self, msg: &str) {
        self.messages.borrow_mut().push(msg.to_string());
    }

    pub fn show(&self) {
        for msg in self.messages.borrow().iter() {
            println!("- {}", msg);
        }
    }
}


// Section 3 RefCell & Interior Mutability - Exercise 3

#[derive(Debug)]
pub struct TreeNode2 {
    pub value: i32,
    pub left: Option<Rc<RefCell<TreeNode2>>>,
    pub right: Option<Rc<RefCell<TreeNode2>>>,
}

impl TreeNode2 {
    pub fn new(value: i32) -> Rc<RefCell<Self>> {
        Rc::new(RefCell::new(TreeNode2 {
            value,
            left: None,
            right: None,
        }))
    }

    pub fn set_left(parent: &Rc<RefCell<TreeNode2>>, child: Rc<RefCell<TreeNode2>>) {
        parent.borrow_mut().left = Some(child);
    }

    pub fn set_right(parent: &Rc<RefCell<TreeNode2>>, child: Rc<RefCell<TreeNode2>>) {
        parent.borrow_mut().right = Some(child);
    }

    pub fn print_inorder(node: Option<Rc<RefCell<TreeNode2>>>) {
        if let Some(rc_node) = node {
            let node_ref = rc_node.borrow();
            Self::print_inorder(node_ref.left.clone());
            print!("{} ", node_ref.value);
            Self::print_inorder(node_ref.right.clone());
        }
    }
}
