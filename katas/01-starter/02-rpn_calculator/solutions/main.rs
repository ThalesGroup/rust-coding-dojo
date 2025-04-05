// Text - Based RPN calculator
// RPN : https://en.wikipedia.org/wiki/Reverse_Polish_notation
//
// Kata for the STARTER package of the Rust coding DOJO
// This kata as a part of the STARTER package targets Rust beginners.
// In this kata, participants will work on the following :
// -> Creating and Using Variables
// -> Control Flow Concepts
// -> Loops
// -> Functions
//
// Instructions
// In this kata you will develop a simple CLI (Command Line interface) Reverse Polish Notation Calculator.
// RPN functions with a last-in first out stack (LIFO) of 64 bits floating point elements.
// Supported operation are:
// - add
// - substract
// - multiply
// - divide
// Users can input numbers to be added to the stack
// Users can input operators (+, -, *, /). An operator input will apply the corresponding operation to the two last operand in the stack.
// User can exit the application by inputting "q"
// User can reset the application by inputting "r"
// Any other input will print an error message
//
// Prerequisites
// The SETUP package must have been completed
// Access to the Rust documentation at https://doc.rust-lang.org/std/index.html
// Acces to the Rust book at https://doc.rust-lang.org/book/

pub mod cli_prints;
pub mod rpn_stack;
use std::{io::Write, process::exit};
use crate::rpn_stack::RPNStack;
use crate::cli_prints::cli;

pub fn print_header() {
    cli::clear_terminal_screen();
    println!("");
    println!("");
    println!("-------------------------------");
    println!(" Welcome to the RPN calculator");
    println!("-------------------------------");
    println!("");
    println!("");
    cli::print_available_commands();
}

fn verify_operands(lifo: &RPNStack) -> bool {
    lifo.length() >= 2
}


fn get_rpn_calculator_version() -> String {
    let dot:char = '.';
    let major_version:&str = "1";
    let minor_version:Vec<u8> = vec![240, 159, 146, 150]; // Hint '💖';
    let patch_version:u8 = 12;
    let mut version:String = String::from(major_version);
    version.push(dot);
    version.push_str(&String::from_utf8(minor_version).unwrap());
    version.push(dot);
    version.push_str(&patch_version.to_string());
    version
}

fn get_user_input() -> Result<String, std::io::Error> {
    print!("{} ",get_rpn_calculator_version());
    print!("> ");
    std::io::stdout().flush().unwrap(); // To make sure the prompt is displayed before stdin is read.
    let mut buffer = String::new();
    match std::io::stdin().read_line(&mut buffer) {
        Ok(_n) => {
            // OK read, returning the input
            // Check inputs
            Ok(buffer)
        }
        Err(error) => {
            // KO read returning the error
            Err(error)
        }
    }
}

fn main() {
    // Main function of the program
    // Initializing variables
    let mut continue_looping: bool = true;
    let mut first_time_running: bool = true;
    let mut is_showing_commands: bool = true;
    let mut stack: RPNStack = RPNStack::new();

    // Main loop
    while continue_looping {
        if first_time_running {
            print_header();
            first_time_running = false;
        } else if !is_showing_commands {
            cli::clear_terminal_screen();
        }
        stack.print_stack();
        is_showing_commands = false;

        // Select operation from input
        match get_user_input() {
            Ok(inputs) => {
                apply_inputs_to_stack_and_update_loop_controls(inputs, &mut stack, &mut continue_looping, &mut is_showing_commands, &mut first_time_running);
            } // end of string processing
            Err(_error) => {
                cli::print_error_msg();
                is_showing_commands = true;
            }
        } // end matching the user input
    } // end of main loop
    cli::print_goodbye_msg();
    exit(0);
}

fn apply_inputs_to_stack_and_update_loop_controls(inputs: String, stack:&mut RPNStack, continue_looping:&mut bool, is_showing_commands: &mut bool, first_time_running: &mut bool) {
    // Cast inputs
    if inputs.trim().eq_ignore_ascii_case("+") {
        // Do the add
        if verify_operands(stack) {
            let operand_one = stack.pop().unwrap();
            let operand_two = stack.pop().unwrap();
            (*stack).push(operand_two + operand_one);
        } else {
            // Not enough operand for add operation
            cli::print_operation_error();
            *is_showing_commands = true;
        }
    } else if inputs.trim().eq_ignore_ascii_case("-") {
        // Do the substraction
        if verify_operands(stack) {
            let operand_one = stack.pop().unwrap();
            let operand_two = stack.pop().unwrap();
            stack.push(operand_two - operand_one); // (*stack) not needed as the dot operator add as many dereference as needed to match the signature!
        } else {
            // Not enough operand for substraction operation
            cli::print_operation_error();
            *is_showing_commands = true;
        }
    } else if inputs.trim().eq_ignore_ascii_case("*") {
        // Do the multiply
        if verify_operands(stack) {
            let operand_one = stack.pop().unwrap();
            let operand_two = stack.pop().unwrap();
            stack.push(operand_two * operand_one);
        } else {
            // Not enough operand for multiply operation
            cli::print_operation_error();
            *is_showing_commands = true;
        }
    } else if inputs.trim().eq_ignore_ascii_case("/") {
        // Do the divide
        if verify_operands(stack) {
            let operand_one = stack.pop().unwrap();
            let operand_two = stack.pop().unwrap();
            if operand_one != 0.0_f64 {
                stack.push(operand_two / operand_one);
            } else {
                // 0 divide
                // push back the operand into the stack
                stack.push(operand_two);
                stack.push(operand_one);
                cli::print_operation_error();
                *is_showing_commands = true;
            }
        } else {
            // Not enough operand for divide operation
            cli::print_operation_error();
            *is_showing_commands = true;
        }
    } else if inputs.trim().eq_ignore_ascii_case("q") {
        //exit the program
        *continue_looping = false;
    } else if inputs.trim().eq_ignore_ascii_case("r") {
        //reset the program
        *continue_looping = true;
        *first_time_running = true;
        *is_showing_commands = true;
        // reset stack
        stack.clear();
    } else {
        // If not a command then the input is a number or just gibberish
        // using the trim methode on inputs is mandatory if not parsing fail because of carriage return
        match inputs.trim().parse::<f64>() {
            Ok(number) => {
                // pushing the number on the lifo stack
                stack.push(number);
            }
            Err(_error) => {
                // gibberish
                cli::print_error_msg();
                *is_showing_commands = true;
            }
        }
    }
}