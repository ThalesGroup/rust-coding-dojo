// TODO: Parse OCR account numbers
//
// Each digit is represented on 3 lines of 3 characters using '|', '_' and ' ':
//
//  _     _  _     _  _  _  _  _
// | |  | _| _||_||_  _    ||_||_|
// |_|  ||_  _|  | _||_|   ||_| _|
//  0   1  2  3  4  5  6   7  8  9
//
// Input: 4 lines (3 content lines + 1 blank), 27 characters wide for 9 digits.
// Parse to a 9-digit number, then validate with checksum:
//   (d9 + 2*d8 + 3*d7 + ... + 9*d1) % 11 == 0
// Return Ok(number) on success, Err(message) on unrecognised digit or bad checksum.

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

fn parse_account(input: &str) -> Result<Vec<u32>, String> {
    todo!("Split input into 3 lines, extract 9 digits of 3 chars each, use parse_digit")
}

fn validate_checksum(digits: &[u32]) -> bool {
    todo!("Compute (d9 + 2*d8 + ... + 9*d1) % 11 and check it equals 0")
}

pub fn parse_digits(input: &str) -> Result<u64, String> {
    todo!("Call parse_account, then validate_checksum, return the number or an Err")
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
    fn unknown_pattern_returns_err() {
        // Deliberately malformed digit pattern
        let input = "XXX      _  _  _  _  _  _  _ \n  | _| _||_||_ |_   ||_||_|\n  ||_  _|  | _||_|  ||_| _|\n                            \n";
        assert!(parse_digits(input).is_err());
    }
}
