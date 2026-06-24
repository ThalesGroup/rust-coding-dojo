use crate::rover::Position;
use std::collections::HashSet;

#[derive(Debug, Clone)]
pub struct Map {
    pub width: i32,
    pub height: i32,
    pub obstacles: HashSet<Position>,
}

impl Map {
    pub fn new(width: i32, height: i32) -> Self {
        Map {
            width,
            height,
            obstacles: HashSet::new(),
        }
    }

    pub fn add_obstacle(&mut self, x: i32, y: i32) {
        self.obstacles.insert(Position { x, y });
    }

    pub fn has_obstacle(&self, position: &Position) -> bool {
        self.obstacles.contains(position)
    }
}
