// TODO: Implement the annotate function that takes a minefield (Vec<&str> or Vec<String>)
// and returns the annotated field where each safe square '.' is replaced by a digit
// indicating the number of adjacent mines.
//
// Example:
// Input:  ["*...", "....", ".*..", "...."]
// Output: ["*100", "2210", "1*10", "1110"]
//
// Each square can have at most 8 adjacent squares.

fn annotate(field: &[String]) -> Vec<String> {
    todo!("Implement the minesweeper annotate function")
}

fn main() {
    let field = vec![
        "*...".to_string(),
        "....".to_string(),
        ".*..".to_string(),
        "....".to_string(),
    ];
    let result = annotate(&field);
    for line in result {
        println!("{}", line);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn no_mines() {
        let field = vec!["...".to_string(), "...".to_string(), "...".to_string()];
        let expected = vec!["000".to_string(), "000".to_string(), "000".to_string()];
        assert_eq!(annotate(&field), expected);
    }

    #[test]
    fn single_mine_in_center() {
        let field = vec!["...".to_string(), ".*.".to_string(), "...".to_string()];
        let expected = vec!["111".to_string(), "1*1".to_string(), "111".to_string()];
        assert_eq!(annotate(&field), expected);
    }

    #[test]
    fn field_from_kata_description() {
        let field = vec![
            "*...".to_string(),
            "....".to_string(),
            ".*..".to_string(),
            "....".to_string(),
        ];
        let expected = vec![
            "*100".to_string(),
            "2210".to_string(),
            "1*10".to_string(),
            "1110".to_string(),
        ];
        assert_eq!(annotate(&field), expected);
    }

    #[test]
    fn multiple_mines() {
        let field = vec![
            "**...".to_string(),
            ".....".to_string(),
            ".*...".to_string(),
        ];
        let expected = vec![
            "**100".to_string(),
            "33200".to_string(),
            "1*100".to_string(),
        ];
        assert_eq!(annotate(&field), expected);
    }
}
