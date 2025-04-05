pub struct RPNStack {
    lifo: Vec<f64>,
}

impl RPNStack {
    pub fn new() -> Self {
        RPNStack { lifo: Vec::new() }
    }

    pub fn length(&self) -> usize {
        self.lifo.len()
    }

    pub fn pop(&mut self) -> Option<f64> {
        self.lifo.pop()
    }

    pub fn push(&mut self, item: f64) {
        self.lifo.push(item)
    }

    pub fn clear(&mut self) {
        self.lifo.clear();
    }

    pub fn print_stack(&self) {
        println!("RPN LIFO:");
        for item in &self.lifo {
            println!("\t{}", item);
        }
        println!("");
    }
}
