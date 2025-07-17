use crate::r#box::{List, TreeNode, MyRc};
use crate::rc::{RcList, TreeNode1}
use crate::refcell::TreeNode2
use crate::combined::{Person, GraphNode, Trap, run_trap};
use std::rc::Rc;

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

    // Section 2 : Rc & Shared Ownership - Exercise 1

    let shared_tail = Rc::new(RcList::Cons(10, Rc::new(RcList::Cons(20, Rc::new(RcList::Nil)))));

    let list1 = RcList::Cons(1, Rc::clone(&shared_tail));
    let list2 = RcList::Cons(2, Rc::clone(&shared_tail));

    list1.print(); // 1 -> 10 -> 20 -> Nil
    list2.print(); // 2 -> 10 -> 20 -> Nil

    // Section 2 : Rc & Shared Ownership - Exercise 2

    let shared_leaf = Rc::new(TreeNode1::new(42));

    let left = Rc::new(TreeNode1::with_children(1, Some(Rc::clone(&shared_leaf)), None));
    let right = Rc::new(TreeNode1::with_children(2, None, Some(Rc::clone(&shared_leaf))));

    let root = Rc::new(TreeNode1::with_children(0, Some(left), Some(right)));

    TreeNode1::print_inorder(Some(&root)); // Output: 42 1 0 2 42

    // Section 2 : Rc & Shared Ownership - Exercise 3

    rc::demo_rc_counts();

    // Section 3 RefCell & Interior Mutability - Exercise 1

    let counter = refcell::Counter::new(0);
    counter.increment();
    counter.increment();
    println!("Counter: {}", counter.get()); // 2
    counter.reset();
    println!("Counter after reset: {}", counter.get()); // 0

    // Section 3 RefCell & Interior Mutability - Exercise 2

    let logger = refcell::SharedLog::new();
    let logger_clone = Rc::clone(&logger);
    logger.log("App started");
    logger_clone.log("User logged in");
    logger.show();

    // Section 3 RefCell & Interior Mutability - Exercise 3

    let shared_leaf = TreeNode2::new(99);

    let left = TreeNode2::new(1);
    TreeNode2::set_left(&left, Rc::clone(&shared_leaf));

    let right = TreeNode2::new(2);
    TreeNode2::set_right(&right, Rc::clone(&shared_leaf));

    let root = TreeNode2::new(0);
    TreeNode2::set_left(&root, left);
    TreeNode2::set_right(&root, right);

    TreeNode2::print_inorder(Some(root)); // 99 1 0 2 99

    // Section 4 : Rc + RefCell Combined - Exercise 1

    let alice = Person::new("Alice");
    let bob = Person::new("Bob");

    // Create a mutual reference cycle between Alice and Bob
    Person::befriend(&alice, &bob);

    println!("Alice's friend: {:?}", alice.friend.borrow().as_ref().map(|p| &p.name));
    println!("Bob's friend: {:?}", bob.friend.borrow().as_ref().map(|p| &p.name));

    // Show strong reference counts (they stay >1 due to the cycle)
    println!("Alice strong count: {}", Rc::strong_count(&alice));
    println!("Bob strong count: {}", Rc::strong_count(&bob));

    // Even when main ends, these objects will never be freed (memory leak)

    // Section 4 : Rc + RefCell Combined - Exercise 2

    let node_a = GraphNode::new("A");
    let node_b = GraphNode::new("B");
    let node_c = GraphNode::new("C");

    // Connect nodes bidirectionally using Weak references to prevent cycles
    GraphNode::connect(&node_a, &node_b);
    GraphNode::connect(&node_b, &node_c);
    GraphNode::connect(&node_c, &node_a);

    // Print neighbors of each node
    node_a.print_neighbors();
    node_b.print_neighbors();
    node_c.print_neighbors();

    // Section 4 : Rc + RefCell Combined - Exercise 3

    println!("Attempting to trigger a RefCell panic...");

    // This will panic due to double mutable borrow
    combined::run_trap();
}
