fn parse_digit(top: &str, mid: &str, bot: &str) -> Option<u32> {
    match (top, mid, bot) {
        (" _ ", "| |", "|_|") => Some(0),
        ("   ", "  |", "  |") => Some(1),
        (" _ ", " _|", "|_ ") => Some(2),
        (" _ ", " _|", " _|") => Some(3),
        ("   ", "|_|", "  |") => Some(4),
        (" _ ", "|_ ", " _|") => Some(5),
        (" _ ", "|_ ", "|_|") => Some(6),
        (" _ ", "  |", "  |") => Some(7),
        (" _ ", "|_|", "|_|") => Some(8),
        (" _ ", "|_|", " _|") => Some(9),
        _ => None,
    }
}

fn pad_to(s: &str, len: usize) -> String {
    format!("{:<width$}", s, width = len)
}

fn parse_account(input: &str) -> Result<Vec<u32>, String> {
    let lines: Vec<&str> = input.lines().collect();
    if lines.len() < 3 {
        return Err("Input must have at least 3 lines".to_string());
    }
    let top = pad_to(lines[0], 27);
    let mid = pad_to(lines[1], 27);
    let bot = pad_to(lines[2], 27);

    (0..9)
        .map(|i| {
            let s = i * 3;
            parse_digit(&top[s..s + 3], &mid[s..s + 3], &bot[s..s + 3])
                .ok_or_else(|| format!("Unknown digit pattern at position {}", i))
        })
        .collect()
}

fn validate_checksum(digits: &[u32]) -> bool {
    // (9*d1 + 8*d2 + ... + 1*d9) % 11 == 0
    // equivalently: (d9 + 2*d8 + ... + 9*d1) % 11 == 0
    let sum: u32 = digits
        .iter()
        .rev()
        .enumerate()
        .map(|(i, &d)| (i as u32 + 1) * d)
        .sum();
    sum % 11 == 0
}

pub fn parse_digits(input: &str) -> Result<u64, String> {
    let digits = parse_account(input)?;
    if !validate_checksum(&digits) {
        return Err("Invalid checksum".to_string());
    }
    Ok(digits.iter().fold(0u64, |acc, &d| acc * 10 + d as u64))
}

fn main() {
    let valid = "    _  _     _  _  _  _  _ \n  | _| _||_||_ |_   ||_||_|\n  ||_  _|  | _||_|  ||_| _|\n                            \n";
    println!("{:?}", parse_digits(valid));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_all_zeros() {
        let input = " _  _  _  _  _  _  _  _  _ \n| || || || || || || || || |\n|_||_||_||_||_||_||_||_||_|\n                            \n";
        assert_eq!(parse_digits(input), Ok(0));
    }

    #[test]
    fn parse_123456789() {
        let input = "    _  _     _  _  _  _  _ \n  | _| _||_||_ |_   ||_||_|\n  ||_  _|  | _||_|  ||_| _|\n                            \n";
        assert_eq!(parse_digits(input), Ok(123456789));
    }

    #[test]
    fn invalid_checksum_returns_err() {
        // 111111111: checksum = 1+2+3+4+5+6+7+8+9 = 45, 45 % 11 = 1 != 0
        let input = "                           \n  |  |  |  |  |  |  |  |  |\n  |  |  |  |  |  |  |  |  |\n                            \n";
        assert!(parse_digits(input).is_err());
    }

    #[test]
    fn checksum_valid_for_000000000() {
        // All zeros: checksum = 0, valid
        let input = " _  _  _  _  _  _  _  _  _ \n| || || || || || || || || |\n|_||_||_||_||_||_||_||_||_|\n                            \n";
        assert!(parse_digits(input).is_ok());
    }
}
