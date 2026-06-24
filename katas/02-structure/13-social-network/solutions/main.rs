use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct Post {
    pub author: String,
    pub message: String,
    pub timestamp: u64,
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
        self.clock += 1;
        self.posts.push(Post {
            author: user.to_string(),
            message: message.to_string(),
            timestamp: self.clock,
        });
    }

    pub fn read(&self, user: &str) -> Vec<String> {
        let mut msgs: Vec<&Post> = self.posts.iter().filter(|p| p.author == user).collect();
        msgs.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
        msgs.iter().map(|p| p.message.clone()).collect()
    }

    pub fn follow(&mut self, user: &str, other: &str) {
        self.following
            .entry(user.to_string())
            .or_default()
            .push(other.to_string());
    }

    pub fn wall(&self, user: &str) -> Vec<String> {
        let mut authors = vec![user.to_string()];
        if let Some(followed) = self.following.get(user) {
            authors.extend(followed.clone());
        }
        let mut msgs: Vec<&Post> = self
            .posts
            .iter()
            .filter(|p| authors.contains(&p.author))
            .collect();
        msgs.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
        msgs.iter().map(|p| p.message.clone()).collect()
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
        assert_eq!(sn.read("Alice"), vec!["Hello world"]);
    }

    #[test]
    fn read_empty_user() {
        assert!(SocialNetwork::new().read("Alice").is_empty());
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
