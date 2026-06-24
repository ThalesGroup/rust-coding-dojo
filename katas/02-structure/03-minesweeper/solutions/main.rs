fn annotate(field: &[String]) -> Vec<String> {
    let rows = field.len();
    if rows == 0 {
        return vec![];
    }
    let cols = field[0].len();

    let mut result = Vec::new();

    for row in 0..rows {
        let mut new_row = String::new();
        for col in 0..cols {
            if field[row].as_bytes()[col] == b'*' {
                new_row.push('*');
            } else {
                let mut count = 0u8;
                for dr in [-1i32, 0, 1] {
                    for dc in [-1i32, 0, 1] {
                        if dr == 0 && dc == 0 {
                            continue;
                        }
                        let nr = row as i32 + dr;
                        let nc = col as i32 + dc;
                        if nr >= 0 && nr < rows as i32 && nc >= 0 && nc < cols as i32 {
                            if field[nr as usize].as_bytes()[nc as usize] == b'*' {
                                count += 1;
                            }
                        }
                    }
                }
                new_row.push((count + b'0') as char);
            }
        }
        result.push(new_row);
    }

    result
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
        let field = vec!["**...".to_string(), ".....".to_string(), ".*...".to_string()];
        let expected = vec!["**100".to_string(), "33200".to_string(), "1*100".to_string()];
        assert_eq!(annotate(&field), expected);
    }
}
