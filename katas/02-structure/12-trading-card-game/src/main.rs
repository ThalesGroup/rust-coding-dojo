// TODO: Implement a two-player Trading Card Game
//
// Player:
// - health: i32 (starts 30)
// - mana: u32 (current mana, starts 0)
// - mana_slots: u32 (max mana, starts 0, increases each turn up to 10)
// - hand: Vec<u32> (cards in hand)
// - deck: Vec<u32> (remaining deck)
//
// Game turn:
// 1. Active player gets +1 mana_slot (max 10)
// 2. Active player's mana refills to mana_slots
// 3. Active player draws a card:
//    - If deck empty: take 1 damage (Bleeding Out)
//    - If hand would exceed 5: discard drawn card (Overload)
// 4. Active player can play cards (spend mana, deal damage to opponent)
// 5. If opponent health <= 0: active player wins

#[derive(Debug, Clone)]
pub struct Player {
    pub health: i32,
    pub mana: u32,
    pub mana_slots: u32,
    pub hand: Vec<u32>,
    pub deck: Vec<u32>,
}

impl Player {
    pub fn new() -> Self {
        let deck = vec![0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 8];
        todo!("Shuffle deck and draw initial 3 cards")
    }

    pub fn draw(&mut self) {
        todo!("Draw one card, apply Bleeding Out and Overload rules")
    }

    pub fn start_turn(&mut self) {
        todo!("Increase mana slot (max 10), refill mana, draw card")
    }

    pub fn can_play(&self, card: u32) -> bool {
        todo!("Check if player has enough mana to play the card")
    }

    pub fn play_card(&mut self, card_index: usize) -> u32 {
        todo!("Remove card from hand, spend mana, return card cost (= damage dealt)")
    }
}

#[derive(Debug)]
pub enum GameResult {
    Player1Wins,
    Player2Wins,
    Ongoing,
}

#[derive(Debug)]
pub struct Game {
    pub player1: Player,
    pub player2: Player,
    pub active_player: u8, // 1 or 2
}

impl Game {
    pub fn new() -> Self {
        todo!("Create game with two players, active_player starts at 1")
    }

    pub fn check_winner(&self) -> GameResult {
        todo!("Return Player1Wins, Player2Wins, or Ongoing based on health values")
    }
}

fn main() {
    println!("See tests for game simulation");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn player_starts_with_30_health() {
        let p = Player::new();
        assert_eq!(p.health, 30);
    }

    #[test]
    fn player_starts_with_zero_mana() {
        let p = Player::new();
        assert_eq!(p.mana, 0);
        assert_eq!(p.mana_slots, 0);
    }

    #[test]
    fn player_starts_with_three_cards_in_hand() {
        let p = Player::new();
        assert_eq!(p.hand.len(), 3);
    }

    #[test]
    fn bleeding_out_damages_player() {
        let mut p = Player::new();
        p.deck.clear();
        let health_before = p.health;
        p.draw();
        assert_eq!(p.health, health_before - 1);
    }

    #[test]
    fn overload_discards_when_hand_full() {
        let mut p = Player::new();
        p.hand = vec![1, 2, 3, 4, 5]; // full hand (5 cards)
        p.deck = vec![3];
        let hand_size_before = p.hand.len();
        p.draw();
        assert_eq!(p.hand.len(), hand_size_before); // card discarded, size unchanged
    }

    #[test]
    fn playing_card_deals_damage() {
        let mut game = Game::new();
        game.player1.mana = 5;
        game.player1.hand = vec![3];
        let damage = game.player1.play_card(0);
        assert_eq!(damage, 3);
        assert_eq!(game.player1.mana, 2);
    }

    #[test]
    fn game_is_ongoing_at_start() {
        let game = Game::new();
        assert!(matches!(game.check_winner(), GameResult::Ongoing));
    }
}
