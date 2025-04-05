// Instruction: Make the program compiling

fn borrowing(element_vec: )
{
    println!("{}", element_vec);
}

fn main() {
    let vec: Vec<String> = vec![String::from("Embedded"), 
        String::from("System"), 
        String::from("Software")
    ];
    borrowing(vec[1]);

    for element in vec {
        println!("{}", element);
    }
}