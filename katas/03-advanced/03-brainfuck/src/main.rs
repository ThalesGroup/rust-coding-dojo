// TODO: Implement a Brainfuck interpreter
//
// Commands:
// > : move data pointer right (extend tape if needed)
// < : move data pointer left (error if at position 0)
// + : increment byte at pointer (wraps 255 -> 0)
// - : decrement byte at pointer (wraps 0 -> 255)
// . : output byte at pointer as ASCII char
// , : read one byte of input into current cell
// [ : if current cell is 0, jump past matching ]
// ] : if current cell is non-zero, jump back to matching [

pub struct Interpreter {
    tape: Vec<u8>,
    pointer: usize,
}

impl Interpreter {
    pub fn new() -> Self {
        todo!("Initialize tape with 30000 cells and pointer at 0")
    }

    pub fn run(program: &str, input: &str) -> Result<String, String> {
        todo!("Execute the Brainfuck program and return output")
    }
}

fn main() {
    // "Hello, World!" program in Brainfuck
    let hello_world = "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.";
    match Interpreter::run(hello_world, "") {
        Ok(output) => println!("{}", output),
        Err(e) => eprintln!("Error: {}", e),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_program_produces_empty_output() {
        assert_eq!(Interpreter::run("", ""), Ok(String::new()));
    }

    #[test]
    fn increment_and_output() {
        // 65 increments = 'A'
        let prog = "+".repeat(65) + ".";
        assert_eq!(Interpreter::run(&prog, ""), Ok("A".to_string()));
    }

    #[test]
    fn simple_loop() {
        // Set cell to 5, then loop decrementing to 0
        assert_eq!(Interpreter::run("+++++[-].", ""), Ok("\0".to_string()));
    }

    #[test]
    fn read_input_and_output() {
        assert_eq!(Interpreter::run(",.", "A"), Ok("A".to_string()));
    }

    #[test]
    fn hello_world() {
        let prog = "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.";
        assert_eq!(
            Interpreter::run(prog, ""),
            Ok("Hello, World!\n".to_string())
        );
    }

    #[test]
    fn unmatched_bracket_returns_error() {
        assert!(Interpreter::run("[", "").is_err());
    }
}
