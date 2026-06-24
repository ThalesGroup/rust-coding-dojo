fn score(dice: &[u32]) -> u32 {
    let mut counts = [0u32; 7];
    for &d in dice {
        if d >= 1 && d <= 6 {
            counts[d as usize] += 1;
        }
    }
    let mut total = 0;
    for face in 1u32..=6 {
        let c = counts[face as usize];
        if c >= 3 {
            let triple = if face == 1 { 1000 } else { face * 100 };
            total += triple * 2u32.pow(c - 3);
        } else {
            if face == 1 {
                total += c * 100;
            }
            if face == 5 {
                total += c * 50;
            }
        }
    }
    total
}

fn main() {
    println!("Score of [1,1,1,5,1]: {}", score(&[1, 1, 1, 5, 1]));
    println!("Score of [2,3,4,6,2]: {}", score(&[2, 3, 4, 6, 2]));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_dice() {
        assert_eq!(score(&[]), 0);
    }

    #[test]
    fn single_5() {
        assert_eq!(score(&[5]), 50);
    }

    #[test]
    fn single_1() {
        assert_eq!(score(&[1]), 100);
    }

    #[test]
    fn triple_1() {
        assert_eq!(score(&[1, 1, 1]), 1000);
    }

    #[test]
    fn triple_2() {
        assert_eq!(score(&[2, 2, 2]), 200);
    }

    #[test]
    fn triple_5() {
        assert_eq!(score(&[5, 5, 5]), 500);
    }

    #[test]
    fn mixed() {
        assert_eq!(score(&[1, 1, 1, 5, 1]), 1150);
    }

    #[test]
    fn no_score() {
        assert_eq!(score(&[2, 3, 4, 6]), 0);
    }
}
