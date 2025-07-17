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