import { calculateScore } from './engine.js';
import { fileURLToPath } from 'url';

/**
 * Categorizes a roll result into specific "Hand Types"
 * for the strategy report.
 */
export function getHandType(roll, result) {
    if (result.score === 0) return "Zilch";
    
    const counts = new Array(7).fill(0);
    roll.forEach(d => counts[d]++);

    // Check for specials from engine logic
    if (roll.length === 6) {
        if (counts.slice(1).every(c => c === 1)) return "Full Straight";
        const pairs = counts.filter(c => c >= 2).length;
        const triplets = counts.filter(c => c >= 3).length;
        if (pairs === 3 || triplets === 2) return "Three Pair / Two Triplets";
    }

    if ([1, 2, 3, 4, 5].every(i => counts[i] > 0)) return "Small Straight";
    if ([2, 3, 4, 5, 6].every(i => counts[i] > 0)) return "Large Straight";

    const maxMulti = Math.max(...counts);
    if (maxMulti >= 3) return `${maxMulti}-of-a-Kind`;
    
    if (counts[1] > 0 || counts[5] > 0) return "Single 1s/5s Only";

    return "Other Scoring";
}

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