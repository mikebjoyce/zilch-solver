import { calculateScore } from './engine.js';
import fs from 'fs';

/**
 * Detects special combinations for statistical tracking.
 * Note: This logic mirrors engine.js but is used here for granular stats.
 */
function detectSpecials(roll) {
    const counts = new Array(7).fill(0);
    roll.forEach(d => counts[d]++);
    
    const specials = {
        fullStraight: false,
        threePair: false,
        smallStraight: false,
        largeStraight: false
    };

    if (roll.length === 6) {
        // Full Straight
        if (counts.slice(1).every(c => c === 1)) specials.fullStraight = true;
        
        // Three Pair / Two Triplets
        const pairs = counts.filter(c => c >= 2).length;
        const triplets = counts.filter(c => c >= 3).length;
        if (pairs === 3 || triplets === 2) specials.threePair = true;
    }

    if (roll.length >= 5) {
        if ([1, 2, 3, 4, 5].every(i => counts[i] > 0)) specials.smallStraight = true;
        if ([2, 3, 4, 5, 6].every(i => counts[i] > 0)) specials.largeStraight = true;
    }

    return specials;
}

/**
 * Runs a Monte Carlo simulation to find the chance of Zilching
 * and other stats based on the number of dice rolled.
 */
function runSimulation(diceCount, iterations = 1000000) {
    let zilches = 0;
    let totalSuccessScore = 0;
    let successCount = 0;
    
    const specialCounts = {
        fullStraight: 0,
        threePair: 0,
        smallStraight: 0,
        largeStraight: 0
    };

    for (let i = 0; i < iterations; i++) {
        // Roll X number of dice
        const roll = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);
        
        const result = calculateScore(roll);
        
        if (result.score === 0) {
            zilches++;
        } else {
            totalSuccessScore += result.score;
            successCount++;
        }

        const specials = detectSpecials(roll);
        if (specials.fullStraight) specialCounts.fullStraight++;
        if (specials.threePair) specialCounts.threePair++;
        if (specials.smallStraight) specialCounts.smallStraight++;
        if (specials.largeStraight) specialCounts.largeStraight++;
    }

    const zilchRate = zilches / iterations;
    const successRate = 1 - zilchRate;
    const avgGain = successCount > 0 ? totalSuccessScore / successCount : 0;

    // EV Calculation: EV = (Success% * ActualAvgGain) - (Zilch% * CurrentTurnTotal)
    const evScenarios = {};
    [0, 500, 1000].forEach(total => {
        evScenarios[total] = (successRate * avgGain) - (zilchRate * total);
    });

    return {
        dice: diceCount,
        zilchRate: zilchRate,
        successRate: successRate,
        avgGain: avgGain,
        specialProbabilities: {
            fullStraight: specialCounts.fullStraight / iterations,
            threePair: specialCounts.threePair / iterations,
            smallStraight: specialCounts.smallStraight / iterations,
            largeStraight: specialCounts.largeStraight / iterations
        },
        evScenarios: evScenarios
    };
}

console.log("--- Zilch Full Battery Simulation (1M Iterations) ---");
const comprehensiveStats = {};

for (let d = 1; d <= 6; d++) {
    console.log(`Simulating ${d} dice...`);
    comprehensiveStats[d] = runSimulation(d);
}

fs.writeFileSync('comprehensive_stats.json', JSON.stringify(comprehensiveStats, null, 2));
console.log("Simulation data saved to comprehensive_stats.json");