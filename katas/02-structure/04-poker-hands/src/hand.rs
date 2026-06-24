use crate::card::Card;

// TODO: Implement Hand ranking

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum HandRank {
    HighCard = 0,
    Pair = 1,
    TwoPairs = 2,
    ThreeOfAKind = 3,
    Straight = 4,
    Flush = 5,
    FullHouse = 6,
    FourOfAKind = 7,
    StraightFlush = 8,
}

#[derive(Debug, Clone)]
pub struct Hand {
    pub cards: Vec<Card>,
    pub rank: HandRank,
    // Tie-breaking values (e.g., pair values, high cards in order)
    pub tie_breakers: Vec<u8>,
}

impl Hand {
    pub fn from_cards(cards: Vec<Card>) -> Self {
        todo!("Evaluate a hand of 5 cards and determine its rank")
    }

    pub fn from_str(s: &str) -> Self {
        todo!("Parse a hand from a string like '2H 3D 5S 9C KD'")
    }
}
