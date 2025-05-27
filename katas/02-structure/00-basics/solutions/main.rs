use std::collections::HashMap;
use std::error::Error;
use std::f32::consts;
use crate::combined::{CompetenceMatrix, Employee, Promotable};
use crate::introduction::{BookType, Book, Library};
use crate::pattern_matching::{categorize_numbers, is_prime, Shape};
use crate::string::{count_vowels, longest_word, merge_and_remove_duplicates};
use crate::traits::{Calculator, CustomStruct, display_elements, MathOperation, Sortable};

mod introduction;
mod string;
mod traits;
mod pattern_matching;
mod combined;

fn main() {
    // Section 1: Introduction - Exercise 2
    let book1 = Book {
        title: String::from("The Rust Programming Language"),
        author: String::from("Steve Klabnik and Carol Nichols"),
        publication_year: 2018,
        book_type: BookType::Programming,
    };

    // Section 1: Introduction - Exercise 3
    let library = Library {
        books: vec![
            Book {
                title: String::from("Clean Code"),
                author: String::from("Robert C. Martin"),
                publication_year: 2008,
                book_type: BookType::Programming,
            },
            Book {
                title: String::from("Rust in Action"),
                author: String::from("Tim McNamara"),
                publication_year: 2020,
                book_type: BookType::Programming,
            },
        ],
    };

    // Section 1: Introduction - Exercise 4
    let current_year = 2024;
    let age = book1.calculate_age(current_year);

    // Display Book Details
    println!("Book 1 Details:");
    println!("Title: {}, Author: {}, Year: {}, Type: {:?}", book1.title, book1.author, book1.publication_year, book1.book_type);
    println!("Age of Book 1: {} years", age);

    // Display Library Books
    println!("\nLibrary Books:");
    library.display_books();

    // Section 2: Strings and Vectors - Exercise 1
    let input_string = "Hello, Rust!";
    let vowel_count = count_vowels(input_string);
    println!("Vowel Count in '{}': {}", input_string, vowel_count);

    // Section 2: Strings and Vectors - Exercise 2
    let vec1 = vec![1, 2, 3];
    let vec2 = vec![3, 4, 5];
    let merged_vector = merge_and_remove_duplicates(vec1, vec2);
    println!("Merged and Deduplicated Vector: {:?}", merged_vector);

    // Section 2: Strings and Vectors - Exercise 3
    let sentence = "Rust programming is amazing!";
    let longest = longest_word(sentence);
    println!("Longest Word in '{}': {}", sentence, longest);

    // Section 3: Pattern Matching - Exercise 1
    let prime_number = 19;
    if is_prime(prime_number) {
        println!("{} is prime", prime_number);
    } else {
        println!("{} is not prime", prime_number);
    }

    // Section 3: Pattern Matching - Exercise 2
    let numbers_to_categorize = vec![5, -2, 0, 8, -3];
    println!("Categorized Numbers:");
    categorize_numbers(numbers_to_categorize);

    // Section 3: Pattern Matching - Exercise 3
    let circle = Shape::Circle(5.0);
    let square = Shape::Square(4.0);
    println!("Circle Area: {}", circle.calculate_area());
    println!("Square Area: {}", square.calculate_area());

    // Section 4: Basics of Traits - Exercise 1
    let calculator = Calculator;
    let result = calculator.perform_operation(3.0, 7.0);
    println!("Addition Result: {}", result);

    // Section 4: Basics of Traits - Exercise 2
    let display_elements_vector = vec![10.0, 42f32, consts::PI];
    println!("Displaying Elements:");
    display_elements(display_elements_vector);
    let display_elements_vector = vec!["Hello", "world", "!"];
    println!("Displaying Elements:");
    display_elements(display_elements_vector);

    // Section 4: Basics of Traits - Exercise 3
    let mut custom_struct = CustomStruct { numbers: vec![3, 1, 4, 1, 5, 9] };
    custom_struct.sort();
    println!("Sorted Numbers: {:?}", custom_struct.numbers);

    // Section 5: Combined Exercise - Exercise 1
    let mut employees = vec![
        Employee { name: String::from("Alice"), age: 30, job_title: String::from("Manager"), salary: 80000.0 },
        Employee { name: String::from("Bob"), age: 28, job_title: String::from("Senior Engineer"), salary: 75000.0 },
        Employee { name: String::from("Charlie"), age: 35, job_title: String::from("Junior Engineer"), salary: 60000.0 },
    ];

    // Sort employees by age
    employees.sort_by(|a, b| a.age.cmp(&b.age));

    // Section 5: Combined Exercise - Exercise 2
    // Promote employees


    // Section 5: Combined Exercise - Exercise 3
    // Create competence matrix with skills
    let mut skill_matrix: HashMap<String, Vec<Employee>> = HashMap::new();
    skill_matrix.insert("Rust".to_string(), employees);

    // Display employees with Rust skills
    let mut competence_matrix = CompetenceMatrix { skill_matrix };

    if let Some(rust_employees) = competence_matrix.skill_matrix.get_mut("Rust") {
        println!("Employees with Rust skills:");
        for employee in rust_employees.iter_mut() {
            println!("{}", employee);
            // Section 5: Combined Exercise - Exercise 2
            employee.promote();
        }

        println!("\nAfter Promotion:");
        for employee in rust_employees.iter() {
            println!("{}", employee);
        }
    } else {
        println!("No employees found with Rust skills.");
    }
}
