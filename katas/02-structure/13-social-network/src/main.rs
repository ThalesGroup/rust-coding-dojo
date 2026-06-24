// TODO: Implement a simple social network
//
// Commands:
// - post(user, message): user publishes a message
// - read(user) -> Vec<String>: returns user's messages (newest first)
// - follow(user, other): user subscribes to other's messages
// - wall(user) -> Vec<String>: returns user's messages + all followed users' messages (newest first)

use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct Post {
    pub author: String,
    pub message: String,
    pub timestamp: u64, // monotonically increasing counter
}

#[derive(Debug, Default)]
pub struct SocialNetwork {
    posts: Vec<Post>,
    following: HashMap<String, Vec<String>>,
    clock: u64,
}

impl SocialNetwork {
    pub fn new() -> Self {
        Default::default()
    }

    pub fn post(&mut self, user: &str, message: &str) {
        todo!("Store message for user with an incremented timestamp")
    }

    pub fn read(&self, user: &str) -> Vec<String> {
        todo!("Return user's messages ordered newest first")
    }

    pub fn follow(&mut self, user: &str, other: &str) {
        todo!("Register that user subscribes to other's messages")
    }

    pub fn wall(&self, user: &str) -> Vec<String> {
        todo!("Return user's own messages + all followed users' messages, newest first")
    }
}

fn main() {
    println!("See tests");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn post_and_read() {
        let mut sn = SocialNetwork::new();
        sn.post("Alice", "Hello world");
        let msgs = sn.read("Alice");
        assert_eq!(msgs, vec!["Hello world"]);
    }

    #[test]
    fn read_empty_user() {
        let sn = SocialNetwork::new();
        assert!(sn.read("Alice").is_empty());
    }

    #[test]
    fn read_returns_newest_first() {
        let mut sn = SocialNetwork::new();
        sn.post("Alice", "first");
        sn.post("Alice", "second");
        assert_eq!(sn.read("Alice"), vec!["second", "first"]);
    }

    #[test]
    fn wall_includes_own_messages() {
        let mut sn = SocialNetwork::new();
        sn.post("Alice", "Alice post");
        let wall = sn.wall("Alice");
        assert!(wall.contains(&"Alice post".to_string()));
    }

    #[test]
    fn wall_includes_followed() {
        let mut sn = SocialNetwork::new();
        sn.post("Bob", "Bob post");
        sn.post("Alice", "Alice post");
        sn.follow("Charlie", "Alice");
        sn.follow("Charlie", "Bob");
        sn.post("Charlie", "Charlie post");
        let wall = sn.wall("Charlie");
        assert!(wall.contains(&"Alice post".to_string()));
        assert!(wall.contains(&"Bob post".to_string()));
        assert!(wall.contains(&"Charlie post".to_string()));
    }

    #[test]
    fn wall_does_not_include_non_followed() {
        let mut sn = SocialNetwork::new();
        sn.post("Alice", "Alice post");
        sn.post("Bob", "Bob post");
        sn.follow("Charlie", "Alice");
        let wall = sn.wall("Charlie");
        assert!(!wall.contains(&"Bob post".to_string()));
    }
}
