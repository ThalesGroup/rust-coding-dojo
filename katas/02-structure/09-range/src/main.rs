// TODO: Implement integer range with open/closed bounds
// Notation: [a,b) = closed start, open end
// Closed bound includes the endpoint, Open bound excludes it
//
// Examples:
// [2,6) contains 2, 3, 4, 5 but NOT 6
// [2,5] contains 2, 3, 4, 5

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
        todo!("Create range")
    }

    pub fn contains_point(&self, point: i32) -> bool {
        todo!("Check if point is in range")
    }

    pub fn get_all_points(&self) -> Vec<i32> {
        todo!("Return all integer points in range")
    }

    pub fn endpoints(&self) -> (i32, i32) {
        todo!("Return (first, last) included points")
    }

    pub fn contains_range(&self, other: &Range) -> bool {
        todo!("Check if self fully contains other")
    }

    pub fn overlaps_range(&self, other: &Range) -> bool {
        todo!("Check if self overlaps with other")
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
