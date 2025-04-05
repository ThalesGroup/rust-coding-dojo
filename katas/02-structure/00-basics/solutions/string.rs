/**
 * Section 2 : String and Vector
 * - *Exercise 1:* Given a string, count the number of vowels (a, e, i, o, u) and print the result.
 * - *Exercise 2:* Write a program that takes two vectors and merges them into a single vector, removing any duplicates.
 * - *Exercise 3:* Implement a function that finds the longest word in a sentence. The sentence is provided as a string, and words are separated by spaces.
 *
 * Define in this module the types, methods and function and use them in `main.rs`.
 * The exercises in this coding dojo are designed to progressively increase in difficulty.
 */

// Section 2: Strings and Vectors - Exercise 1
pub fn count_vowels(input_string: &str) -> usize {
    input_string.chars().filter(|&c| "aeiouAEIOU".contains(c)).count()
}

// Section 2: Strings and Vectors - Exercise 2
pub fn merge_and_remove_duplicates(mut vec1: Vec<i32>, mut vec2: Vec<i32>) -> Vec<i32> {
    vec1.append(&mut vec2);
    vec1.sort();
    vec1.dedup();
    vec1
}

// Section 2: Strings and Vectors - Exercise 3
pub fn longest_word(sentence: &str) -> &str {
    sentence.split_whitespace().max_by_key(|&word| word.len()).unwrap_or("")
}
