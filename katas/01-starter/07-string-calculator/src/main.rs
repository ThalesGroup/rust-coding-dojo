// TODO 1: Implement the add function that takes a string of comma-separated numbers and returns their sum as a Result.
// Steps to implement:
// - Handle empty string (return 0)
// - Handle 1 or 2 numbers separated by comma
// - Handle unknown number of numbers
// - Handle newlines as separators
// - Handle custom delimiter: "//[delimiter]\n[numbers]"
// - Reject negative numbers: return Err with message listing all negative numbers found

fn add(numbers: &str) -> Result<i32, String> {
    todo!("Implement the string calculator add function")
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
