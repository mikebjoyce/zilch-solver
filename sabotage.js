import { calculateScore } from './engine.js';

// Zilch rates from our 1 million roll simulation
const ZILCH_RATES = {
    1: 0.6667,
    2: 0.4443,
    3: 0.2781,
    4: 0.1575,
    5: 0.0774,
    6: 0.0230
};

/**
 * Evaluates the "Stinkiness" of a hand-off.
 * Higher value = better for you (next player likely to Zilch)
 */
function evaluateHandOff(bankedPoints, diceRemaining) {
    const zilchChance = ZILCH_RATES[diceRemaining];
    const expectedLossForNextPlayer = bankedPoints * zilchChance;
    
    console.log(`If you bank ${bankedPoints} with ${diceRemaining} dice left:`);
    console.log(`-> Next player has a ${(zilchChance * 100).toFixed(2)}% chance to ZILCH.`);
    console.log(`-> Risk-Adjusted Sabotage Value: ${expectedLossForNextPlayer.toFixed(0)} points.\n`);
}

console.log("--- SABOTAGE ANALYSIS ---");
evaluateHandOff(300, 4); // The "Safe" play
evaluateHandOff(500, 1); // The "Trap" play
evaluateHandOff(1000, 2); // The "Aggressive Trap"