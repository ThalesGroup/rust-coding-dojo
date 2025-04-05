// Rustward sword: The Great Programming Quest

fn main() {
    // 1. The Mysterious Variables
    let mut link_health: i32 = 100; // Link's health
    let link_stamina: f32 = 75.5; // Link's stamina
    let mut treasure_chests_found: i32 = 0; // Number of treasure chests found
    let friendly_npc_encountered: bool = false; // Whether Link has encountered a friendly NPC

    // 2. Navigating the Forest
    if link_health > 50 {
        println!("Link is healthy and continues his journey.");
    } else if link_health > 25 {
        println!("Link needs to take a break to recover.");
    } else {
        println!("Link needs to find a healing potion to replenish his health.");
    }

    // 3. The Enchanted Loop
    println!("In the clearing, Link observes the magical creatures:");
    for i in 1..=10 {
        match i % 2 {
            0 => println!("{} - Link encounters an even-tempered creature.", i),
            _ => println!("{} - Link encounters an odd-tempered creature.", i),
        }
    }

    // 4. The Wisdom of Functions
    let success = defeat_beast(link_health, link_stamina);
    println!("{}", success);
}

// Function to determine Link's chances of defeating the beast
fn defeat_beast(health: i32, stamina: f32) -> String {
    let chance = health as f32 * stamina / 1000.0; // Simple chance calculation
    if chance > 50.0 {
        "Link defeats the beast with ease!".to_string()
    } else {
        "Link is no match for the beast!".to_string()
    }
}