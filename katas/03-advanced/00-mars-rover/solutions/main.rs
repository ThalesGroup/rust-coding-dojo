mod map;
mod rover;

fn main() {
    let mut m = map::Map::new(10, 10);
    m.add_obstacle(2, 2);
    m.add_obstacle(3, 5);

    let mut r = rover::Rover::new(0, 0, rover::Direction::North);
    let obstacles = r.execute("rfflff", &m);

    println!("Final position: ({}, {}), direction: {:?}", r.position.x, r.position.y, r.direction);
    if !obstacles.is_empty() {
        println!("Obstacles encountered: {:?}", obstacles);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn move_forward_north() {
        let map = map::Map::new(10, 10);
        let mut rover = rover::Rover::new(0, 0, rover::Direction::North);
        rover.execute("f", &map);
        assert_eq!(rover.position, rover::Position { x: 0, y: 1 });
    }

    #[test]
    fn turn_right() {
        let map = map::Map::new(10, 10);
        let mut rover = rover::Rover::new(0, 0, rover::Direction::North);
        rover.execute("r", &map);
        assert_eq!(rover.direction, rover::Direction::East);
    }

    #[test]
    fn turn_left() {
        let map = map::Map::new(10, 10);
        let mut rover = rover::Rover::new(0, 0, rover::Direction::North);
        rover.execute("l", &map);
        assert_eq!(rover.direction, rover::Direction::West);
    }

    #[test]
    fn avoid_obstacle() {
        let mut map = map::Map::new(10, 10);
        map.add_obstacle(0, 1);
        let mut rover = rover::Rover::new(0, 0, rover::Direction::North);
        let obstacles = rover.execute("f", &map);
        assert_eq!(rover.position, rover::Position { x: 0, y: 0 });
        assert_eq!(obstacles.len(), 1);
    }

    #[test]
    fn complex_path() {
        let map = map::Map::new(10, 10);
        let mut rover = rover::Rover::new(0, 0, rover::Direction::North);
        rover.execute("rfflff", &map);
        assert_eq!(rover.position, rover::Position { x: 2, y: 2 });
        assert_eq!(rover.direction, rover::Direction::North);
    }
}
