## Cargo Setup and Usage

### Level / duration

Beginner / 30 minutes

### Context
As a developer diving into Rust, it's crucial to understand and use **Cargo**, Rust's package manager and build system. This kata will guide you through setting up Cargo and using it to create, build, and manage Rust projects.

### Objective
The goal of this kata is to become proficient in setting up Cargo and using its various commands to create, build, test, and manage Rust projects.

### Tasks

1. **Installation of Rust and Cargo**
   - Ensure you have Rust installed on your system, as Cargo comes bundled with it.

2. **Verifying Cargo Installation**
   - Open a terminal or command prompt and run the command `cargo --version` to confirm that Cargo is installed correctly and accessible from the command line.

3. **Creating a New Rust Project**
   - Use Cargo to create a new Rust project by running `cargo new my_project`, replacing `my_project` with the name of your project.
   - Navigate into the newly created project directory (`cd my_project`) to proceed with further tasks.

4. **Building the Project**
   - Build the project using Cargo by running `cargo build`. This command compiles the project and generates the executable binary.

5. **Running the Project**
   - Execute the built project by running `cargo run`. Ensure that the program executes successfully.

6. **Testing the Project**
   - Write some unit tests in the `tests` module within your project, typically located in the `src` directory.
   - Run the tests using Cargo by running `cargo test`. Observe the test results to ensure that all tests pass.

7. **Adding Dependencies**
   - Modify the `Cargo.toml` file to include external dependencies from [crates.io](https://crates.io/).
   - Run `cargo build` to fetch and build the dependencies.

8. **Publishing the Project**
   - If you're ready to share your project with others, publish it to [crates.io](https://crates.io/) by following the guidelines on their website.

9. **Managing Dependencies**
   - Explore Cargo's commands for managing dependencies, such as `cargo update` to update dependencies or `cargo outdated` to check for outdated dependencies.

### Links

- Refer to the Cargo documentation (https://doc.rust-lang.org/cargo/) for detailed information on Cargo's commands and features.
- You should take a look on cargo most used commands (and their documentation) to do things such as:
   - Clean a project with `cargo clean`
   - Generate the documentation from source comments with `cargo doc`
   - Benchmark your code with `cargo bench`
   - Format code with `cargo fmt`
   - Fix compiler errors with `cargo fix`
   - Lint your code with `cargo clippy`
   - Test your code with `cargo test`
   - Fuzz your code with `cargo fuzz`
   - Work on your code coverage with `cargo llvm-cov`
   - and more...
