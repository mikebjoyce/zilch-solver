import { calculateScore } from './engine.js';
import fs from 'fs';

/**
 * Runs a Monte Carlo simulation to find the chance of Zilching
 * based on the number of dice rolled.
 */
function runSimulation(diceCount, iterations = 1000000) {
    let zilches = 0;
    let totalSuccessScore = 0;

    for (let i = 0; i < iterations; i++) {
        // Roll X number of dice
        const roll = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);
        
        const result = calculateScore(roll);
        
        if (result.score === 0) {
            zilches++;
        } else {
            totalSuccessScore += result.score;
        }
    }

    const zilchRate = zilches / iterations;
    const avgGain = (iterations - zilches) > 0 ? totalSuccessScore / (iterations - zilches) : 0;

    return {
        dice: diceCount,
        zilchRate: zilchRate,
        avgGain: avgGain
    };
}

console.log("--- Zilch Probability & Average Score Analysis ---");
const results = [];
const zilchData = {};

for (let d = 1; d <= 6; d++) {
    const result = runSimulation(d);
    zilchData[d] = {
        zilchRate: result.zilchRate,
        avgGain: result.avgGain
    };
    results.push({
        dice: result.dice,
        zilchRate: (result.zilchRate * 100).toFixed(2) + '%',
        avgGain: result.avgGain.toFixed(2)
    });
}
console.table(results);

fs.writeFileSync('baseline_data.json', JSON.stringify(zilchData, null, 2));
console.log("Simulation data saved to baseline_data.json");