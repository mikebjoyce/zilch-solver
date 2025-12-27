import { calculateScore, getHandType } from './engine.js';
import fs from 'fs';

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
};

/**
 * Runs a Monte Carlo simulation to find the chance of Zilching
 * and other stats based on the number of dice rolled.
 */
function runSimulation(diceCount, iterations = process.env.SIMULATION_ITERATIONS ? parseInt(process.env.SIMULATION_ITERATIONS) : 1000000) {
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

        const handType = getHandType(roll, result);
        if (handType === "Full Straight") specialCounts.fullStraight++;
        if (handType === "Three Pair / Two Triplets") specialCounts.threePair++;
        if (handType === "Small Straight") specialCounts.smallStraight++;
        if (handType === "Large Straight") specialCounts.largeStraight++;
    }

    const zilchRate = zilches / iterations;
    const successRate = 1 - zilchRate;
    const avgGain = successCount > 0 ? totalSuccessScore / successCount : 0;

    return {
        zilchRate: zilchRate,
        avgGain: avgGain,
        specialProbabilities: {
            fullStraight: specialCounts.fullStraight / iterations,
            threePair: specialCounts.threePair / iterations,
            smallStraight: specialCounts.smallStraight / iterations,
            largeStraight: specialCounts.largeStraight / iterations
        }
    };
}

const iterations = process.env.SIMULATION_ITERATIONS ? parseInt(process.env.SIMULATION_ITERATIONS) : 1000000;
console.log(`${colors.cyan}${colors.bright}\n--- Zilch Full Battery Simulation (${iterations.toLocaleString()} Iterations) ---${colors.reset}`);
const comprehensiveStats = {};

for (let d = 1; d <= 6; d++) {
    process.stdout.write(`${colors.yellow}Simulating ${d} dice... ${colors.reset}`);
    const start = Date.now();
    comprehensiveStats[d] = runSimulation(d);
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`${colors.green}Done (${duration}s)${colors.reset}`);
}

fs.writeFileSync('comprehensive_stats.json', JSON.stringify(comprehensiveStats, null, 2));
console.log(`${colors.green}${colors.bright}✔ Simulation data saved to comprehensive_stats.json${colors.reset}\n`);