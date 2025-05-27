/**
 * Section 1 : Introduction
 * - *Exercise 1:* Define an Enum BookType with some kinds like `comic`, `sf`, `novel` and `programming`.
 * - *Exercise 2:* Define a struct `Book` with fields for title, author, book type and publication year. Instantiate an instance and print its details
 * - *Exercise 3:* Create a struct `Library` containing a vector of `Book` instances. Write a function to display all books in the library.
 * - *Exercise 4:* Extend the `Book` struct with a method to calculate the age of the book based on the current year. Display the age of each book in the library.
 *
 * Tip: Derive `Debug` so we can print `BookType` with `{:?}`
 * Define in this module the types, methods and function and use them in `main.rs`.
 * The exercises in this coding dojo are designed to progressively increase in difficulty.
 */

// Section 1: Introduction - Exercise 1
#[derive(Debug)]
pub enum BookType {
    Comic,
    SF,
    Novel,
    Programming,
}

// Section 1: Introduction - Exercise 2
pub struct Book {
    pub title: String,
    pub author: String,
    pub publication_year: u32,
    pub book_type: BookType
}

// Section 1: Introduction - Exercise 3
pub struct Library {
    pub books: Vec<Book>,
}

impl Library {
    pub fn display_books(&self) {
        for book in &self.books {
            println!("Title: {}, Author: {}, Year: {}, Type: {:?}", book.title, book.author, book.publication_year, book.book_type);
        }
    }
}

// Section 1: Introduction - Exercise 4
impl Book {
    pub fn calculate_age(&self, current_year: u32) -> u32 {
        current_year - self.publication_year
    }
}