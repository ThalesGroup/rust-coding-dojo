/**
 * Section 5 : Combined Exercise
 * - *Exercise 1:* Build a program that manages a list of employees. Each employee has a name, age, and job title (an num). Implement sorting based on age and display the sorted list. Make the struct Employee implements the trait Display.
 * - *Exercise 2:* Extend the employee program to handle promotions. Implement a trait `Promotable` with a method to increase the salary, and apply it to employees with specific job titles.
 * - *Exercise 3:* Create a data structure for a competence matrix. Display the employees with Rust skills.
 *
 * Define in this module the types, methods and function and use them in `main.rs`.
 * The exercises in this coding dojo are designed to progressively increase in difficulty.
 */
use std::collections::HashMap;
use std::fmt;

// Employee struct
#[derive(Debug)]
pub struct Employee {
    pub(crate) name: String,
    pub(crate) age: u32,
    pub(crate) job_title: String,
    pub(crate) salary: f64,
}

// Implement Display trait for Employee
impl fmt::Display for Employee {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Name: {}, Age: {}, Job Title: {}, Salary: {}", self.name, self.age, self.job_title, self.salary)
    }
}

// Trait for promotable employees
pub trait Promotable {
    fn promote(&mut self);
}

impl Promotable for Employee {
    fn promote(&mut self) {
        match self.job_title.as_str() {
            "Manager" => self.salary *= 1.1,
            "Senior Engineer" => self.salary *= 1.05,
            _ => (),
        }
    }
}

// Competence matrix data structure
pub struct CompetenceMatrix {
    pub skill_matrix: HashMap<String, Vec<Employee>>,
}
