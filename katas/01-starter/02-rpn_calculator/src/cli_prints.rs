
pub mod cli {
    pub fn print_header() {
        clear_terminal_screen();
        println!("");
        println!("");
        println!("-------------------------------");
        println!(" Welcome to the RPN calculator");
        println!("-------------------------------");
        println!("");
        println!("");
        print_available_commands();
    }

    pub fn print_goodbye_msg() {
        clear_terminal_screen();
        println!("");
        println!("");
        println!("---------------------------------------");
        println!("Thank you for using the RPN calculator.");
        println!("---------------------------------------");
        println!("");
        println!("");
    }

    pub fn print_error_msg() {
        println!("Unknown operation. Available operations are : ");
        print_available_commands();
    }

    pub fn print_operation_error() {
        println!("Unable to perform operation on current stack.");
        print_available_commands();
    }

    pub fn print_available_commands() {
        println!("Input any floating point number. e.g. \"123.45\" for it to be added to the LIFO.");
        println!("\"+\" to add the two last items on the LIFO.");
        println!("\"-\" to substract the two last items on the LIFO.");
        println!("\"*\" to multiply the two last items on the LIFO.");
        println!("\"/\" to divide the two last items on the LIFO.");
        println!("\"r\" to reset the program.");
        println!("\"q\" to exit the program.");
    }

    pub fn clear_terminal_screen() {
        print!("{esc}c", esc = 27 as char);
    }
}