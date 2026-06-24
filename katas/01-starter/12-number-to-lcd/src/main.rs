// TODO: Implement to_lcd(number: &str) -> String
// Each digit is 3 characters wide, represented on 3 lines.
// Digits (each 3 chars wide, top/middle/bottom row):
//  0: " _ ", "| |", "|_|"
//  1: "   ", "  |", "  |"
//  2: " _ ", " _|", "|_ "
//  3: " _ ", " _|", " _|"
//  4: "   ", "|_|", "  |"
//  5: " _ ", "|_ ", " _|"
//  6: " _ ", "|_ ", "|_|"
//  7: " _ ", "  |", "  |"
//  8: " _ ", "|_|", "|_|"
//  9: " _ ", "|_|", " _|"
//
// Output: 3 lines joined by '\n', each line being the concatenation of each digit's row.

fn to_lcd(number: &str) -> String {
    todo!("Implement to_lcd")
}

fn main() {
    println!("{}", to_lcd("1234567890"));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn single_zero() {
        assert_eq!(to_lcd("0"), " _ \n| |\n|_|");
    }

    #[test]
    fn single_one() {
        assert_eq!(to_lcd("1"), "   \n  |\n  |");
    }

    #[test]
    fn single_two() {
        assert_eq!(to_lcd("2"), " _ \n _|\n|_ ");
    }

    #[test]
    fn multi_digit() {
        let result = to_lcd("12");
        assert!(result.contains("  |"));
    }
}
