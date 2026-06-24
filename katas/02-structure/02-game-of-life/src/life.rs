use crate::grid::Grid;

// TODO: Implement the next_generation function.
// Rules:
// 1. Live cell with < 2 live neighbours -> dies
// 2. Live cell with > 3 live neighbours -> dies
// 3. Live cell with 2 or 3 live neighbours -> lives
// 4. Dead cell with exactly 3 live neighbours -> becomes alive

pub fn next_generation(grid: &Grid) -> Grid {
    todo!("Compute the next generation")
}
