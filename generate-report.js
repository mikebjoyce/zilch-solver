import fs from 'fs';

// Load simulation data
const BASELINE_DATA = JSON.parse(fs.readFileSync('baseline_data.json', 'utf8'));
const TEST_RESULTS = JSON.parse(fs.readFileSync('test_results.json', 'utf8'));

function calculateThreshold(dice) {
    const zilchProb = BASELINE_DATA[dice].zilchRate;
    const successProb = 1 - zilchProb;
    const avgGain = BASELINE_DATA[dice].avgGain;
    return Math.floor((successProb * avgGain) / zilchProb);
}

function generateInheritanceTable() {
    // Calculate EV of a fresh 6-dice turn
    const freshEV = (1 - BASELINE_DATA[6].zilchRate) * BASELINE_DATA[6].avgGain;
    
    let rows = [];
    for (let d = 1; d <= 3; d++) {
        const zilchProb = BASELINE_DATA[d].zilchRate;
        const avgGain = BASELINE_DATA[d].avgGain;
        const remainingEV = (1 - zilchProb) * avgGain;
        
        // The opponent should only accept the inheritance if:
        // BankedPoints + RemainingEV > FreshEV
        // Therefore, MinBank = FreshEV - RemainingEV
        const minBank = Math.max(0, Math.floor(freshEV - remainingEV));
        
        rows.push(`| **${d} Dice** | **${(zilchProb * 100).toFixed(1)}%** | **${minBank} pts** |`);
    }
    return rows.join('\n');
}

function generateTestAppendix() {
    let rows = TEST_RESULTS.map(t => {
        const icon = t.passed ? '✅' : '❌';
        return `| ${t.name} | \`${t.roll}\` | ${t.expected} | ${icon} |`;
    });
    return rows.join('\n');
}

const reportContent = `
# 🎲 Zilch Strategy Guide: The Serendipity Creak Edition

## 1. The "Golden Rule" of 6 Dice
**Never, under any circumstances, stop when you have Hot Dice (6 dice remaining).**

*   **The Math:** Your chance of Zilching is only **${(BASELINE_DATA[6].zilchRate * 100).toFixed(1)}%**.
*   **The Logic:** Even if you have a massive turn total, the risk of losing it is statistically negligible compared to the massive scoring potential of a fresh 6-dice roll.

## 2. The 3-Dice Pivot Point
**3 dice is the "danger zone."**

*   **The Math:** You have a **${((1 - BASELINE_DATA[3].zilchRate) * 100).toFixed(2)}%** success rate with 3 dice, but that drops to **${((1 - BASELINE_DATA[2].zilchRate) * 100).toFixed(2)}%** once you go down to 2.
*   **Strategy:** If your current turn total is over **${calculateThreshold(3)} points** and you are down to 3 dice, Bank. The expected gain from rolling those 3 dice is not high enough to justify risking the points you already have.

## 3. Weaponizing the "Inheritance Rule"
**This is how you beat players who only look at their own score. You don't just bank points; you "gift" a bad hand to the next player.**

*   **The 'Trap' Play:** If you have 500 points and only 1 die left, STOP.
*   **The Result:** You bank your 500 points, and the next player is forced to choose: start at 0, or inherit your 500 points with a **${(BASELINE_DATA[1].zilchRate * 100).toFixed(2)}%** chance of Zilching immediately.
*   **Winning Tip:** If you leave them 1 or 2 dice, you aren't just being safe; you are actively trying to make them lose points.

### The "Handoff" Calculator
Use this table to know if your "gift" is actually a trap. The **Min. Bank to Bait** is the minimum points you must pass to make it mathematically correct for your opponent to take the risk. If you pass less than this, a smart opponent will just start fresh.

| Dice Passed | Opponent Zilch Risk | Min. Bank to Bait |
| :--- | :--- | :--- |
${generateInheritanceTable()}

## 4. Know Your Thresholds

| Dice Remaining | Max "Safe" Points | Logic |
| :--- | :--- | :--- |
| **6 Dice** | **Always Roll** | The risk is too low to ignore. |
| **5 Dice** | **~${calculateThreshold(5)} Points** | Only bank if you are already at a massive total. |
| **4 Dice** | **~${calculateThreshold(4)} Points** | Still relatively safe (${((1 - BASELINE_DATA[4].zilchRate) * 100).toFixed(0)}% success). |
| **3 Dice** | **~${calculateThreshold(3)} Points** | The "Pivot." Be very careful here. |
| **2 Dice** | **~${calculateThreshold(2)} Points** | A coin flip. Only roll if you have almost nothing. |
| **1 Die** | **~${calculateThreshold(1)} Points** | Effectively a "Death Sentence." Never roll. |

## Appendix: Engine Certification
The following tests were run against the scoring engine to ensure mathematical accuracy.

| Test Case | Roll Input | Expected Score | Pass |
| :--- | :--- | :--- | :--- |
${generateTestAppendix()}
`;

try {
    fs.writeFileSync('STRATEGY_GUIDE.md', reportContent.trim());
    console.log("Successfully generated STRATEGY_GUIDE.md");
} catch (err) {
    console.error("Error writing report:", err);
}