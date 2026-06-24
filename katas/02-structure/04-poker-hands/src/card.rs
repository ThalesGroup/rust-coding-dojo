// TODO: Implement Card and Suit types

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum Suit {
    Clubs,
    Diamonds,
    Hearts,
    Spades,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Card {
    pub value: u8, // 2..=14 (Ace = 14)
    pub suit: Suit,
}

impl Card {
    pub fn new(value: u8, suit: Suit) -> Self {
        todo!("Create a new card")
    }

    pub fn from_str(s: &str) -> Self {
        todo!("Parse a card like '2H', 'TD', 'JC', 'QH', 'KS', 'AD'")
    }
}

// Cards are ordered by value for sorting
impl PartialOrd for Card {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for Card {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        todo!("Compare cards by value")
    }
}
