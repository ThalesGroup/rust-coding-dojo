// TODO: Implement Langton's Ant simulation
//
// Rules:
// - White square: turn right 90°, flip to black, move 1 forward
// - Black square: turn left 90°, flip to white, move 1 forward
//
// Direction: North, East, South, West

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
        todo!("Turn 90° clockwise")
    }

    pub fn turn_left(self) -> Self {
        todo!("Turn 90° counter-clockwise")
    }

    pub fn delta(self) -> (i32, i32) {
        todo!("Return (dx, dy) for this direction")
    }
}

#[derive(Debug, Clone)]
pub struct Ant {
    pub x: i32,
    pub y: i32,
    pub direction: Direction,
}

// Grid: set of black cells (white = absent)
#[derive(Debug, Clone, Default)]
pub struct Grid {
    pub black_cells: HashSet<(i32, i32)>,
}

impl Grid {
    pub fn is_black(&self, x: i32, y: i32) -> bool {
        todo!()
    }

    pub fn flip(&mut self, x: i32, y: i32) {
        todo!("Toggle cell color")
    }
}

pub fn step(ant: &mut Ant, grid: &mut Grid) {
    todo!("Apply one step of Langton's Ant rules")
}

pub fn simulate(steps: usize) -> (Ant, Grid) {
    todo!("Run simulation for given number of steps")
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
        let mut ant = Ant { x: 0, y: 0, direction: Direction::North };
        let mut grid = Grid::default();
        step(&mut ant, &mut grid);
        assert_eq!(ant.direction, Direction::East);
        assert!(grid.is_black(0, 0));
        assert_eq!((ant.x, ant.y), (1, 0));
    }

    #[test]
    fn second_step_on_white_from_east_turns_south() {
        let mut ant = Ant { x: 0, y: 0, direction: Direction::North };
        let mut grid = Grid::default();
        // First step: (0,0) white -> turn right (East), flip (0,0) black, move to (1,0)
        step(&mut ant, &mut grid);
        // Second step: (1,0) white -> turn right (South), flip (1,0) black, move to (1,-1)
        step(&mut ant, &mut grid);
        assert_eq!(ant.direction, Direction::South);
        assert!(grid.is_black(1, 0));
    }

    #[test]
    fn after_many_steps_creates_pattern() {
        let (_, grid) = simulate(10000);
        // After 10000 steps, the "highway" pattern has begun
        assert!(grid.black_cells.len() > 100);
    }
}
