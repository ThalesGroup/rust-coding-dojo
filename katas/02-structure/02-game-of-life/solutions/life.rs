use crate::grid::Grid;

pub fn next_generation(grid: &Grid) -> Grid {
    let mut next = Grid::new(grid.rows(), grid.cols());

    for row in 0..grid.rows() {
        for col in 0..grid.cols() {
            let neighbours = grid.count_neighbours(row, col);
            let alive = match (grid.get(row, col), neighbours) {
                (true, n) if n < 2 => false,
                (true, n) if n > 3 => false,
                (true, _) => true,
                (false, 3) => true,
                _ => false,
            };
            next.set(row, col, alive);
        }
    }

    next
}
