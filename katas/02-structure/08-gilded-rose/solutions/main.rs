#[derive(Debug, Clone)]
pub struct Item {
    pub name: String,
    pub sell_in: i32,
    pub quality: i32,
}

impl Item {
    pub fn new(name: &str, sell_in: i32, quality: i32) -> Self {
        Item {
            name: name.to_string(),
            sell_in,
            quality,
        }
    }
}

pub fn update_quality(items: &mut Vec<Item>) {
    for item in items.iter_mut() {
        match item.name.as_str() {
            "Sulfuras, Hand of Ragnaros" => {}
            "Aged Brie" => {
                item.sell_in -= 1;
                item.quality = (item.quality + if item.sell_in < 0 { 2 } else { 1 }).min(50);
            }
            "Backstage passes to a TAFKAL80ETC concert" => {
                item.sell_in -= 1;
                item.quality = if item.sell_in < 0 {
                    0
                } else {
                    let inc = if item.sell_in < 5 {
                        3
                    } else if item.sell_in < 10 {
                        2
                    } else {
                        1
                    };
                    (item.quality + inc).min(50)
                };
            }
            name if name.starts_with("Conjured") => {
                item.sell_in -= 1;
                let deg = if item.sell_in < 0 { 4 } else { 2 };
                item.quality = (item.quality - deg).max(0);
            }
            _ => {
                item.sell_in -= 1;
                let deg = if item.sell_in < 0 { 2 } else { 1 };
                item.quality = (item.quality - deg).max(0);
            }
        }
    }
}

fn main() {
    let mut items = vec![
        Item::new("+5 Dexterity Vest", 10, 20),
        Item::new("Aged Brie", 2, 0),
        Item::new("Sulfuras, Hand of Ragnaros", 0, 80),
        Item::new("Backstage passes to a TAFKAL80ETC concert", 15, 20),
        Item::new("Conjured Mana Cake", 3, 6),
    ];
    update_quality(&mut items);
    for item in &items {
        println!("{:?}", item);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn normal_item_degrades() {
        let mut i = vec![Item::new("foo", 5, 10)];
        update_quality(&mut i);
        assert_eq!(i[0].quality, 9);
    }

    #[test]
    fn quality_never_negative() {
        let mut i = vec![Item::new("foo", 5, 0)];
        update_quality(&mut i);
        assert_eq!(i[0].quality, 0);
    }

    #[test]
    fn aged_brie_increases() {
        let mut i = vec![Item::new("Aged Brie", 5, 10)];
        update_quality(&mut i);
        assert_eq!(i[0].quality, 11);
    }

    #[test]
    fn sulfuras_unchanged() {
        let mut i = vec![Item::new("Sulfuras, Hand of Ragnaros", 0, 80)];
        update_quality(&mut i);
        assert_eq!(i[0].quality, 80);
        assert_eq!(i[0].sell_in, 0);
    }

    #[test]
    fn backstage_drops_after_concert() {
        let mut i = vec![Item::new(
            "Backstage passes to a TAFKAL80ETC concert",
            0,
            20,
        )];
        update_quality(&mut i);
        assert_eq!(i[0].quality, 0);
    }

    #[test]
    fn conjured_degrades_double() {
        let mut i = vec![Item::new("Conjured Mana Cake", 5, 10)];
        update_quality(&mut i);
        assert_eq!(i[0].quality, 8);
    }
}
