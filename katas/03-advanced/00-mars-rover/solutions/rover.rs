use crate::map::Map;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
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
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
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
        Rover {
            position: Position { x, y },
            direction,
        }
    }

    pub fn execute(&mut self, commands: &str, map: &Map) -> Vec<String> {
        let mut obstacles = Vec::new();

        for cmd in commands.chars() {
            match cmd {
                'f' => {
                    let new_pos = self.forward_position();
                    if map.has_obstacle(&new_pos) {
                        obstacles.push(format!("Obstacle at ({}, {})", new_pos.x, new_pos.y));
                    } else {
                        self.position = new_pos;
                    }
                }
                'b' => {
                    let new_pos = self.backward_position();
                    if map.has_obstacle(&new_pos) {
                        obstacles.push(format!("Obstacle at ({}, {})", new_pos.x, new_pos.y));
                    } else {
                        self.position = new_pos;
                    }
                }
                'r' => self.direction = self.direction.turn_right(),
                'l' => self.direction = self.direction.turn_left(),
                _ => {}
            }
        }

        obstacles
    }

    fn forward_position(&self) -> Position {
        let mut pos = self.position.clone();
        match self.direction {
            Direction::North => pos.y += 1,
            Direction::East => pos.x += 1,
            Direction::South => pos.y -= 1,
            Direction::West => pos.x -= 1,
        }
        pos
    }

    fn backward_position(&self) -> Position {
        let mut pos = self.position.clone();
        match self.direction {
            Direction::North => pos.y -= 1,
            Direction::East => pos.x -= 1,
            Direction::South => pos.y += 1,
            Direction::West => pos.x += 1,
        }
        pos
    }
}
