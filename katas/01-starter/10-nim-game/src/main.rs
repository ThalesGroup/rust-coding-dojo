// TODO 1: Implement nim_winner(sticks: u32) -> &'static str
// Rules:
// - Players alternate turns, each removes 1, 2, or 3 sticks
// - The player who takes the LAST stick LOSES
// - Return which player wins with optimal play ("Player 1" or "Player 2")
// Hint: Think about multiples of 4 — what happens when the pile is exactly 1?

fn nim_winner(sticks: u32) -> &'static str {
    todo!("Implement nim_winner")
}

fn main() {
    for s in 1..=15 {
        println!("{} sticks -> {} wins", s, nim_winner(s));
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn one_stick_player1_loses() {
        assert_eq!(nim_winner(1), "Player 2");
    }

    #[test]
    fn two_sticks_player1_wins() {
        assert_eq!(nim_winner(2), "Player 1");
    }

    #[test]
    fn four_sticks_player1_loses() {
        assert_eq!(nim_winner(4), "Player 1");
    }

    #[test]
    fn five_sticks_player2_wins() {
        assert_eq!(nim_winner(5), "Player 2");
    }

    #[test]
    fn ten_sticks() {
        assert_eq!(nim_winner(10), "Player 1");
    }
}
