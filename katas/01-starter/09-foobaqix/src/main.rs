// TODO 1: Implement compute(n: u32) -> String
// Rules:
// - If n is divisible by 3, append "Foo"
// - If n is divisible by 5, append "Bar"
// - If n is divisible by 7, append "Qix"
// - For each digit 3 in n, append "Foo"
// - For each digit 5 in n, append "Bar"
// - For each digit 7 in n, append "Qix"
// - If none of the above applies, return n as string
// Examples: 3 -> "FooFoo", 5 -> "BarBar", 15 -> "FooBarBar", 33 -> "FooFooFoo"

fn compute(n: u32) -> String {
    todo!("Implement compute")
}

fn main() {
    for i in 1..=20 {
        println!("{} => {}", i, compute(i));
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_1_returns_1() {
        assert_eq!(compute(1), "1");
    }

    #[test]
    fn test_3_returns_foofoo() {
        assert_eq!(compute(3), "FooFoo");
    }

    #[test]
    fn test_5_returns_barbar() {
        assert_eq!(compute(5), "BarBar");
    }

    #[test]
    fn test_7_returns_qixqix() {
        assert_eq!(compute(7), "QixQix");
    }

    #[test]
    fn test_15_returns_foobarbar() {
        assert_eq!(compute(15), "FooBarBar");
    }

    #[test]
    fn test_21_returns_fooqix() {
        assert_eq!(compute(21), "FooQix");
    }

    #[test]
    fn test_33_returns_foofoofoo() {
        assert_eq!(compute(33), "FooFooFoo");
    }
}
