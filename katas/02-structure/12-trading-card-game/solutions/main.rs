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
        let deck = vec![0u32, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 8];
        let mut p = Player {
            health: 30,
            mana: 0,
            mana_slots: 0,
            hand: vec![],
            deck,
        };
        // Draw initial 3 cards (no shuffle for determinism in tests)
        for _ in 0..3 {
            p.draw_initial();
        }
        p
    }

    fn draw_initial(&mut self) {
        if let Some(card) = self.deck.pop() {
            if self.hand.len() < 5 {
                self.hand.push(card);
            }
        }
    }

    pub fn draw(&mut self) {
        if self.deck.is_empty() {
            // Bleeding Out: no card to draw, take 1 damage
            self.health -= 1;
        } else {
            let card = self.deck.pop().unwrap();
            if self.hand.len() < 5 {
                self.hand.push(card);
            }
            // else: Overload — card exceeds hand limit and is discarded
        }
    }

    pub fn start_turn(&mut self) {
        self.mana_slots = (self.mana_slots + 1).min(10);
        self.mana = self.mana_slots;
        self.draw();
    }

    pub fn can_play(&self, card: u32) -> bool {
        self.mana >= card
    }

    pub fn play_card(&mut self, card_index: usize) -> u32 {
        let card = self.hand.remove(card_index);
        self.mana -= card;
        card // card cost = damage dealt to opponent
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
    pub active_player: u8,
}

impl Game {
    pub fn new() -> Self {
        Game {
            player1: Player::new(),
            player2: Player::new(),
            active_player: 1,
        }
    }

    pub fn check_winner(&self) -> GameResult {
        if self.player1.health <= 0 {
            GameResult::Player2Wins
        } else if self.player2.health <= 0 {
            GameResult::Player1Wins
        } else {
            GameResult::Ongoing
        }
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
        assert_eq!(Player::new().health, 30);
    }

    #[test]
    fn player_starts_with_zero_mana() {
        let p = Player::new();
        assert_eq!(p.mana, 0);
        assert_eq!(p.mana_slots, 0);
    }

    #[test]
    fn player_starts_with_three_cards_in_hand() {
        assert_eq!(Player::new().hand.len(), 3);
    }

    #[test]
    fn bleeding_out_damages_player() {
        let mut p = Player::new();
        p.deck.clear();
        let h = p.health;
        p.draw();
        assert_eq!(p.health, h - 1);
    }

    #[test]
    fn overload_discards_when_hand_full() {
        let mut p = Player::new();
        p.hand = vec![1, 2, 3, 4, 5];
        p.deck = vec![3];
        let sz = p.hand.len();
        p.draw();
        assert_eq!(p.hand.len(), sz);
    }

    #[test]
    fn playing_card_deals_damage() {
        let mut game = Game::new();
        game.player1.mana = 5;
        game.player1.hand = vec![3];
        let dmg = game.player1.play_card(0);
        assert_eq!(dmg, 3);
        assert_eq!(game.player1.mana, 2);
    }

    #[test]
    fn game_is_ongoing_at_start() {
        let game = Game::new();
        assert!(matches!(game.check_winner(), GameResult::Ongoing));
    }
}
