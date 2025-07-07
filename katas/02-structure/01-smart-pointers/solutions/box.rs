/**
 * Section 1 : Box Smart Pointers
 * 
 * - *Exercise 1:* Define an enum `List` to implement a singly linked list of integers.
 *     - Use `Box` to enable recursive types.
 *     - Implement a method `prepend` to add elements to the front of the list.
 *     - Implement a method `print` to display the list in order (e.g., 1 -> 2 -> 3 -> Nil).
 *
 * - *Exercise 2:* Create a struct `BinaryTree` representing a binary search tree of integers.
 *     - Use `Box` for left and right children.
 *     - Implement an `insert` method to add new values in BST order.
 *     - Implement a `print_inorder` method to traverse and display values in sorted order.
 *
 * - *Exercise 3:* Build a simplified reference counter type `MyRc<T>`.
 *     - Internally store the value in a `Box<T>`.
 *     - Maintain a manual reference count.
 *     - Provide methods `new`, `clone_ref` (increment count), and `count` (return count).
 *
 * Define in this module the types, methods, and functions, and use them in `main.rs`.
 * The exercises in this coding dojo are designed to explore real use-cases for Box in Rust.
 */

// Section 1: Box Smart Pointers - Exercise 1

pub enum List {
    Cons(i32, Box<List>),
    Nil,
}

impl List {
    pub fn new() -> Self {
        List::Nil
    }

    pub fn prepend(self, value: i32) -> Self {
        List::Cons(value, Box::new(self))
    }

    pub fn print(&self) {
        match self {
            List::Cons(val, next) => {
                print!("{} -> ", val);
                next.print();
            }
            List::Nil => {
                println!("Nil");
            }
        }
    }
}

// Section 1: Box Smart Pointers - Exercise 2

pub struct TreeNode {
    value: i32,
    left: Option<Box<TreeNode>>,
    right: Option<Box<TreeNode>>,
}

impl TreeNode {
    pub fn new(value: i32) -> Self {
        TreeNode {
            value,
            left: None,
            right: None,
        }
    }

    pub fn insert(self: Box<Self>, new_value: i32) -> Box<Self> {
        if new_value < self.value {
            Box::new(TreeNode {
                value: self.value,
                left: Some(if let Some(left) = self.left {
                    left.insert(new_value)
                } else {
                    Box::new(TreeNode::new(new_value))
                }),
                right: self.right,
            })
        } else {
            Box::new(TreeNode {
                value: self.value,
                left: self.left,
                right: Some(if let Some(right) = self.right {
                    right.insert(new_value)
                } else {
                    Box::new(TreeNode::new(new_value))
                }),
            })
        }
    }

    pub fn print_inorder(&self) {
        if let Some(left) = &self.left {
            left.print_inorder();
        }
        print!("{} ", self.value);
        if let Some(right) = &self.right {
            right.print_inorder();
        }
    }
}

// Section 1: Box Smart Pointers - Exercise 3

pub struct MyRc<T> {
    value: Box<T>,
    count: usize,
}

impl<T : Copy> MyRc<T> {
    pub fn new(value: T) -> Self {
        MyRc {
            value: Box::new(value),
            count: 1,
        }
    }

    pub fn clone_ref(&self) -> Self {
        MyRc {
            value: Box::new(*self.value), // clone the inner value if Copy
            count: self.count + 1,
        }
    }

    pub fn count(&self) -> usize {
        self.count
    }

    pub fn get(&self) -> &T {
        &self.value
    }
}
