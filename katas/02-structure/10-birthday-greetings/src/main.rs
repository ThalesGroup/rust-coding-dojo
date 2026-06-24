// TODO: Implement Birthday Greetings with Hexagonal Architecture
//
// 1. Define a Friend struct with name, birthdate (month, day), email
// 2. Define a FriendRepository trait with: fn find_all(&self) -> Vec<Friend>
// 3. Define an EmailSender trait with: fn send(&self, to: &str, subject: &str, body: &str)
// 4. Implement BirthdayService::send_greetings(month: u32, day: u32) that:
//    - Gets all friends from the repository
//    - Filters those whose birthday matches today (month, day)
//    - Sends each a greeting email via the sender
// 5. In tests, use in-memory implementations (test doubles)

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
        todo!("Create service")
    }

    pub fn send_greetings(&self, month: u32, day: u32) {
        todo!("Find friends with birthday on (month, day) and send emails")
    }
}

fn main() {
    println!("See tests for usage with test doubles");
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::cell::RefCell;

    struct InMemoryRepo {
        friends: Vec<Friend>,
    }
    impl FriendRepository for InMemoryRepo {
        fn find_all(&self) -> Vec<Friend> {
            self.friends.clone()
        }
    }

    struct SpySender {
        sent: RefCell<Vec<String>>,
    }
    impl EmailSender for SpySender {
        fn send(&self, to: &str, _subject: &str, _body: &str) {
            self.sent.borrow_mut().push(to.to_string());
        }
    }

    #[test]
    fn sends_greeting_to_birthday_friend() {
        let repo = InMemoryRepo {
            friends: vec![
                Friend {
                    name: "John".to_string(),
                    birth_month: 10,
                    birth_day: 8,
                    email: "john@example.com".to_string(),
                },
                Friend {
                    name: "Mary".to_string(),
                    birth_month: 9,
                    birth_day: 11,
                    email: "mary@example.com".to_string(),
                },
            ],
        };
        let sender = SpySender {
            sent: RefCell::new(vec![]),
        };
        let service = BirthdayService::new(repo, sender);
        service.send_greetings(10, 8);
        // Should send to john, not mary
        todo!("Assert sender received email to john@example.com")
    }

    #[test]
    fn no_birthday_today_sends_nothing() {
        let repo = InMemoryRepo {
            friends: vec![Friend {
                name: "John".to_string(),
                birth_month: 10,
                birth_day: 8,
                email: "john@example.com".to_string(),
            }],
        };
        let sender = SpySender {
            sent: RefCell::new(vec![]),
        };
        let service = BirthdayService::new(repo, sender);
        service.send_greetings(1, 1);
        todo!("Assert no emails sent")
    }
}
