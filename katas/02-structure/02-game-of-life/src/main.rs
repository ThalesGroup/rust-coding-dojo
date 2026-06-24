mod grid;
mod life;

fn main() {
    let pattern = "........\n....*...\n...**...\n........\n";
    let grid = grid::Grid::from_pattern(pattern);
    println!("Generation 1:\n{}", grid);
    let next = life::next_generation(&grid);
    println!("Generation 2:\n{}", next);
}
