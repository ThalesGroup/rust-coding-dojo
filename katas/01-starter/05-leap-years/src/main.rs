// TODO 1: Implement the is_leap_year function that takes a u32 year and returns a bool.
// Rules:
// - All years divisible by 400 ARE leap years
// - All years divisible by 100 but not by 400 are NOT leap years
// - All years divisible by 4 but not by 100 ARE leap years
// - All years not divisible by 4 are NOT leap years
fn is_leap_year(year: u32) -> bool {
    todo!("Implement is_leap_year")
}

fn main() {
    let test_years = [1900, 2000, 2004, 2008, 2012, 2016, 2020, 2024, 2100];
    for year in test_years {
        println!("{}: {}", year, if is_leap_year(year) { "leap year" } else { "not leap year" });
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn year_2000_is_leap() {
        assert!(is_leap_year(2000));
    }

    #[test]
    fn year_1700_is_not_leap() {
        assert!(!is_leap_year(1700));
    }

    #[test]
    fn year_2008_is_leap() {
        assert!(is_leap_year(2008));
    }

    #[test]
    fn year_2017_is_not_leap() {
        assert!(!is_leap_year(2017));
    }

    #[test]
    fn year_2100_is_not_leap() {
        assert!(!is_leap_year(2100));
    }
}
