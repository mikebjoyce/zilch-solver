import { calculateScore } from './engine.js';

/**
 * Simulates a turn based on a 'stopThreshold'
 * @param {number} stopThreshold - Bank the points once the turn total reaches this.
 * @param {number} inheritedPoints - Points passed from the previous player.
 * @param {number} inheritedDice - Dice passed from the previous player.
 */
function simulateTurn(stopThreshold, inheritedPoints = 0, inheritedDice = 6) {
    let turnTotal = inheritedPoints;
    let diceToRoll = inheritedDice;
    let isTurnActive = true;

    while (isTurnActive) {
        // Roll the dice
        const roll = Array.from({ length: diceToRoll }, () => Math.floor(Math.random() * 6) + 1);
        const result = calculateScore(roll);

        if (result.score === 0) {
            return 0; // ZILCH!
        }

        turnTotal += result.score;
        
        // Calculate remaining dice
        diceToRoll -= result.diceUsed;
        if (diceToRoll === 0) diceToRoll = 6; // Hot Dice!

        // Decision Logic
        if (turnTotal >= stopThreshold) {
            isTurnActive = false;
        }
    }

    return turnTotal;
}

// Let's test the "Stay at 500" strategy vs "Stay at 1000" strategy
function compareStrategies(threshold, iterations = 100000) {
    let totalPoints = 0;
    for (let i = 0; i < iterations; i++) {
        totalPoints += simulateTurn(threshold);
    }
    console.log(`Strategy: Stop at ${threshold} | Avg Points Per Turn: ${(totalPoints / iterations).toFixed(2)}`);
}

console.log("--- Analyzing Optimal Stopping Point ---");
compareStrategies(300);
compareStrategies(400);
compareStrategies(500);
compareStrategies(600);
compareStrategies(750);
compareStrategies(1000);