use std::sync::{Arc, Mutex};
use std::thread;

#[derive(Debug, Default)]
pub struct Sleigh {
    presents: Vec<String>,
}

impl Sleigh {
    pub fn new() -> Self {
        Default::default()
    }

    pub fn add_present(&mut self, present: String) {
        self.presents.push(present);
    }

    pub fn present_count(&self) -> usize {
        self.presents.len()
    }
}

pub fn run_delivery(elves: Vec<(&str, usize)>) -> usize {
    let sleigh = Arc::new(Mutex::new(Sleigh::new()));

    let handles: Vec<_> = elves
        .into_iter()
        .map(|(name, count)| {
            let sleigh = Arc::clone(&sleigh);
            let name = name.to_string();
            thread::spawn(move || {
                for i in 0..count {
                    let present = format!("Present from {} #{}", name, i + 1);
                    sleigh.lock().unwrap().add_present(present);
                }
            })
        })
        .collect();

    for h in handles { h.join().unwrap(); }
    let count = sleigh.lock().unwrap().present_count();
    count
}

fn main() {
    let elves = vec![
        ("Rudolph", 10),
        ("Dasher", 15),
        ("Comet", 20),
        ("Blitzen", 5),
    ];
    let total = run_delivery(elves);
    println!("Total presents on sleigh: {}", total);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn single_elf_adds_presents() {
        let total = run_delivery(vec![("Alice", 5)]);
        assert_eq!(total, 5);
    }

    #[test]
    fn multiple_elves_add_concurrently() {
        let total = run_delivery(vec![("A", 10), ("B", 20), ("C", 30)]);
        assert_eq!(total, 60);
    }

    #[test]
    fn no_elves_empty_sleigh() {
        let total = run_delivery(vec![]);
        assert_eq!(total, 0);
    }

    #[test]
    fn concurrent_adds_are_safe() {
        for _ in 0..10 {
            let total = run_delivery(vec![("A", 100), ("B", 100), ("C", 100)]);
            assert_eq!(total, 300);
        }
    }
}
