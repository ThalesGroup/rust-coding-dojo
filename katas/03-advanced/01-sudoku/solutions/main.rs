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
        matches!(self, CellState::Known(_))
    }

    pub fn eliminate(&mut self, value: u8) -> bool {
        match self {
            CellState::Unknown(s) => {
                if !s.remove(&value) {
                    return false;
                }
                if s.is_empty() {
                    *self = CellState::Contradiction;
                } else if s.len() == 1 {
                    let v = *s.iter().next().unwrap();
                    *self = CellState::Known(v);
                }
                true
            }
            _ => false,
        }
    }
}

fn peers(idx: usize) -> Vec<usize> {
    let row = idx / 9;
    let col = idx % 9;
    let box_r = (row / 3) * 3;
    let box_c = (col / 3) * 3;
    let mut p: HashSet<usize> = HashSet::new();
    for c in 0..9 {
        p.insert(row * 9 + c);
    }
    for r in 0..9 {
        p.insert(r * 9 + col);
    }
    for dr in 0..3 {
        for dc in 0..3 {
            p.insert((box_r + dr) * 9 + (box_c + dc));
        }
    }
    p.remove(&idx);
    p.into_iter().collect()
}

#[derive(Debug, Clone)]
pub struct Board {
    pub cells: Vec<CellState>,
}

impl Board {
    pub fn new() -> Self {
        Board {
            cells: (0..81).map(|_| CellState::new()).collect(),
        }
    }

    pub fn from_string(s: &str) -> Self {
        let mut b = Board::new();
        for (i, c) in s.chars().enumerate().take(81) {
            if let Some(d) = c.to_digit(10) {
                if d >= 1 {
                    b.set(i / 9, i % 9, d as u8);
                }
            }
        }
        b
    }

    pub fn set(&mut self, row: usize, col: usize, value: u8) {
        let idx = row * 9 + col;
        self.cells[idx] = CellState::Known(value);
        let peer_list = peers(idx);
        for p in peer_list {
            self.cells[p].eliminate(value);
        }
    }

    pub fn is_solved(&self) -> bool {
        self.cells.iter().all(|c| c.is_solved())
    }

    pub fn has_contradiction(&self) -> bool {
        self.cells.iter().any(|c| matches!(c, CellState::Contradiction))
    }

    pub fn solve(&self) -> Option<Board> {
        if self.has_contradiction() {
            return None;
        }
        if self.is_solved() {
            return Some(self.clone());
        }
        // Find cell with fewest possibilities (minimum remaining values heuristic)
        let (idx, _) = self
            .cells
            .iter()
            .enumerate()
            .filter_map(|(i, c)| {
                if let CellState::Unknown(s) = c {
                    Some((i, s.len()))
                } else {
                    None
                }
            })
            .min_by_key(|&(_, len)| len)?;

        let possibilities = if let CellState::Unknown(s) = &self.cells[idx] {
            s.clone()
        } else {
            return None;
        };

        for &v in &possibilities {
            let mut b = self.clone();
            b.set(idx / 9, idx % 9, v);
            if let Some(sol) = b.solve() {
                return Some(sol);
            }
        }
        None
    }
}

fn main() {
    let puzzle = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79";
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
        match CellState::new() {
            CellState::Unknown(s) => assert_eq!(s.len(), 9),
            _ => panic!("Expected Unknown"),
        }
    }

    #[test]
    fn eliminate_reduces_possibilities() {
        let mut c = CellState::new();
        c.eliminate(5);
        match &c {
            CellState::Unknown(s) => assert!(!s.contains(&5)),
            _ => panic!("Expected Unknown"),
        }
    }

    #[test]
    fn eliminate_all_but_one_gives_known() {
        let mut c = CellState::new();
        for v in 1..=8 {
            c.eliminate(v);
        }
        match c {
            CellState::Known(v) => assert_eq!(v, 9),
            _ => panic!("Expected Known(9)"),
        }
    }

    #[test]
    fn solve_simple_puzzle() {
        let puzzle = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79";
        let sol = Board::from_string(puzzle).solve();
        assert!(sol.is_some());
        assert!(sol.unwrap().is_solved());
    }
}
