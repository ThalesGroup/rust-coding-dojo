use std::collections::HashMap;

pub struct Interpreter;

impl Interpreter {
    pub fn run(program: &str, input: &str) -> Result<String, String> {
        let prog: Vec<char> = program.chars().collect();
        let mut tape = vec![0u8; 30000];
        let mut dp = 0usize;
        let mut ip = 0usize;
        let mut input_iter = input.bytes();
        let mut output = String::new();

        // Pre-compute bracket matching
        let mut bracket_map: HashMap<usize, usize> = HashMap::new();
        let mut stack: Vec<usize> = Vec::new();
        for (i, &c) in prog.iter().enumerate() {
            if c == '[' {
                stack.push(i);
            } else if c == ']' {
                let open = stack.pop().ok_or_else(|| format!("Unmatched ] at position {}", i))?;
                bracket_map.insert(open, i);
                bracket_map.insert(i, open);
            }
        }
        if !stack.is_empty() {
            return Err("Unmatched [ in program".to_string());
        }

        while ip < prog.len() {
            match prog[ip] {
                '>' => {
                    dp += 1;
                    if dp >= tape.len() {
                        tape.push(0);
                    }
                }
                '<' => {
                    if dp == 0 {
                        return Err("Data pointer underflow".to_string());
                    }
                    dp -= 1;
                }
                '+' => tape[dp] = tape[dp].wrapping_add(1),
                '-' => tape[dp] = tape[dp].wrapping_sub(1),
                '.' => output.push(tape[dp] as char),
                ',' => tape[dp] = input_iter.next().unwrap_or(0),
                '[' => {
                    if tape[dp] == 0 {
                        ip = *bracket_map.get(&ip).unwrap();
                    }
                }
                ']' => {
                    if tape[dp] != 0 {
                        ip = *bracket_map.get(&ip).unwrap();
                    }
                }
                _ => {} // Ignore all other characters
            }
            ip += 1;
        }
        Ok(output)
    }
}

fn main() {
    let prog = "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.";
    match Interpreter::run(prog, "") {
        Ok(out) => print!("{}", out),
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
        let prog = "+".repeat(65) + ".";
        assert_eq!(Interpreter::run(&prog, ""), Ok("A".to_string()));
    }

    #[test]
    fn simple_loop() {
        assert_eq!(Interpreter::run("+++++[-].", ""), Ok("\0".to_string()));
    }

    #[test]
    fn read_input() {
        assert_eq!(Interpreter::run(",.", "A"), Ok("A".to_string()));
    }

    #[test]
    fn hello_world() {
        let prog = "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.";
        assert_eq!(Interpreter::run(prog, ""), Ok("Hello, World!\n".to_string()));
    }

    #[test]
    fn unmatched_bracket_returns_error() {
        assert!(Interpreter::run("[", "").is_err());
    }
}
