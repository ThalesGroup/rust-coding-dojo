fn score(rolls: &[u32]) -> u32 {
    let mut total = 0;
    let mut roll_index = 0;

    for _frame in 0..10 {
        if rolls[roll_index] == 10 {
            // Strike
            total += 10 + rolls[roll_index + 1] + rolls[roll_index + 2];
            roll_index += 1;
        } else if rolls[roll_index] + rolls[roll_index + 1] == 10 {
            // Spare
            total += 10 + rolls[roll_index + 2];
            roll_index += 2;
        } else {
            // Open frame
            total += rolls[roll_index] + rolls[roll_index + 1];
            roll_index += 2;
        }
    }

    total
}

fn main() {
    let perfect: Vec<u32> = vec![10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
    println!("Perfect game score: {}", score(&perfect));

    let all_spares: Vec<u32> = vec![
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
    ];
    println!("All spares score: {}", score(&all_spares));

    let gutter: Vec<u32> = vec![0; 20];
    println!("Gutter game score: {}", score(&gutter));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_gutter_game() {
        assert_eq!(score(&vec![0; 20]), 0);
    }

    #[test]
    fn test_all_ones() {
        assert_eq!(score(&vec![1; 20]), 20);
    }

    #[test]
    fn test_one_spare() {
        let mut rolls = vec![5, 5, 3];
        rolls.extend(vec![0; 17]);
        assert_eq!(score(&rolls), 16);
    }

    #[test]
    fn test_one_strike() {
        let mut rolls = vec![10, 3, 4];
        rolls.extend(vec![0; 16]);
        assert_eq!(score(&rolls), 24);
    }

    #[test]
    fn test_perfect_game() {
        assert_eq!(score(&vec![10; 12]), 300);
    }
}
