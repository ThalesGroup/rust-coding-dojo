#[derive(Debug)]
struct Person {
    name: &str // error: expected lifetime parameter
}

fn main() {
    let alice = Person { name: "Alice" };

    println!("alice: {:?}", alice);
}