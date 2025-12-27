import { calculateScore, getHandType } from './engine.js';
import { fileURLToPath } from 'url';

/**
 * Categorizes a roll result into specific "Hand Types"
 * for the strategy report.
 */

/**
 * Solves the actual probabilities of specific hands for 1-6 dice.
 */
export function solveHandProbabilities(iterations = process.env.SIMULATION_ITERATIONS ? parseInt(process.env.SIMULATION_ITERATIONS) : 500000) {
    const table = {};

    for (let diceCount = 1; diceCount <= 6; diceCount++) {
        const stats = {
            "Total Success": 0,
            "Zilch": 0,
            "Single 1s/5s Only": 0,
            "3-of-a-Kind": 0,
            "4-of-a-Kind": 0,
            "5-of-a-Kind": 0,
            "6-of-a-Kind": 0,
            "Small Straight": 0,
            "Large Straight": 0,
            "Full Straight": 0,
            "Three Pair / Two Triplets": 0
        };

        for (let i = 0; i < iterations; i++) {
            const roll = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);
            const result = calculateScore(roll);
            const type = getHandType(roll, result);
            
            if (stats[type] !== undefined) {
                stats[type]++;
            }
            if (result.score > 0) stats["Total Success"]++;
        }

        // Convert to percentages
        const row = {};
        for (const [key, count] of Object.entries(stats)) {
            if (key === "Total Success") continue;
            const pct = ((count / iterations) * 100).toFixed(2) + "%";
            row[key] = pct === "0.00%" ? "—" : pct;
        }
        table[`${diceCount} Dice`] = row;
    }

    console.log("=== COMPREHENSIVE HAND PROBABILITY SOLVER ===");
    console.table(table);
}

// Only run if this file is the main entry point
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    solveHandProbabilities();
}