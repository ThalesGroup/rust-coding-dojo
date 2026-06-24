pub struct Tennis {
    player1_points: u32,
    player2_points: u32,
}

impl Tennis {
    pub fn new() -> Self {
        Tennis {
            player1_points: 0,
            player2_points: 0,
        }
    }

    pub fn point_won(&mut self, player: &str) {
        match player {
            "player1" => self.player1_points += 1,
            "player2" => self.player2_points += 1,
            _ => {}
        }
    }

    pub fn score(&self) -> String {
        let score_names = ["love", "15", "30", "40"];

        if self.player1_points >= 4 || self.player2_points >= 4 {
            let diff = self.player1_points as i32 - self.player2_points as i32;
            match diff {
                0 => "deuce".to_string(),
                1 => "advantage player1".to_string(),
                -1 => "advantage player2".to_string(),
                d if d >= 2 => "player1 wins".to_string(),
                _ => "player2 wins".to_string(),
            }
        } else if self.player1_points == 3 && self.player2_points == 3 {
            "deuce".to_string()
        } else {
            format!(
                "{} - {}",
                score_names[self.player1_points as usize],
                score_names[self.player2_points as usize]
            )
        }
    }
}

fn main() {
    let mut game = Tennis::new();
    game.point_won("player1");
    println!("{}", game.score());
    game.point_won("player2");
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
