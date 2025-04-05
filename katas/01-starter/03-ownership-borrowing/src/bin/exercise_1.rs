// Instruction: Make the program compiling and add the line of code to multiply the element by two

fn mul_two(buffer_s: [i32]) {
    for element in buffer_s {
        // multiply the element by two
    }
}


fn main() {
    let mut buffer_s = [1, 23, 41, 83, 40, 91, 10];
    mul_two(buffer_s);
    println!("{:?}", buffer_s);
}
