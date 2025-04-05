fn longest(x: &str, y: &str) -> &str {
    if x.bytes().len() > y.bytes().len() {
        x
    } else {
        y
    }
}

fn main() {
    let alice = "Alice";
    let bob = "Bob";

    println!("{}", longest(alice, bob));
}