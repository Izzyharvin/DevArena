// -------------------------------------------
// Purpose: Populate the database with starter coding challenges
// so the app has real data for testing and UI display.
// -------------------------------------------

// Import PrismaClient, the ORM interface for our PostgreSQL database
import { PrismaClient } from "@prisma/client";

// Create a single Prisma instance
const prisma = new PrismaClient();

// Main seeding logic wrapped in an async function
async function main() {
    console.log("Seeding database...");

    // Create multiple challenge records at once
    await prisma.challenge.createMany({
        data: [
            // ---------- EASY ----------
            {
                slug: "two-sum", // used as URL identifier
                title: "Two Sum",
                promptMd:
                    "Given an array of integers and a target, return indices of the two numbers that add up to the target.",
                difficulty: "EASY", // enum type (defined in schema.prisma)
                tags: ["array", "hash"], // tags help with filtering/search
                points: 10, // XP/score points awarded for completion
            },
            {
                slug: "palindrome",
                title: "Valid Palindrome",
                promptMd:
                    "Given a string, return true if it is a palindrome (reads the same forward and backward).",
                difficulty: "EASY",
                tags: ["string"],
                points: 10,
            },
            // ---------- MEDIUM ----------
            {
                slug: "anagrams",
                title: "Group Anagrams",
                promptMd:
                    "Given an array of strings, group the anagrams together.",
                difficulty: "MEDIUM",
                tags: ["hash", "sort"],
                points: 20,
            },
            // ---------- HARD ----------
            {
                slug: "longest-substring",
                title: "Longest Substring Without Repeating Characters",
                promptMd: "Find the length of the longest substring without repeating characters.",
                difficulty: "HARD",
                tags: ["string", "sliding-window"],
                points: 30,
            },
        ],
        skipDuplicates: true, // prevents duplicate seeding if script is re-run
    });

    console.log("Seeding complete!");
}

// Execute the seed function
main()
    // Catch any errors and print them to console
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    // Always close DB connection whether success or fail
    .finally(async () => {
        await prisma.$disconnect();
    });
