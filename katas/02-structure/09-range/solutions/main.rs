#[derive(Debug, Clone, Copy)]
pub enum Bound {
    Open(i32),   // exclusive
    Closed(i32), // inclusive
}

#[derive(Debug, Clone)]
pub struct Range {
    pub start: Bound,
    pub end: Bound,
}

impl Range {
    pub fn new(start: Bound, end: Bound) -> Self {
        Range { start, end }
    }

    fn lower(&self) -> i32 {
        match self.start {
            Bound::Closed(v) => v,
            Bound::Open(v) => v + 1,
        }
    }

    fn upper(&self) -> i32 {
        match self.end {
            Bound::Closed(v) => v,
            Bound::Open(v) => v - 1,
        }
    }

    pub fn contains_point(&self, point: i32) -> bool {
        point >= self.lower() && point <= self.upper()
    }

    pub fn get_all_points(&self) -> Vec<i32> {
        (self.lower()..=self.upper()).collect()
    }

    pub fn endpoints(&self) -> (i32, i32) {
        (self.lower(), self.upper())
    }

    pub fn contains_range(&self, other: &Range) -> bool {
        other.lower() >= self.lower() && other.upper() <= self.upper()
    }

    pub fn overlaps_range(&self, other: &Range) -> bool {
        self.lower() <= other.upper() && other.lower() <= self.upper()
    }
}

fn main() {
    let r = Range::new(Bound::Closed(2), Bound::Open(6));
    println!("Points: {:?}", r.get_all_points());
    println!("Contains 3: {}", r.contains_point(3));
    println!("Contains 6: {}", r.contains_point(6));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn closed_open_contains() {
        let r = Range::new(Bound::Closed(2), Bound::Open(6));
        assert!(r.contains_point(2));
        assert!(r.contains_point(5));
        assert!(!r.contains_point(6));
    }

    #[test]
    fn get_all_points() {
        let r = Range::new(Bound::Closed(2), Bound::Open(6));
        assert_eq!(r.get_all_points(), vec![2, 3, 4, 5]);
    }

    #[test]
    fn endpoints() {
        let r = Range::new(Bound::Closed(2), Bound::Open(6));
        assert_eq!(r.endpoints(), (2, 5));
    }

    #[test]
    fn contains_range() {
        let outer = Range::new(Bound::Closed(2), Bound::Open(10));
        let inner = Range::new(Bound::Closed(3), Bound::Closed(5));
        assert!(outer.contains_range(&inner));
    }

    #[test]
    fn overlaps_range() {
        let a = Range::new(Bound::Closed(2), Bound::Open(6));
        let b = Range::new(Bound::Closed(4), Bound::Open(10));
        assert!(a.overlaps_range(&b));
    }

    #[test]
    fn no_overlap() {
        let a = Range::new(Bound::Closed(2), Bound::Open(5));
        let b = Range::new(Bound::Closed(7), Bound::Open(10));
        assert!(!a.overlaps_range(&b));
    }
}
