use std::collections::HashSet;

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Direction {
    North,
    East,
    South,
    West,
}

impl Direction {
    pub fn turn_right(self) -> Self {
        match self {
            Direction::North => Direction::East,
            Direction::East => Direction::South,
            Direction::South => Direction::West,
            Direction::West => Direction::North,
        }
    }

    pub fn turn_left(self) -> Self {
        match self {
            Direction::North => Direction::West,
            Direction::West => Direction::South,
            Direction::South => Direction::East,
            Direction::East => Direction::North,
        }
    }

    pub fn delta(self) -> (i32, i32) {
        match self {
            Direction::North => (0, 1),
            Direction::East => (1, 0),
            Direction::South => (0, -1),
            Direction::West => (-1, 0),
        }
    }
}

#[derive(Debug, Clone)]
pub struct Ant {
    pub x: i32,
    pub y: i32,
    pub direction: Direction,
}

#[derive(Debug, Clone, Default)]
pub struct Grid {
    pub black_cells: HashSet<(i32, i32)>,
}

impl Grid {
    pub fn is_black(&self, x: i32, y: i32) -> bool {
        self.black_cells.contains(&(x, y))
    }

    pub fn flip(&mut self, x: i32, y: i32) {
        if !self.black_cells.remove(&(x, y)) {
            self.black_cells.insert((x, y));
        }
    }
}

pub fn step(ant: &mut Ant, grid: &mut Grid) {
    if grid.is_black(ant.x, ant.y) {
        ant.direction = ant.direction.turn_left();
    } else {
        ant.direction = ant.direction.turn_right();
    }
    grid.flip(ant.x, ant.y);
    let (dx, dy) = ant.direction.delta();
    ant.x += dx;
    ant.y += dy;
}

pub fn simulate(steps: usize) -> (Ant, Grid) {
    let mut ant = Ant {
        x: 0,
        y: 0,
        direction: Direction::North,
    };
    let mut grid = Grid::default();
    for _ in 0..steps {
        step(&mut ant, &mut grid);
    }
    (ant, grid)
}

fn main() {
    let (ant, grid) = simulate(100);
    println!(
        "After 100 steps: ant at ({}, {}), {} black cells",
        ant.x,
        ant.y,
        grid.black_cells.len()
    );
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn first_step_on_white_turns_right() {
        let mut ant = Ant {
            x: 0,
            y: 0,
            direction: Direction::North,
        };
        let mut grid = Grid::default();
        step(&mut ant, &mut grid);
        assert_eq!(ant.direction, Direction::East);
        assert!(grid.is_black(0, 0));
        assert_eq!((ant.x, ant.y), (1, 0));
    }

    #[test]
    fn second_step_on_white_from_east_turns_south() {
        let mut ant = Ant {
            x: 0,
            y: 0,
            direction: Direction::North,
        };
        let mut grid = Grid::default();
        step(&mut ant, &mut grid);
        step(&mut ant, &mut grid);
        assert_eq!(ant.direction, Direction::South);
        assert!(grid.is_black(1, 0));
    }

    #[test]
    fn after_many_steps_creates_pattern() {
        let (_, grid) = simulate(10000);
        assert!(grid.black_cells.len() > 100);
    }
}
