import fs from 'fs';

const stats = JSON.parse(fs.readFileSync('comprehensive_stats.json', 'utf8'));

/**
 * Evaluates the "Stinkiness" of a hand-off.
 * Higher value = better for you (next player likely to Zilch)
 */
function evaluateHandOff(bankedPoints, diceRemaining) {
    const zilchChance = stats[diceRemaining].zilchRate;
    const expectedLossForNextPlayer = bankedPoints * zilchChance;
    
    console.log(`If you bank ${bankedPoints} with ${diceRemaining} dice left:`);
    console.log(`-> Next player has a ${(zilchChance * 100).toFixed(2)}% chance to ZILCH.`);
    console.log(`-> Risk-Adjusted Sabotage Value: ${expectedLossForNextPlayer.toFixed(0)} points.\n`);
}

console.log("--- SABOTAGE ANALYSIS ---");
evaluateHandOff(300, 4); // The "Safe" play
evaluateHandOff(500, 1); // The "Trap" play
evaluateHandOff(1000, 2); // The "Aggressive Trap"