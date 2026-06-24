// TODO: Implement the Yahtzee scoring system
// Categories: Ones, Twos, ..., Sixes = sum of matching dice
// Pair = sum of highest pair, TwoPairs = sum of two pairs
// ThreeOfAKind = sum of three matching, FourOfAKind = sum of four matching
// SmallStraight = 1+2+3+4+5 = 15, LargeStraight = 2+3+4+5+6 = 20
// FullHouse = sum of all dice (3+2 matching), Chance = sum of all dice
// Yahtzee = 50 (all five dice same)

#[derive(Debug, Clone, Copy)]
pub enum Category {
    Ones, Twos, Threes, Fours, Fives, Sixes,
    Pair, TwoPairs, ThreeOfAKind, FourOfAKind,
    SmallStraight, LargeStraight, FullHouse,
    Chance, Yahtzee,
}

pub fn score(dice: &[u32; 5], category: Category) -> u32 {
    todo!("Implement score for each category")
}

fn main() {
    let dice = [2, 3, 4, 5, 6];
    println!("Large straight: {}", score(&dice, Category::LargeStraight));
    let dice2 = [1, 1, 2, 3, 1];
    println!("Three of a kind: {}", score(&dice2, Category::ThreeOfAKind));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ones_counts_ones() { assert_eq!(score(&[1, 1, 2, 3, 4], Category::Ones), 2); }
    #[test]
    fn pair_returns_highest_pair() { assert_eq!(score(&[3, 3, 5, 5, 2], Category::Pair), 10); }
    #[test]
    fn two_pairs() { assert_eq!(score(&[3, 3, 5, 5, 2], Category::TwoPairs), 16); }
    #[test]
    fn three_of_a_kind() { assert_eq!(score(&[3, 3, 3, 2, 1], Category::ThreeOfAKind), 9); }
    #[test]
    fn four_of_a_kind() { assert_eq!(score(&[3, 3, 3, 3, 1], Category::FourOfAKind), 12); }
    #[test]
    fn small_straight() { assert_eq!(score(&[1, 2, 3, 4, 5], Category::SmallStraight), 15); }
    #[test]
    fn large_straight() { assert_eq!(score(&[2, 3, 4, 5, 6], Category::LargeStraight), 20); }
    #[test]
    fn full_house() { assert_eq!(score(&[3, 3, 3, 2, 2], Category::FullHouse), 13); }
    #[test]
    fn yahtzee() { assert_eq!(score(&[4, 4, 4, 4, 4], Category::Yahtzee), 50); }
    #[test]
    fn chance() { assert_eq!(score(&[1, 2, 3, 4, 5], Category::Chance), 15); }
}
