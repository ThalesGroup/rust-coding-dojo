fn diamond(c: char) -> Vec<String> {
    let n = (c as u8 - b'A') as usize;
    let size = 2 * n + 1;
    let mut result = Vec::new();

    for i in 0..size {
        let row = if i <= n { i } else { size - 1 - i };
        let letter = (b'A' + row as u8) as char;
        let outer_padding = n - row;
        let left = " ".repeat(outer_padding) + &letter.to_string();

        if row == 0 {
            result.push(left);
        } else {
            let inner_padding = 2 * row - 1;
            let right = " ".repeat(inner_padding) + &letter.to_string();
            result.push(left + &right);
        }
    }

    result
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
        assert_eq!(d.len(), 7);
    }

    #[test]
    fn diamond_e_first_line_has_padding() {
        let d = diamond('E');
        assert!(d[0].starts_with("    A"));
    }
}
