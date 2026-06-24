// TODO: Implement wrap(text: &str, column: usize) -> String
// Rules:
// - Insert newlines so no line exceeds `column` characters
// - Break at word boundaries (spaces) whenever possible
// - If a single word is longer than column, break it mid-word

fn wrap(text: &str, column: usize) -> String {
    todo!("Implement word wrap")
}

fn main() {
    let text = "The quick brown fox jumps over the lazy dog";
    println!("{}", wrap(text, 15));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_string() {
        assert_eq!(wrap("", 10), "");
    }

    #[test]
    fn shorter_than_column() {
        assert_eq!(wrap("hello", 10), "hello");
    }

    #[test]
    fn exactly_at_column() {
        assert_eq!(wrap("hello", 5), "hello");
    }

    #[test]
    fn wrap_at_word_boundary() {
        assert_eq!(wrap("hello world", 5), "hello\nworld");
    }

    #[test]
    fn wrap_multiple_words() {
        assert_eq!(wrap("the quick brown", 10), "the quick\nbrown");
    }

    #[test]
    fn long_single_word() {
        assert_eq!(wrap("abcdefghij", 5), "abcde\nfghij");
    }
}
