// TODO: Implement concurrent Christmas Delivery
//
// The Sleigh can hold presents. Multiple Elves work concurrently to add presents.
// Only one Elf can add a present at a time (use Mutex).
//
// Elf: has a name, adds N presents to the Sleigh
// Sleigh: holds a list of presents (String), shared via Arc<Mutex<Sleigh>>
//
// Implement:
// 1. Sleigh::new() -> Sleigh
// 2. Sleigh::add_present(&mut self, present: String)
// 3. Sleigh::present_count(&self) -> usize
// 4. run_delivery(elves: Vec<(&str, usize)>) -> usize  -- runs concurrently

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
        todo!("Add present to the sleigh")
    }

    pub fn present_count(&self) -> usize {
        todo!("Return number of presents")
    }
}

pub fn run_delivery(elves: Vec<(&str, usize)>) -> usize {
    todo!("Spawn one thread per elf, each elf adds its presents concurrently, return total count")
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
        // Run many times to catch race conditions
        for _ in 0..10 {
            let total = run_delivery(vec![("A", 100), ("B", 100), ("C", 100)]);
            assert_eq!(total, 300);
        }
    }
}
