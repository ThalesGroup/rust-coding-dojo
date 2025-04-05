use std::fmt::{Display, Formatter, Result};

pub struct Roman {
    value: String,
}

impl Display for Roman {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        write!(f, "{}", self.value)
    }
}

impl From<u32> for Roman {
    fn from(mut num: u32) -> Self {
        if num == 0 {
            panic!("There is no zero (0) in the Roman numeral system!");
        }
        // num > 0
        let mut value = String::new();
        while num > 0 {
            // Let's find the next roman num string to append, and its integer value (to subtract from num before the next iteration)
            let appended_str_and_int_val = match num {
                1..=3 => ("I", 1),
                4 => ("IV", 4),
                5..=8 => ("V", 5),
                9 => ("IX", 9),
                10..=39 => ("X", 10),
                40..=49 => ("XL", 40),
                50..=89 => ("L", 50),
                90..=99 => ("XC", 90),
                100..=399 => ("C", 100),
                400..=499 => ("CD", 400),
                500..=899 => ("D", 500),
                900..=999 => ("CM", 900),
                // default case: 1000 and above
                _ => ("M", 1000),
            };

            value += appended_str_and_int_val.0;
            num -= appended_str_and_int_val.1;
        }
        // If we had used a different variable name, say "val", instead of "value" which happens to be the same as the Roman struct field's, the final expression would be "Roman { value: val }" instead of "Roman { value }".
        Roman { value }
    }
}

// Some examples to run
fn main() {
    println!("{}", Roman::from(3994));
    println!("{}", Roman::from(3004));
    println!("{}", Roman::from(304));
    println!("{}", Roman::from(1));
    println!("{}", Roman::from(17));
    println!("{}", Roman::from(101));
    println!("{}", Roman::from(121));
    println!("{}", Roman::from(49));
}

// Unit tests
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn number_1_is_i() {
        let input = 1;
        let output = Roman::from(input).to_string();
        let expected = "I";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_2_is_ii() {
        let input = 2;
        let output = Roman::from(input).to_string();
        let expected = "II";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_3_is_iii() {
        let input = 3;
        let output = Roman::from(input).to_string();
        let expected = "III";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_4_is_iv() {
        let input = 4;
        let output = Roman::from(input).to_string();
        let expected = "IV";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_5_is_v() {
        let input = 5;
        let output = Roman::from(input).to_string();
        let expected = "V";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_6_is_vi() {
        let input = 6;
        let output = Roman::from(input).to_string();
        let expected = "VI";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_9_is_ix() {
        let input = 9;
        let output = Roman::from(input).to_string();
        let expected = "IX";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_16_is_xvi() {
        let input = 16;
        let output = Roman::from(input).to_string();
        let expected = "XVI";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_27_is_xxvii() {
        let input = 27;
        let output = Roman::from(input).to_string();
        let expected = "XXVII";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_48_is_xlviii() {
        let input = 48;
        let output = Roman::from(input).to_string();
        let expected = "XLVIII";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_49_is_xlix() {
        let input = 49;
        let output = Roman::from(input).to_string();
        let expected = "XLIX";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_59_is_lix() {
        let input = 59;
        let output = Roman::from(input).to_string();
        let expected = "LIX";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_66_is_lxvi() {
        let input = 66;
        let output = Roman::from(input).to_string();
        let expected = "LXVI";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_93_is_xciii() {
        let input = 93;
        let output = Roman::from(input).to_string();
        let expected = "XCIII";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_141_is_cxli() {
        let input = 141;
        let output = Roman::from(input).to_string();
        let expected = "CXLI";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_163_is_clxiii() {
        let input = 163;
        let output = Roman::from(input).to_string();
        let expected = "CLXIII";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_166_is_clxvi() {
        let input = 166;
        let output = Roman::from(input).to_string();
        let expected = "CLXVI";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_402_is_cdii() {
        let input = 402;
        let output = Roman::from(input).to_string();
        let expected = "CDII";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_575_is_dlxxv() {
        let input = 575;
        let output = Roman::from(input).to_string();
        let expected = "DLXXV";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_666_is_dclxvi() {
        let input = 666;
        let output = Roman::from(input).to_string();
        let expected = "DCLXVI";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_911_is_cmxi() {
        let input = 911;
        let output = Roman::from(input).to_string();
        let expected = "CMXI";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_1024_is_mxxiv() {
        let input = 1024;
        let output = Roman::from(input).to_string();
        let expected = "MXXIV";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_1666_is_mdclxvi() {
        let input = 1666;
        let output = Roman::from(input).to_string();
        let expected = "MDCLXVI";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_3000_is_mmm() {
        let input = 3000;
        let output = Roman::from(input).to_string();
        let expected = "MMM";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_3001_is_mmmi() {
        let input = 3001;
        let output = Roman::from(input).to_string();
        let expected = "MMMI";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_3888_is_mmmdccclxxxviii() {
        let input = 3888;
        let output = Roman::from(input).to_string();
        let expected = "MMMDCCCLXXXVIII";
        assert_eq!(output, expected);
    }

    #[test]
    fn number_3999_is_mmmcmxcix() {
        let input = 3999;
        let output = Roman::from(input).to_string();
        let expected = "MMMCMXCIX";
        assert_eq!(output, expected);
    }

    #[test]
    #[should_panic]
    fn number_0_is_invalid() {
        let input = 0;
        let output = Roman::from(input).to_string();
        println!("Wrong output: {} (Should have failed because the input (0) is invalid.)", output);
    }
}
