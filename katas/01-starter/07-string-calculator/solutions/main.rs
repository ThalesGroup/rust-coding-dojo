fn add(numbers: &str) -> Result<i32, String> {
    if numbers.is_empty() {
        return Ok(0);
    }

    let (delimiter, rest) = if numbers.starts_with("//") {
        let parts: Vec<&str> = numbers.splitn(2, '\n').collect();
        let delim = &parts[0][2..];
        (delim.to_string(), parts[1].to_string())
    } else {
        (",".to_string(), numbers.to_string())
    };

    let normalized = rest.replace('\n', &delimiter);
    let parts: Vec<&str> = normalized.split(&delimiter).collect();

    let mut sum = 0;
    let mut negatives = Vec::new();

    for part in parts {
        if part.is_empty() {
            continue;
        }
        let num: i32 = part
            .parse()
            .map_err(|_| format!("Invalid number: {}", part))?;
        if num < 0 {
            negatives.push(num);
        }
        sum += num;
    }

    if !negatives.is_empty() {
        let neg_list: Vec<String> = negatives.iter().map(|n| n.to_string()).collect();
        return Err(format!("Negative not allowed : {}", neg_list.join(", ")));
    }

    Ok(sum)
}

fn main() {
    let test_cases = [
        "",
        "1",
        "1,2",
        "1,2,3,4,5",
        "1\n2,3",
        "//;\n1;2",
        "//|\n1|2|3",
    ];

    for input in test_cases {
        match add(input) {
            Ok(sum) => println!("add(\"{}\") = {}", input, sum),
            Err(e) => println!("add(\"{}\") = Error: {}", input, e),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_string_returns_zero() {
        assert_eq!(add(""), Ok(0));
    }

    #[test]
    fn single_number_returns_itself() {
        assert_eq!(add("1"), Ok(1));
    }

    #[test]
    fn two_numbers_comma_separated() {
        assert_eq!(add("1,2"), Ok(3));
    }

    #[test]
    fn multiple_numbers() {
        assert_eq!(add("1,2,3,4,5"), Ok(15));
    }

    #[test]
    fn newline_as_separator() {
        assert_eq!(add("1\n2,3"), Ok(6));
    }

    #[test]
    fn custom_delimiter() {
        assert_eq!(add("//;\n1;2"), Ok(3));
    }

    #[test]
    fn negative_number_is_rejected() {
        assert!(add("-1,2").is_err());
    }

    #[test]
    fn multiple_negatives_listed_in_error() {
        let result = add("2,-4,-5");
        assert!(result.is_err());
        let err = result.unwrap_err();
        assert!(err.contains("-4"));
        assert!(err.contains("-5"));
    }
}
