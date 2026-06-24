#[derive(Debug, Clone, PartialEq)]
pub enum StockType {
    Petroleum,
    Euro,
    Bitcoin,
    Dollar,
}

#[derive(Debug, Clone)]
pub struct Stock {
    pub quantity: f64,
    pub stock_type: StockType,
}

#[derive(Debug, Clone)]
pub struct Wallet {
    pub stocks: Vec<Stock>,
}

pub trait RateProvider {
    fn rate(&self, from: &StockType, to: &StockType) -> f64;
}

impl Wallet {
    pub fn new() -> Self {
        Wallet { stocks: vec![] }
    }

    pub fn add(&mut self, stock: Stock) {
        self.stocks.push(stock);
    }

    pub fn value(&self, currency: &StockType, provider: &impl RateProvider) -> f64 {
        self.stocks
            .iter()
            .map(|s| s.quantity * provider.rate(&s.stock_type, currency))
            .sum()
    }
}

fn main() {
    println!("See tests");
}

#[cfg(test)]
mod tests {
    use super::*;

    struct FixedRateProvider;

    impl RateProvider for FixedRateProvider {
        fn rate(&self, from: &StockType, to: &StockType) -> f64 {
            match (from, to) {
                (StockType::Dollar, StockType::Euro) => 0.9,
                (StockType::Euro, StockType::Euro) => 1.0,
                (StockType::Bitcoin, StockType::Euro) => 30_000.0,
                (StockType::Petroleum, StockType::Euro) => 80.0,
                _ => 1.0,
            }
        }
    }

    #[test]
    fn single_euro_stock() {
        let mut w = Wallet::new();
        w.add(Stock { quantity: 100.0, stock_type: StockType::Euro });
        assert!((w.value(&StockType::Euro, &FixedRateProvider) - 100.0).abs() < 0.001);
    }

    #[test]
    fn mixed_stocks() {
        let mut w = Wallet::new();
        w.add(Stock { quantity: 5.0, stock_type: StockType::Dollar });
        w.add(Stock { quantity: 10.0, stock_type: StockType::Euro });
        assert!((w.value(&StockType::Euro, &FixedRateProvider) - 14.5).abs() < 0.001);
    }

    #[test]
    fn bitcoin_conversion() {
        let mut w = Wallet::new();
        w.add(Stock { quantity: 0.5, stock_type: StockType::Bitcoin });
        assert!((w.value(&StockType::Euro, &FixedRateProvider) - 15_000.0).abs() < 0.001);
    }

    #[test]
    fn empty_wallet() {
        let w = Wallet::new();
        assert!((w.value(&StockType::Euro, &FixedRateProvider) - 0.0).abs() < 0.001);
    }
}
