import { calculateScore } from './engine.js';
import { getHandType } from './analysis.js';
import fs from 'fs';

const ITERATIONS = process.env.SIMULATION_ITERATIONS ? parseInt(process.env.SIMULATION_ITERATIONS) : 1000000;

console.log(`--- Generating Hand Analysis Report (${ITERATIONS.toLocaleString()} Iterations) ---`);

const stats = {};
const handTypes = [
    "Zilch",
    "Single 1s/5s Only",
    "3-of-a-Kind",
    "4-of-a-Kind",
    "5-of-a-Kind",
    "6-of-a-Kind",
    "Small Straight",
    "Large Straight",
    "Full Straight",
    "Three Pair / Two Triplets",
    "Other Scoring"
];

// Initialize stats structure
for (let d = 1; d <= 6; d++) {
    stats[d] = {};
    handTypes.forEach(t => stats[d][t] = 0);
}

// Run Simulation
for (let d = 1; d <= 6; d++) {
    console.log(`Simulating ${d} dice...`);
    for (let i = 0; i < ITERATIONS; i++) {
        const roll = Array.from({ length: d }, () => Math.floor(Math.random() * 6) + 1);
        const result = calculateScore(roll);
        const type = getHandType(roll, result);
        
        if (stats[d][type] !== undefined) {
            stats[d][type]++;
        } else {
            stats[d]["Other Scoring"]++;
        }
    }
}

// Generate Markdown
let md = `# 📊 Zilch Hand Analysis Report

**Simulation Iterations:** ${ITERATIONS.toLocaleString()} per dice count.

This report details the probability of rolling specific hand types for each number of dice thrown.

| Hand Type | 1 Die | 2 Dice | 3 Dice | 4 Dice | 5 Dice | 6 Dice |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
`;

handTypes.forEach(type => {
    // Skip "Other Scoring" if it's 0 everywhere (which it should be)
    if (type === "Other Scoring") {
        const total = Object.values(stats).reduce((acc, s) => acc + s[type], 0);
        if (total === 0) return;
    }

    let row = `| **${type}** |`;
    for (let d = 1; d <= 6; d++) {
        const pct = (stats[d][type] / ITERATIONS) * 100;
        row += ` ${pct === 0 ? "—" : pct.toFixed(2) + "%"} |`;
    }
    md += row + "\n";
});

md += `
## Definitions
*   **Zilch:** No scoring dice.
*   **Single 1s/5s Only:** Score comes solely from individual 1s and 5s.
*   **X-of-a-Kind:** Three or more of the same number.
*   **Straights:** Small (1-5), Large (2-6), or Full (1-6).
*   **Three Pair / Two Triplets:** Special 1500 point combinations (6 dice only).
`;

try {
    fs.writeFileSync('ANALYSIS_RESULTS.md', md);
    console.log("✅ Successfully generated ANALYSIS_RESULTS.md");
} catch (err) {
    console.error("❌ Error writing report:", err);
}