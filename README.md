# Welcome in Rust coding dojo repository !

[![CI](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/actions/workflows/ci.yml/badge.svg?style=flat-square)](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/actions/workflows/ci.yml)
[![MSRV](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/actions/workflows/msrv.yml/badge.svg?style=flat-square)](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/actions/workflows/msrv.yml)
[![Deny](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/actions/workflows/deny.yml/badge.svg?style=flat-square)](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/actions/workflows/deny.yml)
[![Nightly](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/actions/workflows/nightly.yml/badge.svg?style=flat-square)](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/actions/workflows/nightly.yml)
[![Release Workflow](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/actions/workflows/release.yml/badge.svg?style=flat-square)](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/actions/workflows/release.yml)

[![Release](https://img.shields.io/github/v/release/NicolasPayneauT0132431/rust-coding-dojo?style=flat-square)](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/releases)
[![Commits Since Release](https://img.shields.io/github/commits-since/NicolasPayneauT0132431/rust-coding-dojo/v0.1.0?style=flat-square)](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/commits/main/)
[![License](https://img.shields.io/github/license/NicolasPayneauT0132431/rust-coding-dojo?style=flat-square)](LICENSE)
[![Changelog](https://img.shields.io/badge/changelog-CHANGELOG.md-blue?style=flat-square)](CHANGELOG.md)

[![Last Commit](https://img.shields.io/github/last-commit/NicolasPayneauT0132431/rust-coding-dojo?style=flat-square)](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/commits/main)
[![Repo Size](https://img.shields.io/github/repo-size/NicolasPayneauT0132431/rust-coding-dojo?style=flat-square)](https://github.com/NicolasPayneauT0132431/rust-coding-dojo)
[![Contributors](https://img.shields.io/github/contributors/NicolasPayneauT0132431/rust-coding-dojo?style=flat-square)](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/graphs/contributors)
[![Top Language](https://img.shields.io/github/languages/top/NicolasPayneauT0132431/rust-coding-dojo?style=flat-square)](https://github.com/NicolasPayneauT0132431/rust-coding-dojo)
[![Language Count](https://img.shields.io/github/languages/count/NicolasPayneauT0132431/rust-coding-dojo?style=flat-square)](https://github.com/NicolasPayneauT0132431/rust-coding-dojo)

[![Open Issues](https://img.shields.io/github/issues/NicolasPayneauT0132431/rust-coding-dojo?style=flat-square)](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/issues)
[![Closed Issues](https://img.shields.io/github/issues-closed/NicolasPayneauT0132431/rust-coding-dojo?style=flat-square)](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/issues?q=is%3Aissue+is%3Aclosed)
[![Open PRs](https://img.shields.io/github/issues-pr/NicolasPayneauT0132431/rust-coding-dojo?style=flat-square)](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/pulls)
[![Closed PRs](https://img.shields.io/github/issues-pr-closed/NicolasPayneauT0132431/rust-coding-dojo?style=flat-square)](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/pulls?q=is%3Apr+is%3Aclosed)
[![Stars](https://img.shields.io/github/stars/NicolasPayneauT0132431/rust-coding-dojo?style=flat-square)](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/stargazers)
[![Forks](https://img.shields.io/github/forks/NicolasPayneauT0132431/rust-coding-dojo?style=flat-square)](https://github.com/NicolasPayneauT0132431/rust-coding-dojo/network/members)

![Workspace](https://img.shields.io/badge/Cargo%20Workspace-16%20katas-6f42c1?style=flat-square)
![Tracks](https://img.shields.io/badge/Tracks-setup%20%7C%20starter%20%7C%20structure%20%7C%20advanced-0a7ea4?style=flat-square)
![Rust Edition](https://img.shields.io/badge/Rust-Edition%202021-dea584?style=flat-square&logo=rust)
![MSRV](https://img.shields.io/badge/MSRV-1.75.0-informational?style=flat-square)
![CI Scope](https://img.shields.io/badge/CI-Solutions%20validated-success?style=flat-square)

This place is intended to provide resources, documentation and templates to organize coding dojo sessions about Rust language.
Feel free to open an issue if you wish to add a new one, update an existing one or if you have any question.

## Rust Katas

A code **kata** is a software development exercise in which the focus is not on solving a task or problem, but on **learning new skills and developing successful routines**. For each code kata, **several solutions** have to be found in order to **learn from mistakes, gain experience** and develop even better solutions.

You can find many katas here: https://codingdojo.org/kata/

In [katas](./katas) directory, you will find here all the available katas about Rust language organized in categories:
- **setup**: for beginners, to learn about Rust installation, dependencies management with Cargo, compiler
- **starter**: for beginners and intermediate, to learn about variables, control flow, loops and functions
- **structure**: for intermediates, to learn about String manipulation, data structures and enums
- **advanced**: for experts, to learn about advanced topics such as concurrency generics, lifetime, macros

All katas share the same structure:
```
/XX-package/XX-kataname
|- src
   |- bin
      |- exercise_1.rs
      |- exercise_2.rs
   main.rs
   ...
|- solutions
   |- exercise_1.rs
   |- exercise_2.rs
   ...
Cargo.lock
Cargo.toml
```
The kata may consist in a single program with gaps, then we put the program source in the `src` folder at kata's root, and the main function in `src/main.rs`. Then, it can just be run by calling the command `cargo run`.

If the kata consists in several small exercise programs, we put all the exercises in a `src/bin` folder at kata's root.
We can just run the exercise by calling `cargo run --bin <exercise_n>` to run the targeted exercise, without needing the others to compile, or to comment anything.

## Development

All katas are organized as a Cargo workspace. You can run common commands from the repository root:

```bash
# Build all katas
cargo build --workspace

# Run all tests
cargo test --workspace

# Run linter
cargo clippy --workspace

# Format code
cargo fmt --all
```

## Contributing

If you are interested in contributing to this repository please send an email to oss@thalesgroup.com, find more details about how to contribute [here](https://github.com/ThalesGroup/rust-coding-dojo/blob/main/CONTRIBUTING.md)

## License

License under [Apache V2 license](https://github.com/ThalesGroup/rust-coding-dojo/blob/main/LICENSE) 
