# Rustward sword: The Great Programming Quest

Kata for the STARTER package of the Rust coding DOJO

## Level / duration

Beginner / 30 minutes

This kata as a part of the STARTER package targets Rust beginners.
This kata targets 30 minutes sessions

## Context

Welcome, brave adventurer, to the land of Rust! Your quest awaits, but before you embark on your journey, you must prove your worth by mastering the fundamentals of Rust programming.

Link, a plucky Rustacean, is on a quest to find the legendary treasure hidden deep within the Korok Forest. 
However, the forest is full of surprises, and Link needs your help to navigate through it.

## Objective

Your mission is to help a quirky character named Link on his epic adventure through the Link Forest and to complete various basic challenges.
Along the way, you will encounter challenges that require your Rust knowledge of variables, control flows, loops, and functions to overcome.
Restarting from the ./src/main.rs, try to implement a solution for each challenges.

## Challenges

1. **The Mysterious Variables:**
   Link needs your help to gather supplies for his journey.
   
   _Declare variables to store:_
   - Link's health (integer)
   - Link's stamina (float)
   - The number of treasure chests Link has found (integer)
   - Whether Link has encountered a friendly NPC (boolean)

2. **Navigating the Forest:**
   As Link ventures deeper into the forest, he encounters forks in the road.

   _Use control flow to guide Link:_
   - If Link's health is above 50, he can continue on his journey.
   - If Link's health is between 25 and 50, he needs to take a break to recover.
   - If Link's health is below 25, he needs to find a healing potion to replenish his health.

3. **The Enchanted Loop:**
   Link stumbles upon a clearing where magical creatures dance around a mysterious stone.

   _Use a loop to observe the creatures' movements:_
   - Write a loop to count from 1 to 10.
   - For each number, determine whether it's even or odd and describe the magical creature's behavior accordingly.

4. **The Wisdom of Functions:**
   In the heart of the forest lies the treasure chamber, guarded by a formidable beast.

   _Create a function called `defeat_beast` to help Link:_
   - The function should take Link's health and stamina as parameters.
   - Inside the function, calculate Link's chances of defeating the beast based on his health and stamina.
   - Return a message indicating whether Link succeeds or fails in defeating the beast.

## How to run a kata
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

## Links

- Feel free to consult the [official Rust documentation](https://www.rust-lang.org/tools/install) for additional help.

- Join the Rust community on forums such as the Rust Users Forum ([https://users.rust-lang.org/](https://users.rust-lang.org/)) or the Rust subreddit ([https://www.reddit.com/r/rust/](https://www.reddit.com/r/rust/)) for support and discussions.
