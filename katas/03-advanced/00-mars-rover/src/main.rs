mod map;
mod rover;

fn main() {
    let mut m = map::Map::new(10, 10);
    m.add_obstacle(2, 2);
    m.add_obstacle(3, 5);

    let mut r = rover::Rover::new(0, 0, rover::Direction::North);
    let obstacles = r.execute("rfflff", &m);

    println!(
        "Final position: ({}, {}), direction: {:?}",
        r.position.x, r.position.y, r.direction
    );
    if !obstacles.is_empty() {
        println!("Obstacles encountered: {:?}", obstacles);
    }
}
