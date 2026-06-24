#[derive(Debug, Clone, Copy)]
pub enum Category {
    Ones,
    Twos,
    Threes,
    Fours,
    Fives,
    Sixes,
    Pair,
    TwoPairs,
    ThreeOfAKind,
    FourOfAKind,
    SmallStraight,
    LargeStraight,
    FullHouse,
    Chance,
    Yahtzee,
}

pub fn score(dice: &[u32; 5], category: Category) -> u32 {
    let mut counts = [0u32; 7];
    for &d in dice {
        if d <= 6 {
            counts[d as usize] += 1;
        }
    }

    match category {
        Category::Ones => counts[1] * 1,
        Category::Twos => counts[2] * 2,
        Category::Threes => counts[3] * 3,
        Category::Fours => counts[4] * 4,
        Category::Fives => counts[5] * 5,
        Category::Sixes => counts[6] * 6,
        Category::Chance => dice.iter().sum(),
        Category::Yahtzee => {
            if counts.iter().any(|&c| c == 5) {
                50
            } else {
                0
            }
        }
        Category::Pair => (1..=6)
            .rev()
            .find(|&f| counts[f] >= 2)
            .map(|f| f as u32 * 2)
            .unwrap_or(0),
        Category::TwoPairs => {
            let pairs: Vec<u32> = (1..=6)
                .rev()
                .filter(|&f| counts[f] >= 2)
                .map(|f| f as u32)
                .collect();
            if pairs.len() >= 2 {
                pairs[0] * 2 + pairs[1] * 2
            } else {
                0
            }
        }
        Category::ThreeOfAKind => (1..=6)
            .find(|&f| counts[f] >= 3)
            .map(|f| f as u32 * 3)
            .unwrap_or(0),
        Category::FourOfAKind => (1..=6)
            .find(|&f| counts[f] >= 4)
            .map(|f| f as u32 * 4)
            .unwrap_or(0),
        Category::SmallStraight => {
            if counts[1..=5].iter().all(|&c| c >= 1) {
                15
            } else {
                0
            }
        }
        Category::LargeStraight => {
            if counts[2..=6].iter().all(|&c| c >= 1) {
                20
            } else {
                0
            }
        }
        Category::FullHouse => {
            let has_three = (1..=6).any(|f| counts[f] == 3);
            let has_two = (1..=6).any(|f| counts[f] == 2);
            if has_three && has_two {
                dice.iter().sum()
            } else {
                0
            }
        }
    }
}

fn main() {
    println!(
        "Large straight: {}",
        score(&[2, 3, 4, 5, 6], Category::LargeStraight)
    );
    println!(
        "Three of a kind: {}",
        score(&[1, 1, 1, 3, 1], Category::ThreeOfAKind)
    );
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ones_counts_ones() {
        assert_eq!(score(&[1, 1, 2, 3, 4], Category::Ones), 2);
    }
    #[test]
    fn pair_returns_highest_pair() {
        assert_eq!(score(&[3, 3, 5, 5, 2], Category::Pair), 10);
    }
    #[test]
    fn two_pairs() {
        assert_eq!(score(&[3, 3, 5, 5, 2], Category::TwoPairs), 16);
    }
    #[test]
    fn three_of_a_kind() {
        assert_eq!(score(&[3, 3, 3, 2, 1], Category::ThreeOfAKind), 9);
    }
    #[test]
    fn four_of_a_kind() {
        assert_eq!(score(&[3, 3, 3, 3, 1], Category::FourOfAKind), 12);
    }
    #[test]
    fn small_straight() {
        assert_eq!(score(&[1, 2, 3, 4, 5], Category::SmallStraight), 15);
    }
    #[test]
    fn large_straight() {
        assert_eq!(score(&[2, 3, 4, 5, 6], Category::LargeStraight), 20);
    }
    #[test]
    fn full_house() {
        assert_eq!(score(&[3, 3, 3, 2, 2], Category::FullHouse), 13);
    }
    #[test]
    fn yahtzee() {
        assert_eq!(score(&[4, 4, 4, 4, 4], Category::Yahtzee), 50);
    }
    #[test]
    fn chance() {
        assert_eq!(score(&[1, 2, 3, 4, 5], Category::Chance), 15);
    }
}
