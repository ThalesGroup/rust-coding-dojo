// Instruction: Make the program compiling

fn borrowing(element_vec: &String) // we pass the reference and precise also the type which is a String 
{
    println!("{}", element_vec);
}

fn main() {
    let vec: Vec<String> = vec![String::from("Embedded"), 
        String::from("System"), 
        String::from("Software")
    ];
    borrowing(&vec[1]); // we pass the reference of the vector element

    for element in vec {
        println!("{}", element);
    }
}