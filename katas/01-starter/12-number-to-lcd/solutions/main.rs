fn to_lcd(number: &str) -> String {
    let digits = [
        [" _ ", "| |", "|_|"], // 0
        ["   ", "  |", "  |"], // 1
        [" _ ", " _|", "|_ "], // 2
        [" _ ", " _|", " _|"], // 3
        ["   ", "|_|", "  |"], // 4
        [" _ ", "|_ ", " _|"], // 5
        [" _ ", "|_ ", "|_|"], // 6
        [" _ ", "  |", "  |"], // 7
        [" _ ", "|_|", "|_|"], // 8
        [" _ ", "|_|", " _|"], // 9
    ];
    let nums: Vec<usize> = number
        .chars()
        .filter_map(|c| c.to_digit(10).map(|d| d as usize))
        .collect();
    (0..3)
        .map(|row| {
            nums.iter()
                .map(|&d| digits[d][row])
                .collect::<Vec<_>>()
                .join("")
        })
        .collect::<Vec<_>>()
        .join("\n")
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
