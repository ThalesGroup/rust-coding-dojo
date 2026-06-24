// A game of bowling consists of 10 frames.
// Each roll knocks down 0-10 pins.
// Each element in the `rolls` vector represents one roll.

// TODO 1: Implement the score function that calculates the total score from a list of rolls.
// - Spare: 10 + next roll bonus
// - Strike: 10 + next two rolls bonus
// - Otherwise: sum of two rolls in the frame

fn score(rolls: &[u32]) -> u32 {
    todo!("Implement the bowling score calculation")
}

fn main() {
    // Perfect game: 12 strikes = 300
    let perfect: Vec<u32> = vec![10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
    println!("Perfect game score: {}", score(&perfect));

    // All spares with 5: 21 rolls = 150
    let all_spares: Vec<u32> = vec![
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
    ];
    println!("All spares score: {}", score(&all_spares));

    // All gutter balls: 20 rolls of 0 = 0
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
        // 5,5(spare) + 3,0... = 10+3 + 3 = 16 for first two frames
        let mut rolls = vec![5, 5, 3];
        rolls.extend(vec![0; 17]);
        assert_eq!(score(&rolls), 16);
    }

    #[test]
    fn test_one_strike() {
        // 10(strike) + 3,4 = 10+3+4 + 3+4 = 24
        let mut rolls = vec![10, 3, 4];
        rolls.extend(vec![0; 16]);
        assert_eq!(score(&rolls), 24);
    }

    #[test]
    fn test_perfect_game() {
        assert_eq!(score(&vec![10; 12]), 300);
    }
}
