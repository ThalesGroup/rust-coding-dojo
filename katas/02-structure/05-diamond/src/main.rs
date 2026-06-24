// TODO: Implement the diamond function that takes a char (A-Z) and returns
// a vector of strings representing the diamond shape.
//
// Example: diamond('C') returns:
// vec!["  A", " B B", "C   C", " B B", "  A"]

fn diamond(c: char) -> Vec<String> {
    todo!("Implement the diamond function")
}

fn main() {
    for c in 'A'..='E' {
        println!("diamond('{}'):", c);
        for line in diamond(c) {
            println!("{}", line);
        }
        println!();
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn diamond_a() {
        assert_eq!(diamond('A'), vec!["A"]);
    }

    #[test]
    fn diamond_b() {
        assert_eq!(diamond('B'), vec![" A", "B B", " A"]);
    }

    #[test]
    fn diamond_c() {
        assert_eq!(diamond('C'), vec!["  A", " B B", "C   C", " B B", "  A"]);
    }

    #[test]
    fn diamond_d_lines_count() {
        let d = diamond('D');
        assert_eq!(d.len(), 7); // 2*n - 1 where n = 4 for 'D'
    }

    #[test]
    fn diamond_e_first_line_has_padding() {
        let d = diamond('E');
        assert!(d[0].starts_with("    A"));
    }
}
