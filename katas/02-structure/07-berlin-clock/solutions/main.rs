fn berlin_clock(time: &str) -> String {
    let parts: Vec<u32> = time.split(':').map(|s| s.parse().unwrap()).collect();
    let (h, m, s) = (parts[0], parts[1], parts[2]);

    let row1 = if s % 2 == 0 { "Y" } else { "O" };

    let row2: String = (0..4).map(|i| if i < h / 5 { 'R' } else { 'O' }).collect();
    let row3: String = (0..4).map(|i| if i < h % 5 { 'R' } else { 'O' }).collect();

    let row4: String = (1..=11).map(|i| {
        if i <= m / 5 {
            if i % 3 == 0 { 'R' } else { 'Y' }
        } else {
            'O'
        }
    }).collect();

    let row5: String = (0..4).map(|i| if i < m % 5 { 'Y' } else { 'O' }).collect();

    format!("{}\n{}\n{}\n{}\n{}", row1, row2, row3, row4, row5)
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
        assert_eq!(rows[0], "Y");
        assert_eq!(rows[1], "OOOO");
        assert_eq!(rows[2], "OOOO");
        assert_eq!(rows[3], "OOOOOOOOOOO");
        assert_eq!(rows[4], "OOOO");
    }

    #[test]
    fn thirteen_seventeen_one() {
        let result = berlin_clock("13:17:01");
        let rows: Vec<&str> = result.lines().collect();
        assert_eq!(rows[0], "O");
        assert_eq!(rows[1], "RROO");
        assert_eq!(rows[2], "RRRO");
        assert_eq!(rows[3], "YYROOOOOOOO");
        assert_eq!(rows[4], "YYOO");
    }
}
