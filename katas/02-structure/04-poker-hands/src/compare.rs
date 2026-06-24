use crate::hand::Hand;

// TODO: Compare two poker hands

#[derive(Debug, PartialEq, Eq)]
pub enum Winner {
    Black,
    White,
    Tie,
}

pub fn compare(black: &Hand, white: &Hand) -> Winner {
    todo!("Compare two hands and return the winner")
}

pub fn describe_winner(black: &Hand, white: &Hand) -> String {
    todo!("Return a human-readable description of the result")
}
