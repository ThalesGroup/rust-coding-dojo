mod card;
mod hand;
mod compare;

fn main() {
    let tests = [
        "Black: 2H 3D 5S 9C KD  White: 2C 3H 4S 8C AH",
        "Black: 2H 4S 4C 2D 4H  White: 2S 8S AS QS 3S",
        "Black: 2H 3D 5S 9C KD  White: 2C 3H 4S 8C KH",
        "Black: 2H 3D 5S 9C KD  White: 2D 3H 5C 9S KH",
    ];

    for test in tests {
        let parts: Vec<&str> = test.split("  ").collect();
        let black_str = parts[0].strip_prefix("Black: ").unwrap();
        let white_str = parts[1].strip_prefix("White: ").unwrap();

        let black = hand::Hand::from_str(black_str);
        let white = hand::Hand::from_str(white_str);
        println!("{}", compare::describe_winner(&black, &white));
    }
}
