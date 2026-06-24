// TODO: Implement berlin_clock(time: &str) -> String
// Input: "HH:MM:SS"
// Output: 5 rows separated by newline:
// Row 1: "Y" if seconds even, "O" if odd
// Row 2: 4 lamps, each = 5h (R if lit, O if not)
// Row 3: 4 lamps, each = 1h (R if lit, O if not)
// Row 4: 11 lamps, each = 5min (Y if lit, R at pos 3/6/9, O if not)
// Row 5: 4 lamps, each = 1min (Y if lit, O if not)

fn berlin_clock(time: &str) -> String {
    todo!("Implement Berlin Clock")
}

fn main() {
    println!("{}", berlin_clock("13:17:01"));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn midnight() {
        let result = berlin_clock("00:00:00");
        let rows: Vec<&str> = result.lines().collect();
        assert_eq!(rows[0], "Y"); // seconds even
        assert_eq!(rows[1], "OOOO");
        assert_eq!(rows[2], "OOOO");
        assert_eq!(rows[3], "OOOOOOOOOOO");
        assert_eq!(rows[4], "OOOO");
    }

    #[test]
    fn thirteen_seventeen_one() {
        let result = berlin_clock("13:17:01");
        let rows: Vec<&str> = result.lines().collect();
        assert_eq!(rows[0], "O"); // odd seconds
        assert_eq!(rows[1], "RROO"); // 13h -> 2*5h lit
        assert_eq!(rows[2], "RRRO"); // 13h -> 3*1h lit
        assert_eq!(rows[3], "YYROOOOOOOO"); // 17min -> 3*5min, pos 3 is R
        assert_eq!(rows[4], "YYOO"); // 17min -> 2*1min
    }
}
