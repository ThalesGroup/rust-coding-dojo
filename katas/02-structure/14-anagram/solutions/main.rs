fn sorted_chars(s: &str) -> Vec<char> {
    let mut chars: Vec<char> = s.to_lowercase().chars().collect();
    chars.sort_unstable();
    chars
}

fn anagrams_of(word: &str, candidates: &[&str]) -> Vec<String> {
    let word_sorted = sorted_chars(word);
    let word_lower = word.to_lowercase();
    candidates
        .iter()
        .filter(|&&c| c.to_lowercase() != word_lower && sorted_chars(c) == word_sorted)
        .map(|&c| c.to_string())
        .collect()
}

fn main() {
    let word = "listen";
    let candidates = ["enlist", "google", "inlets", "banana", "silent", "Listen"];
    println!("{:?}", anagrams_of(word, &candidates));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn no_anagrams() {
        assert_eq!(anagrams_of("hello", &["world", "hi"]), Vec::<String>::new());
    }

    #[test]
    fn single_anagram() {
        assert_eq!(anagrams_of("listen", &["enlist"]), vec!["enlist"]);
    }

    #[test]
    fn multiple_anagrams() {
        let mut r = anagrams_of("listen", &["enlist", "inlets", "silent"]);
        r.sort();
        assert_eq!(r, vec!["enlist", "inlets", "silent"]);
    }

    #[test]
    fn case_insensitive() {
        assert_eq!(anagrams_of("listen", &["ENLIST"]), vec!["ENLIST"]);
    }

    #[test]
    fn word_not_its_own_anagram() {
        assert!(anagrams_of("listen", &["listen", "Listen"]).is_empty());
    }

    #[test]
    fn different_length_not_anagram() {
        assert!(anagrams_of("hi", &["hello"]).is_empty());
    }

    #[test]
    fn non_anagram_same_length() {
        assert!(anagrams_of("hello", &["world"]).is_empty());
    }
}
