// This is the legacy code of the Gilded Rose inn.
// TODO 1: Write tests to characterize existing behavior (Characterization Tests)
// TODO 2: Refactor update_quality to be clean and readable
// TODO 3: Add support for "Conjured" items (degrade 2x as fast as normal items)

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
        if item.name != "Aged Brie" && item.name != "Backstage passes to a TAFKAL80ETC concert" {
            if item.quality > 0 {
                if item.name != "Sulfuras, Hand of Ragnaros" {
                    item.quality -= 1;
                }
            }
        } else {
            if item.quality < 50 {
                item.quality += 1;
                if item.name == "Backstage passes to a TAFKAL80ETC concert" {
                    if item.sell_in < 11 {
                        if item.quality < 50 {
                            item.quality += 1;
                        }
                    }
                    if item.sell_in < 6 {
                        if item.quality < 50 {
                            item.quality += 1;
                        }
                    }
                }
            }
        }
        if item.name != "Sulfuras, Hand of Ragnaros" {
            item.sell_in -= 1;
        }
        if item.sell_in < 0 {
            if item.name != "Aged Brie" {
                if item.name != "Backstage passes to a TAFKAL80ETC concert" {
                    if item.quality > 0 {
                        if item.name != "Sulfuras, Hand of Ragnaros" {
                            item.quality -= 1;
                        }
                    }
                } else {
                    item.quality -= item.quality;
                }
            } else {
                if item.quality < 50 {
                    item.quality += 1;
                }
            }
        }
    }
}

fn main() {
    let mut items = vec![
        Item::new("+5 Dexterity Vest", 10, 20),
        Item::new("Aged Brie", 2, 0),
        Item::new("Elixir of the Mongoose", 5, 7),
        Item::new("Sulfuras, Hand of Ragnaros", 0, 80),
        Item::new("Backstage passes to a TAFKAL80ETC concert", 15, 20),
        Item::new("Conjured Mana Cake", 3, 6), // TODO 3
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
        let mut items = vec![Item::new("foo", 5, 10)];
        update_quality(&mut items);
        assert_eq!(items[0].quality, 9);
        assert_eq!(items[0].sell_in, 4);
    }

    #[test]
    fn quality_never_negative() {
        let mut items = vec![Item::new("foo", 5, 0)];
        update_quality(&mut items);
        assert_eq!(items[0].quality, 0);
    }

    #[test]
    fn aged_brie_increases() {
        let mut items = vec![Item::new("Aged Brie", 5, 10)];
        update_quality(&mut items);
        assert_eq!(items[0].quality, 11);
    }

    #[test]
    fn sulfuras_unchanged() {
        let mut items = vec![Item::new("Sulfuras, Hand of Ragnaros", 0, 80)];
        update_quality(&mut items);
        assert_eq!(items[0].quality, 80);
        assert_eq!(items[0].sell_in, 0);
    }

    #[test]
    fn backstage_pass_drops_to_zero_after_concert() {
        let mut items = vec![Item::new(
            "Backstage passes to a TAFKAL80ETC concert",
            0,
            20,
        )];
        update_quality(&mut items);
        assert_eq!(items[0].quality, 0);
    }
}
