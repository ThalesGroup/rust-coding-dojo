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