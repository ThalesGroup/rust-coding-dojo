// Instruction: Make the program compiling by changing instructions orders
fn main() {
    let mut x = 100;
    let y = &mut x;
    *y += 100;
    let z = &mut x;
    *z += 1000;
    assert_eq!(x, 1200);
    println!("Success");
}

// Move the Y initialization line above the declaration of the variable z.
// We enter into the rule of the number of references, where if we have a mutable variable, only one reference is allowe
// By moving *y += 100 to line 5, the compiler sees that after this line y is no longer used, so we can modify z with complete peacefully.