fn fizz_buzz(n: u32) -> String {
    match (n % 3, n % 5) {
        (0, 0) => "FizzBuzz".to_string(),
        (0, _) => "Fizz".to_string(),
        (_, 0) => "Buzz".to_string(),
        _ => n.to_string(),
    }
}

fn main() {
    for i in 1..=100 {
        println!("{}", fizz_buzz(i));
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_1_returns_1() {
        assert_eq!(fizz_buzz(1), "1");
    }

    #[test]
    fn test_3_returns_fizz() {
        assert_eq!(fizz_buzz(3), "Fizz");
    }

    #[test]
    fn test_5_returns_buzz() {
        assert_eq!(fizz_buzz(5), "Buzz");
    }

    #[test]
    fn test_15_returns_fizzbuzz() {
        assert_eq!(fizz_buzz(15), "FizzBuzz");
    }

    #[test]
    fn test_30_returns_fizzbuzz() {
        assert_eq!(fizz_buzz(30), "FizzBuzz");
    }
}
