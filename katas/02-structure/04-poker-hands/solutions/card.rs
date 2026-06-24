#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum Suit {
    Clubs,
    Diamonds,
    Hearts,
    Spades,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Card {
    pub value: u8,
    pub suit: Suit,
}

impl Card {
    pub fn new(value: u8, suit: Suit) -> Self {
        Card { value, suit }
    }

    pub fn from_str(s: &str) -> Self {
        let bytes = s.as_bytes();
        let value = match bytes[0] {
            b'2'..=b'9' => bytes[0] - b'0',
            b'T' => 10,
            b'J' => 11,
            b'Q' => 12,
            b'K' => 13,
            b'A' => 14,
            _ => panic!("Invalid card value: {}", s),
        };
        let suit = match bytes[1] {
            b'C' => Suit::Clubs,
            b'D' => Suit::Diamonds,
            b'H' => Suit::Hearts,
            b'S' => Suit::Spades,
            _ => panic!("Invalid suit: {}", s),
        };
        Card { value, suit }
    }
}

impl PartialOrd for Card {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for Card {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        self.value.cmp(&other.value)
    }
}
