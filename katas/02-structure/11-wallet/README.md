# Wallet

Kata for the STRUCTURE package of the Rust coding DOJO

## Level / Duration

Intermediate / 60 minutes

## Context
This kata is based on [Wallet from Coding Dojo](https://codingdojo.org/kata/Wallet/).

A Wallet contains Stocks, each composed of a quantity and a StockType (Petroleum, Euro, Bitcoin, Dollar). The wallet can compute its total value in a given currency by using an exchange rate provider injected as a trait.

## Objective
Implement `Wallet`, `Stock`, `StockType` and the `RateProvider` trait. The main method is `wallet.value(currency: &StockType, provider: &impl RateProvider) -> f64`, which sums all stock values converted to the target currency.

## Domains

`Enums` `Traits` `Generics` `impl Trait`

## How to run a kata
All katas share the same structure:
```
/02-structure/11-wallet
|- src
|   main.rs
|- solutions
|   main.rs
Cargo.lock
Cargo.toml
```

## Prerequisites
The SETUP and STARTER packages must have been completed

Access to the Rust documentation at https://doc.rust-lang.org/std/index.html
Access to the Rust book at https://doc.rust-lang.org/book/
