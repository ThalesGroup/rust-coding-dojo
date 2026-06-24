#[derive(Debug, Clone)]
pub struct Friend {
    pub name: String,
    pub birth_month: u32,
    pub birth_day: u32,
    pub email: String,
}

pub trait FriendRepository {
    fn find_all(&self) -> Vec<Friend>;
}

pub trait EmailSender {
    fn send(&self, to: &str, subject: &str, body: &str);
}

pub struct BirthdayService<R: FriendRepository, S: EmailSender> {
    repository: R,
    sender: S,
}

impl<R: FriendRepository, S: EmailSender> BirthdayService<R, S> {
    pub fn new(repository: R, sender: S) -> Self {
        BirthdayService { repository, sender }
    }

    pub fn send_greetings(&self, month: u32, day: u32) {
        for friend in self.repository.find_all() {
            if friend.birth_month == month && friend.birth_day == day {
                self.sender.send(
                    &friend.email,
                    "Happy Birthday!",
                    &format!("Happy Birthday, dear {}!", friend.name),
                );
            }
        }
    }
}

fn main() {
    println!("See tests for usage with test doubles");
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::cell::RefCell;

    struct InMemoryRepo { friends: Vec<Friend> }
    impl FriendRepository for InMemoryRepo {
        fn find_all(&self) -> Vec<Friend> { self.friends.clone() }
    }

    struct SpySender { sent: RefCell<Vec<String>> }
    impl EmailSender for SpySender {
        fn send(&self, to: &str, _: &str, _: &str) {
            self.sent.borrow_mut().push(to.to_string());
        }
    }

    fn make_friend(name: &str, month: u32, day: u32) -> Friend {
        Friend {
            name: name.to_string(),
            birth_month: month,
            birth_day: day,
            email: format!("{}@example.com", name.to_lowercase()),
        }
    }

    #[test]
    fn sends_greeting_to_birthday_friend() {
        let repo = InMemoryRepo { friends: vec![
            make_friend("John", 10, 8),
            make_friend("Mary", 9, 11),
        ]};
        let sender = SpySender { sent: RefCell::new(vec![]) };
        let service = BirthdayService::new(repo, sender);
        service.send_greetings(10, 8);
        let sent = service.sender.sent.borrow();
        assert_eq!(sent.len(), 1);
        assert_eq!(sent[0], "john@example.com");
    }

    #[test]
    fn no_birthday_sends_nothing() {
        let repo = InMemoryRepo { friends: vec![make_friend("John", 10, 8)] };
        let sender = SpySender { sent: RefCell::new(vec![]) };
        let service = BirthdayService::new(repo, sender);
        service.send_greetings(1, 1);
        assert!(service.sender.sent.borrow().is_empty());
    }
}
