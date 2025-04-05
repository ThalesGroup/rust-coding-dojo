// Instruction: Make the program compiling and implement borrowing into return_vec function without using a return


fn return_vec(v: &mut Vec<i32>) // Sort() changes the vector so must specify it is a mut and of course its reference for the borrowing
{
    v.sort();
}

fn main() {
    let mut v: Vec<i32> = vec![12, 981, 43, 92, 981];
    return_vec(&mut v); // mut and reference
    println!("{:?}", v);
}
