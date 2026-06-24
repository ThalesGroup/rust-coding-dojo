mod grid;
mod life;

fn main() {
    let pattern = "........\n....*...\n...**...\n........\n";
    let grid = grid::Grid::from_pattern(pattern);
    println!("Generation 1:\n{}", grid);
    let next = life::next_generation(&grid);
    println!("Generation 2:\n{}", next);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn blinker_oscillates() {
        let pattern = ".....\n..*..\n..*..\n..*..\n.....\n";
        let grid = grid::Grid::from_pattern(pattern);
        let gen2 = life::next_generation(&grid);
        let gen3 = life::next_generation(&gen2);
        // Blinker should return to original after 2 generations
        for r in 0..grid.rows() {
            for c in 0..grid.cols() {
                assert_eq!(gen3.get(r, c), grid.get(r, c));
            }
        }
    }

    #[test]
    fn block_stays_stable() {
        let pattern = "....\n.**.\n.**.\n....\n";
        let grid = grid::Grid::from_pattern(pattern);
        let next = life::next_generation(&grid);
        for r in 0..grid.rows() {
            for c in 0..grid.cols() {
                assert_eq!(next.get(r, c), grid.get(r, c));
            }
        }
    }
}
