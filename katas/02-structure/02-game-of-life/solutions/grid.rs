pub struct Grid {
    cells: Vec<Vec<bool>>,
    rows: usize,
    cols: usize,
}

impl Grid {
    pub fn new(rows: usize, cols: usize) -> Self {
        Grid {
            cells: vec![vec![false; cols]; rows],
            rows,
            cols,
        }
    }

    pub fn from_pattern(pattern: &str) -> Self {
        let lines: Vec<&str> = pattern.trim().lines().collect();
        let rows = lines.len();
        let cols = lines[0].len();
        let mut grid = Grid::new(rows, cols);
        for (r, line) in lines.iter().enumerate() {
            for (c, ch) in line.chars().enumerate() {
                grid.set(r, c, ch == '*');
            }
        }
        grid
    }

    pub fn rows(&self) -> usize {
        self.rows
    }

    pub fn cols(&self) -> usize {
        self.cols
    }

    pub fn get(&self, row: usize, col: usize) -> bool {
        self.cells[row][col]
    }

    pub fn set(&mut self, row: usize, col: usize, alive: bool) {
        self.cells[row][col] = alive;
    }

    pub fn count_neighbours(&self, row: usize, col: usize) -> u32 {
        let mut count = 0;
        for dr in [-1i32, 0, 1] {
            for dc in [-1i32, 0, 1] {
                if dr == 0 && dc == 0 {
                    continue;
                }
                let nr = row as i32 + dr;
                let nc = col as i32 + dc;
                if nr >= 0 && nr < self.rows as i32 && nc >= 0 && nc < self.cols as i32 {
                    if self.get(nr as usize, nc as usize) {
                        count += 1;
                    }
                }
            }
        }
        count
    }
}

impl std::fmt::Display for Grid {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        for row in 0..self.rows {
            for col in 0..self.cols {
                write!(f, "{}", if self.get(row, col) { '*' } else { '.' })?;
            }
            writeln!(f)?;
        }
        Ok(())
    }
}
