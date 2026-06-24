// TODO 1: Implement the Tennis struct and its methods.
// - new() creates a game with both players at 0
// - point_won(player: &str) records a point for "player1" or "player2"
// - score() returns the current score as a String:
//   - "love - love", "15 - love", "15 - 15", "30 - 15", etc.
//   - "deuce" when both have 40
//   - "advantage player1" or "advantage player2"
//   - "player1 wins" or "player2 wins"

pub struct Tennis {
    // TODO: Add fields
}

impl Tennis {
    pub fn new() -> Self {
        todo!("Create a new tennis game")
    }

    pub fn point_won(&mut self, player: &str) {
        todo!("Record a point for the given player")
    }

    pub fn score(&self) -> String {
        todo!("Return the current score")
    }
}

fn main() {
    let mut game = Tennis::new();
    game.point_won("player1");
    println!("{}", game.score());
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn new_game_score_is_love_all() {
        let game = Tennis::new();
        assert_eq!(game.score(), "love - love");
    }

    #[test]
    fn player1_scores_first_point() {
        let mut game = Tennis::new();
        game.point_won("player1");
        assert_eq!(game.score(), "15 - love");
    }

    #[test]
    fn deuce_when_both_have_40() {
        let mut game = Tennis::new();
        for _ in 0..3 {
            game.point_won("player1");
            game.point_won("player2");
        }
        assert_eq!(game.score(), "deuce");
    }

    #[test]
    fn advantage_after_deuce() {
        let mut game = Tennis::new();
        for _ in 0..3 {
            game.point_won("player1");
            game.point_won("player2");
        }
        game.point_won("player1");
        assert_eq!(game.score(), "advantage player1");
    }

    #[test]
    fn win_after_advantage() {
        let mut game = Tennis::new();
        for _ in 0..3 {
            game.point_won("player1");
            game.point_won("player2");
        }
        game.point_won("player1");
        game.point_won("player1");
        assert_eq!(game.score(), "player1 wins");
    }

    #[test]
    fn back_to_deuce_after_losing_advantage() {
        let mut game = Tennis::new();
        for _ in 0..3 {
            game.point_won("player1");
            game.point_won("player2");
        }
        game.point_won("player1");
        game.point_won("player2");
        assert_eq!(game.score(), "deuce");
    }
}
