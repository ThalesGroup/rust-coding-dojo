struct Container {
    str: String
}

impl Drop for Container {
    fn drop(&mut self) {
        println!("I'm destroyed");
    }
}

fn consume(str_consumed: Container) {
    println!("{}", str_consumed.str);
}

fn main() {
    let str_1 = String::from("string");

    let container = Container {
        str: str_1
    };

    println!("Before function call");
    consume(container);
    println!("End of main scope");
}