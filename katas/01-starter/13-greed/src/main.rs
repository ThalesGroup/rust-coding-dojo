// TODO: Implement score(dice: &[u32]) -> u32
// Scoring rules:
// - Single 1  = 100
// - Single 5  = 50
// - Triple 1s = 1000
// - Triple ns (n != 1) = n * 100
// - Four/five/six of a kind = triple score * 2^(count - 3)
// Examples:
//   [1, 1, 1, 5, 1] -> 1150   (triple 1 = 1000, one extra 1 = 100, one 5 = 50)
//   [2, 3, 4, 6, 2] -> 0

fn score(dice: &[u32]) -> u32 {
    todo!("Implement score")
}

fn main() {
    println!("Score of [1,1,1,5,1]: {}", score(&[1, 1, 1, 5, 1]));
    println!("Score of [2,3,4,6,2]: {}", score(&[2, 3, 4, 6, 2]));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_dice() {
        assert_eq!(score(&[]), 0);
    }

    #[test]
    fn single_5() {
        assert_eq!(score(&[5]), 50);
    }

    #[test]
    fn single_1() {
        assert_eq!(score(&[1]), 100);
    }

    #[test]
    fn triple_1() {
        assert_eq!(score(&[1, 1, 1]), 1000);
    }

    #[test]
    fn triple_2() {
        assert_eq!(score(&[2, 2, 2]), 200);
    }

    #[test]
    fn triple_5() {
        assert_eq!(score(&[5, 5, 5]), 500);
    }

    #[test]
    fn mixed() {
        assert_eq!(score(&[1, 1, 1, 5, 1]), 1150);
    }

    #[test]
    fn no_score() {
        assert_eq!(score(&[2, 3, 4, 6]), 0);
    }
}
