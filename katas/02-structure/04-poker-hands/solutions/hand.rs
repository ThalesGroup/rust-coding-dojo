use crate::card::{Card, Suit};
use std::collections::HashMap;

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
    pub tie_breakers: Vec<u8>,
}

impl Hand {
    pub fn from_cards(mut cards: Vec<Card>) -> Self {
        cards.sort_by(|a, b| b.cmp(a));

        let is_flush = cards.windows(2).all(|w| w[0].suit == w[1].suit);
        let is_straight = cards.windows(2).all(|w| w[0].value == w[1].value + 1)
            || (cards.iter().map(|c| c.value).collect::<Vec<_>>() == vec![14, 5, 4, 3, 2]);

        let mut counts: HashMap<u8, u8> = HashMap::new();
        for card in &cards {
            *counts.entry(card.value).or_insert(0) += 1;
        }
        let mut freq: Vec<(u8, u8)> = counts.into_iter().map(|(v, c)| (c, v)).collect();
        freq.sort_by(|a, b| b.0.cmp(&a.0).then(b.1.cmp(&a.1)));

        let (rank, tie_breakers) = if is_flush && is_straight {
            let high = if cards.iter().map(|c| c.value).collect::<Vec<_>>() == vec![14, 5, 4, 3, 2] { 5 } else { cards[0].value };
            (HandRank::StraightFlush, vec![high])
        } else if freq[0].0 == 4 {
            (HandRank::FourOfAKind, vec![freq[0].1, freq[1].1])
        } else if freq[0].0 == 3 && freq[1].0 == 2 {
            (HandRank::FullHouse, vec![freq[0].1, freq[1].1])
        } else if is_flush {
            let values: Vec<u8> = cards.iter().map(|c| c.value).collect();
            (HandRank::Flush, values)
        } else if is_straight {
            let high = if cards.iter().map(|c| c.value).collect::<Vec<_>>() == vec![14, 5, 4, 3, 2] { 5 } else { cards[0].value };
            (HandRank::Straight, vec![high])
        } else if freq[0].0 == 3 {
            let kickers: Vec<u8> = freq.iter().skip(1).map(|(_, v)| *v).collect();
            let mut tb = vec![freq[0].1];
            tb.extend(kickers);
            (HandRank::ThreeOfAKind, tb)
        } else if freq[0].0 == 2 && freq[1].0 == 2 {
            let kicker = freq[2].1;
            let mut tb = vec![freq[0].1.max(freq[1].1), freq[0].1.min(freq[1].1), kicker];
            (HandRank::TwoPairs, tb)
        } else if freq[0].0 == 2 {
            let kickers: Vec<u8> = freq.iter().skip(1).map(|(_, v)| *v).collect();
            let mut tb = vec![freq[0].1];
            tb.extend(kickers);
            (HandRank::Pair, tb)
        } else {
            let values: Vec<u8> = cards.iter().map(|c| c.value).collect();
            (HandRank::HighCard, values)
        };

        Hand { cards, rank, tie_breakers }
    }

    pub fn from_str(s: &str) -> Self {
        let cards: Vec<Card> = s.split_whitespace().map(Card::from_str).collect();
        Hand::from_cards(cards)
    }
}
