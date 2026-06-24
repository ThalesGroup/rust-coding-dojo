use crate::hand::{Hand, HandRank};
use std::cmp::Ordering;

#[derive(Debug, PartialEq, Eq)]
pub enum Winner {
    Black,
    White,
    Tie,
}

pub fn compare(black: &Hand, white: &Hand) -> Winner {
    let rank_cmp = (black.rank as u8).cmp(&(white.rank as u8));
    match rank_cmp {
        Ordering::Greater => Winner::Black,
        Ordering::Less => Winner::White,
        Ordering::Equal => {
            for (b, w) in black.tie_breakers.iter().zip(white.tie_breakers.iter()) {
                match b.cmp(w) {
                    Ordering::Greater => return Winner::Black,
                    Ordering::Less => return Winner::White,
                    Ordering::Equal => continue,
                }
            }
            Winner::Tie
        }
    }
}

pub fn describe_winner(black: &Hand, white: &Hand) -> String {
    let result = compare(black, white);
    let rank_names = [
        "high card", "pair", "two pairs", "three of a kind",
        "straight", "flush", "full house", "four of a kind", "straight flush",
    ];
    match result {
        Winner::Black => format!("Black wins. - with {}: {:?}", rank_names[black.rank as usize], black.tie_breakers),
        Winner::White => format!("White wins. - with {}: {:?}", rank_names[white.rank as usize], white.tie_breakers),
        Winner::Tie => "Tie.".to_string(),
    }
}
