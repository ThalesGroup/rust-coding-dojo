// TODO: Implement a Sudoku solver using constraint propagation
//
// Cell rules:
// - A Cell expresses which of the numbers 1..9 are possible
// - By default, all numbers (1..9) are possible
// - If exactly one number is possible, the cell value is known
// - If no number is possible, there is a contradiction (impossible state)
//
// Board:
// - 9x9 grid of cells
// - When a cell's value becomes known, eliminate that value from all peers
//   (same row, column, and 3x3 box)
//
// Solver:
// - Try to solve by pure constraint propagation first
// - If stuck, use backtracking: pick an unsolved cell, try each possible value

use std::collections::HashSet;

#[derive(Debug, Clone)]
pub enum CellState {
    Known(u8),
    Unknown(HashSet<u8>),
    Contradiction,
}

impl CellState {
    pub fn new() -> Self {
        CellState::Unknown((1..=9).collect())
    }

    pub fn is_solved(&self) -> bool {
        todo!("Return true if Known")
    }

    pub fn eliminate(&mut self, value: u8) -> bool {
        todo!("Remove value from possibilities, return true if state changed")
    }
}

#[derive(Debug, Clone)]
pub struct Board {
    pub cells: Vec<CellState>, // 81 cells, row-major
}

impl Board {
    pub fn new() -> Self {
        todo!("Create empty board (all cells unknown)")
    }

    pub fn from_string(s: &str) -> Self {
        todo!("Parse 81-char string: '.' or '0' = unknown, '1'-'9' = given")
    }

    pub fn set(&mut self, row: usize, col: usize, value: u8) {
        todo!("Set cell and propagate constraint to peers")
    }

    pub fn is_solved(&self) -> bool {
        todo!("True if all cells are Known")
    }

    pub fn solve(&self) -> Option<Board> {
        todo!("Solve using constraint propagation + backtracking")
    }
}

fn main() {
    let puzzle =
        "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79";
    let board = Board::from_string(puzzle);
    if let Some(solution) = board.solve() {
        println!("Solved!");
        for row in 0..9 {
            let line: String = (0..9)
                .map(|col| match &solution.cells[row * 9 + col] {
                    CellState::Known(v) => v.to_string(),
                    _ => ".".to_string(),
                })
                .collect();
            println!("{}", line);
        }
    } else {
        println!("No solution found");
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_cell_has_9_possibilities() {
        let cell = CellState::new();
        match cell {
            CellState::Unknown(s) => assert_eq!(s.len(), 9),
            _ => panic!("Expected Unknown"),
        }
    }

    #[test]
    fn eliminate_reduces_possibilities() {
        let mut cell = CellState::new();
        cell.eliminate(5);
        match &cell {
            CellState::Unknown(s) => assert!(!s.contains(&5)),
            _ => panic!("Expected Unknown"),
        }
    }

    #[test]
    fn eliminate_all_but_one_gives_known() {
        let mut cell = CellState::new();
        for v in 1..=8 {
            cell.eliminate(v);
        }
        match cell {
            CellState::Known(v) => assert_eq!(v, 9),
            _ => panic!("Expected Known(9)"),
        }
    }

    #[test]
    fn solve_simple_puzzle() {
        let puzzle =
            "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79";
        let board = Board::from_string(puzzle);
        let solution = board.solve();
        assert!(solution.is_some());
        assert!(solution.unwrap().is_solved());
    }
}
