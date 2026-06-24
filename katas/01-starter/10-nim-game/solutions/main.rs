fn nim_winner(sticks: u32) -> &'static str {
    // With the "last stick loses" rule and max 3 sticks per turn:
    // Positions divisible by (max_take + 1) = 4 are losing for the current player.
    // sticks % 4 == 1 means the current player is forced to take 1,
    // leaving a multiple of 4 for the opponent -> they lose.
    if sticks % 4 == 1 {
        "Player 2"
    } else {
        "Player 1"
    }
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
