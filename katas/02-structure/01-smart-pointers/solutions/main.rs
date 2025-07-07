use crate::r#box::{List, TreeNode, MyRc};

mod r#box;
mod rc;
mod refcell;
mod combined;

fn main() {
    // Section 1: Box Smart Pointers - Exercise 1
    let list = List::new()
        .prepend(3)
        .prepend(2)
        .prepend(1);

    list.print(); // Output: 1 -> 2 -> 3 -> Nil

    // Section 1: Box Smart Pointers - Exercise 2
    let tree = Box::new(TreeNode::new(5))
        .insert(3)
        .insert(7)
        .insert(1)
        .insert(4);

    tree.print_inorder(); // Expected output (sorted): 1 3 4 5 7

    // Section 1: Box Smart Pointers - Exercise 3
    let x = MyRc::new(42);
    println!("Count: {}", x.count());

    let y = x.clone_ref();
    println!("Count: {}", y.count());

    println!("Value in y: {}", y.get());
}
