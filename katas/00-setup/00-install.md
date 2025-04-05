## Setting up Rust Environment

### Level / duration

Beginner / 30 minutes

### Context

You are a developer who wants to start coding in Rust, but you need to first set up your development environment. This kata aims to familiarize you with the basic setup process required to begin coding in Rust.

### Objective

The goal of this kata is to successfully configure your development environment to be able to write, compile, and run Rust programs.


### Tasks

1. **Installing Rust:**
   - Visit the official Rust website at [https://www.rust-lang.org/](https://www.rust-lang.org/) and follow the instructions to install Rust for your operating system.
   - Alternatively, you can install Rust using `rustup`, the Rust toolchain installer. Instructions for installing `rustup` can be found at [https://rustup.rs/](https://rustup.rs/).

2. **Configuring the Development Environment:**
   - Choose a text editor or integrated development environment (IDE) for Rust development. Popular choices include [Visual Studio Code](https://code.visualstudio.com/) with the Rust extension, [IntelliJ IDEA](https://www.jetbrains.com/idea/) with the Rust plugin, or [Emacs](https://www.gnu.org/software/emacs/) with the `rust-mode` package.
   - Install the necessary plugins or extensions for your chosen editor/IDE to support Rust syntax highlighting, code completion, and other language features.

3. **Verifying the Installation:**
   - Open a terminal or command prompt and type `rustc --version` to verify that the Rust compiler is installed correctly.
   - Additionally, run `cargo --version` to verify that Cargo, Rust's package manager, is installed as well.

4. **Creating a Hello World Program:**
   - Create a new directory for your Rust projects.
   - Inside the directory, create a file named `main.rs`.
   - Write a simple "Hello, World!" program in Rust. For example:
     ```rust
     fn main() {
         println!("Hello, World!");
     }
     ```

5. **Compiling and Running the Program:**
   - Open a terminal or command prompt, navigate to the directory containing your `main.rs` file, and run the command `rustc main.rs` to compile the Rust program.
   - After successful compilation, run the generated executable (on Unix-like systems, it will be named `main`, and on Windows, it will be `main.exe`) to see the output.

6. **Validation:**
   - Verify that the program compiles without errors and outputs "Hello, World!" when executed.

### Links

- Feel free to consult the [official Rust documentation](https://www.rust-lang.org/tools/install) for additional help with installation and setup.

- Join the Rust community on forums such as the Rust Users Forum ([https://users.rust-lang.org/](https://users.rust-lang.org/)) or the Rust subreddit ([https://www.reddit.com/r/rust/](https://www.reddit.com/r/rust/)) for support and discussions.
