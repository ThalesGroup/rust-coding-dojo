fn wrap(text: &str, column: usize) -> String {
    if text.is_empty() || column == 0 {
        return text.to_string();
    }
    let mut result = String::new();
    let mut remaining = text;
    loop {
        if remaining.len() <= column {
            result.push_str(remaining);
            break;
        }
        // Find last space within column chars
        let slice = &remaining[..column];
        if let Some(pos) = slice.rfind(' ') {
            result.push_str(&remaining[..pos]);
            result.push('\n');
            remaining = remaining[pos + 1..].trim_start();
        } else {
            // No space found: hard break at column
            result.push_str(&remaining[..column]);
            result.push('\n');
            remaining = &remaining[column..];
        }
    }
    result
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
