use crate::rover::Position;
use std::collections::HashSet;

// TODO: Implement the Map

#[derive(Debug, Clone)]
pub struct Map {
    pub width: i32,
    pub height: i32,
    pub obstacles: HashSet<Position>,
}

impl Map {
    pub fn new(width: i32, height: i32) -> Self {
        todo!("Create a new map")
    }

    pub fn add_obstacle(&mut self, x: i32, y: i32) {
        todo!("Add an obstacle")
    }

    pub fn has_obstacle(&self, position: &Position) -> bool {
        todo!("Check if position has an obstacle")
    }

    pub fn from_pattern(pattern: &str) -> Self {
        todo!("Parse a map pattern. '.' for empty, '#' for obstacle, '^'/'v'/'<'/'>' for rover start")
    }
}
