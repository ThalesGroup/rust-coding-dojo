// Instruction: Make the program compiling and implement borrowing into return_vec function without using a return

fn return_vec(v: Vec<i32>) -> Vec<i32>
{
    v.sort();
    v
}

fn main() {
    let v: Vec<i32> = vec![12, 981, 43, 92, 981];
    v = return_vec(v);
    println!("{:?}", v);
}
