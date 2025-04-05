/**
 * Section 3 : Pattern Matching
 * - *Exercise 1:* Create a function to check if a given number is prime, using pattern matching for different cases (prime, non-prime).
 * - *Exercise 2:* Implement a program that categorizes a list of integers into three groups: positive, negative, and zero.
 * - *Exercise 3:* Define an enum `Shape` with variants for Circle and Square. Write a function that calculates the area based on the shape and relevant parameters.
 *
 * Define in this module the types, methods and function and use them in `main.rs`.
 * The exercises in this coding dojo are designed to progressively increase in difficulty.
 */
// Section 3: Pattern Matching - Exercise 1
pub fn is_prime(num: u32) -> bool {
    match num {
        0 | 1 => false,
        2 => true,
        n => (2..n).all(|i| n % i != 0),
    }
}

// Section 3: Pattern Matching - Exercise 2
pub fn categorize_numbers(numbers: Vec<i32>) {
    for num in numbers {
        match num {
            n if n > 0 => println!("Positive"),
            n if n < 0 => println!("Negative"),
            _ => println!("Zero"),
        }
    }
}

// Section 3: Pattern Matching - Exercise 3
pub enum Shape {
    Circle(f64),
    Square(f64),
}

impl Shape {
    pub fn calculate_area(&self) -> f64 {
        match self {
            Shape::Circle(radius) => std::f64::consts::PI * radius * radius,
            Shape::Square(side) => side * side,
        }
    }
}