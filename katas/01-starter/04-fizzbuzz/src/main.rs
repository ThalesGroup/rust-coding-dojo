// TODO 1: Implement the fizz_buzz function that takes a u32 and returns a String.
// - For multiples of 3, return "Fizz"
// - For multiples of 5, return "Buzz"  
// - For multiples of both 3 and 5, return "FizzBuzz"
// - Otherwise, return the number as a string
fn fizz_buzz(n: u32) -> String {
    todo!("Implement fizz_buzz")
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
