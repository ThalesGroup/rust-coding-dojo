// Instruction: Make the program compiling and add the line of code to multiply the element by two

fn mul_two(buffer_s: &mut [i32]) { // We use '&' to use a reference and "mut" to specify that the variable is mutable
    for element in buffer_s {
        *element *= 2; // Unreferencing the variable to update its value
    }
}


fn main() {
    let mut buffer_s = [1, 23, 41, 83, 40, 91, 10];
    mul_two(&mut buffer_s); // We indicate it's a reference and it's mutable 
    println!("{:?}", buffer_s);
}
