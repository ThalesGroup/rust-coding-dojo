/**
 * Section 2 : Rc & Shared Ownership
 * 
 * - *Exercise 1:* Define an enum `RcList` to implement a singly linked list of integers.
 *     - Use `Rc` to enable shared ownership of list tails.
 *     - Create multiple lists that share the same suffix.
 *     - Implement a method `print` to display the list in order (e.g., 1 -> 2 -> 3 -> Nil).
 *
 * - *Exercise 2:* Create a struct `TreeNode1` representing a binary tree of integers.
 *     - Use `Rc` for left and right children to allow subtree sharing.
 *     - Implement a `print_inorder` method to display values in sorted order.
 *     - Demonstrate shared subtrees by cloning shared nodes.
 *
 * - *Exercise 3:* Demonstrate reference counting with `Rc<T>`.
 *     - Track how many references exist using `Rc::strong_count`.
 *     - Clone an `Rc` multiple times and print the reference count at each step.
 *     - Show how scope impacts the count and automatic deallocation.
 *
 * Define in this module the types, methods, and functions, and use them in `main.rs`.
 * The exercises in this coding dojo are designed to explore real use-cases for Rc in Rust.
 */

use std::rc::Rc;

// Section 2 : Rc & Shared Ownership - Exercise 1

pub enum RcList {
    Cons(i32, Rc<RcList>),
    Nil,
}

impl RcList {
    pub fn print(&self) {
        match self {
            RcList::Cons(val, next) => {
                print!("{} -> ", val);
                next.print();
            }
            RcList::Nil => {
                println!("Nil");
            }
        }
    }
}

// Section 2 : Rc & Shared Ownership - Exercise 2

#[derive(Debug)]
pub struct TreeNode1 {
    pub value: i32,
    pub left: Option<Rc<TreeNode1>,
    pub right: Option<Rc<TreeNode1>>,
}

impl TreeNode1 {
    pub fn new(value: i32) -> Self {
        TreeNode1 {
            value,
            left: None,
            right: None,
        }
    }

    pub fn with_children(value: i32, left: Option<Rc<TreeNode1>>, right: Option<Rc<TreeNode1>>) -> Self {
        TreeNode1 { value, left, right }
    }

    pub fn print_inorder(node: Option<&Rc<TreeNode1>>) {
        if let Some(n) = node {
            Self::print_inorder(n.left.as_ref());
            print!("{} ", n.value);
            Self::print_inorder(n.right.as_ref());
        }
    }
}

// Section 2 : Rc & Shared Ownership - Exercise 3

pub fn demo_rc_counts() {
    let data = Rc::new(vec![1, 2, 3]);

    println!("Initial count: {}", Rc::strong_count(&data)); // 1

    let data_clone1 = Rc::clone(&data);
    println!("After clone 1: {}", Rc::strong_count(&data)); // 2

    {
        let data_clone2 = Rc::clone(&data);
        println!("Inside inner scope: {}", Rc::strong_count(&data)); // 3
        println!("data_clone2: {:?}", data_clone2);
    }

    println!("After inner scope: {}", Rc::strong_count(&data)); // 2
    println!("data_clone1: {:?}", data_clone1);
}
