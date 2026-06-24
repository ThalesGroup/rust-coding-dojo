use crate::map::Map;

// TODO: Implement the Direction enum and Rover struct

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Direction {
    North,
    East,
    South,
    West,
}

impl Direction {
    pub fn turn_right(self) -> Self {
        todo!("Turn right 90 degrees")
    }

    pub fn turn_left(self) -> Self {
        todo!("Turn left 90 degrees")
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Position {
    pub x: i32,
    pub y: i32,
}

#[derive(Debug, Clone)]
pub struct Rover {
    pub position: Position,
    pub direction: Direction,
}

impl Rover {
    pub fn new(x: i32, y: i32, direction: Direction) -> Self {
        todo!("Create a new rover")
    }

    pub fn execute(&mut self, commands: &str, map: &Map) -> Vec<String> {
        todo!("Execute a sequence of commands. Return list of encountered obstacles.")
    }
}
