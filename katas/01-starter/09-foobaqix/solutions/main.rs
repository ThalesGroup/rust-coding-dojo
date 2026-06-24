fn compute(n: u32) -> String {
    let div_part = {
        let mut s = String::new();
        if n % 3 == 0 { s.push_str("Foo"); }
        if n % 5 == 0 { s.push_str("Bar"); }
        if n % 7 == 0 { s.push_str("Qix"); }
        s
    };

    let digit_part: String = n.to_string().chars().map(|c| match c {
        '3' => "Foo",
        '5' => "Bar",
        '7' => "Qix",
        _   => "",
    }).collect();

    let result = format!("{}{}", div_part, digit_part);
    if result.is_empty() { n.to_string() } else { result }
}

fn main() {
    for i in 1..=20 {
        println!("{} => {}", i, compute(i));
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test] fn test_1_returns_1() { assert_eq!(compute(1), "1"); }
    #[test] fn test_3_returns_foofoo() { assert_eq!(compute(3), "FooFoo"); }
    #[test] fn test_5_returns_barbar() { assert_eq!(compute(5), "BarBar"); }
    #[test] fn test_7_returns_qixqix() { assert_eq!(compute(7), "QixQix"); }
    #[test] fn test_15_returns_foobarbar() { assert_eq!(compute(15), "FooBarBar"); }
    #[test] fn test_21_returns_fooqix() { assert_eq!(compute(21), "FooQix"); }
    #[test] fn test_33_returns_foofoofoo() { assert_eq!(compute(33), "FooFooFoo"); }
}
