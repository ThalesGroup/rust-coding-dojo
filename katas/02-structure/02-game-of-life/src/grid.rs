// TODO: Implement the Grid structure for Conway's Game of Life.
// The grid is a 2D vector of booleans (true = alive, false = dead).
// Implement:
// - new(rows: usize, cols: usize) -> creates an empty grid
// - from_pattern(pattern: &str) -> parses a string pattern (* for alive, . for dead)
// - count_neighbours(row: usize, col: usize) -> counts live neighbours (max 8)
// - get(row: usize, col: usize) -> returns cell state
// - set(row: usize, col: usize, alive: bool) -> sets cell state
// - rows() and cols() -> dimensions

pub struct Grid {
    // TODO: Add fields
}

impl Grid {
    pub fn new(rows: usize, cols: usize) -> Self {
        todo!("Create a new empty grid")
    }

    pub fn from_pattern(pattern: &str) -> Self {
        todo!("Parse pattern (* for alive, . for dead)")
    }

    pub fn rows(&self) -> usize {
        todo!("Return number of rows")
    }

    pub fn cols(&self) -> usize {
        todo!("Return number of columns")
    }

    pub fn get(&self, row: usize, col: usize) -> bool {
        todo!("Get cell state")
    }

    pub fn set(&mut self, row: usize, col: usize, alive: bool) {
        todo!("Set cell state")
    }

    pub fn count_neighbours(&self, row: usize, col: usize) -> u32 {
        todo!("Count live neighbours")
    }
}

impl std::fmt::Display for Grid {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        todo!("Display the grid (* for alive, . for dead)")
    }
}
