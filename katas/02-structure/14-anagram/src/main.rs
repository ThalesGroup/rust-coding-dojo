// TODO: Implement anagrams_of(word: &str, candidates: &[&str]) -> Vec<String>
//
// Rules:
// - Return candidates that are anagrams of word
// - An anagram uses exactly the same letters in a different order
// - Comparison is case-insensitive
// - A word is NOT an anagram of itself (even with different casing)
// - Words of different lengths cannot be anagrams

fn anagrams_of(word: &str, candidates: &[&str]) -> Vec<String> {
    todo!("Implement anagram detection")
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
        let mut result = anagrams_of("listen", &["enlist", "inlets", "silent"]);
        result.sort();
        assert_eq!(result, vec!["enlist", "inlets", "silent"]);
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
