// Instruction: Make the program compiling without adding/removing references

fn main() {
    let mut data = "Rust is great!".to_string(); // Like in exercise 4, a method which updates the variable needs the variable to be mutable

    string_uppercase(&mut data); // We change the order so the move operation into get_char is performed at the end
    get_char(data);

}

// Should not take ownership
fn get_char(data: String) -> char {
    data.chars().last().unwrap()
}

// Should take ownership
fn string_uppercase(data: &mut String) {
    let data = &data.to_uppercase(); // To reuse the result, we can simply declare the variable without any data loss or reallocation

    println!("{}", data);
}
