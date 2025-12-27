import fs from 'fs';

// Load simulation data
const STATS = JSON.parse(fs.readFileSync('comprehensive_stats.json', 'utf8'));
const TEST_RESULTS = JSON.parse(fs.readFileSync('test_results.json', 'utf8'));

function fmtPct(val) { return (val * 100).toFixed(2) + '%'; }
function fmtNum(val) { return val.toFixed(2); }

function calculateThreshold(dice) {
    const s = STATS[dice];
    if (s.zilchRate === 0) return Infinity;
    // Break-Even: CurrentTotal = (Success% * AvgGain) / Zilch%
    return Math.floor((s.successRate * s.avgGain) / s.zilchRate);
}

function generateRiskTable() {
    let rows = [];
    rows.push(`| Dice | Zilch % | Success % | Avg. Gain |`);
    rows.push(`| :--- | :--- | :--- | :--- |`);
    for (let d = 1; d <= 6; d++) {
        const s = STATS[d];
        rows.push(`| **${d}** | ${fmtPct(s.zilchRate)} | ${fmtPct(s.successRate)} | ${fmtNum(s.avgGain)} pts |`);
    }
    return rows.join('\n');
}

function generateEVTable() {
    let rows = [];
    rows.push(`| Dice | EV @ 0 pts | EV @ 500 pts | EV @ 1000 pts | Break-Even (Threshold) |`);
    rows.push(`| :--- | :--- | :--- | :--- | :--- |`);
    for (let d = 1; d <= 6; d++) {
        const s = STATS[d];
        const ev0 = s.evScenarios['0'];
        const ev500 = s.evScenarios['500'];
        const ev1000 = s.evScenarios['1000'];
        const threshold = calculateThreshold(d);
        const threshStr = threshold === Infinity ? "Always Roll" : `~${threshold} pts`;
        
        rows.push(`| **${d}** | ${fmtNum(ev0)} | ${fmtNum(ev500)} | ${fmtNum(ev1000)} | **${threshStr}** |`);
    }
    return rows.join('\n');
}

function generateSpecialTable() {
    let rows = [];
    rows.push(`| Dice | Small Straight | Large Straight | Full Straight | Three Pair |`);
    rows.push(`| :--- | :--- | :--- | :--- | :--- |`);
    for (let d = 4; d <= 6; d++) {
        const p = STATS[d].specialProbabilities;
        rows.push(`| **${d}** | ${fmtPct(p.smallStraight)} | ${fmtPct(p.largeStraight)} | ${fmtPct(p.fullStraight)} | ${fmtPct(p.threePair)} |`);
    }
    return rows.join('\n') + "\n\n*Note: 1-3 dice cannot form these combinations (0.00%).*";
}

function generateInheritanceTable() {
    const freshEV = STATS[6].evScenarios['0'];
    let rows = [];
    rows.push(`| Dice Passed | Opponent Zilch Risk | Bait Value (Min Bank) |`);
    rows.push(`| :--- | :--- | :--- |`);

    for (let d = 1; d <= 3; d++) {
        const s = STATS[d];
        // Min Bank = (FreshEV / SuccessRate) - AvgGain
        const minBank = (freshEV / s.successRate) - s.avgGain;
        rows.push(`| **${d} Dice** | **${fmtPct(s.zilchRate)}** | **${Math.ceil(minBank)} pts** |`);
    }
    return rows.join('\n');
}

function generateDecisionMatrix() {
    const ranges = [0, 300, 600, 1000];
    const rangeLabels = ["0-300", "300-600", "600-1000", "1000+"];
    
    let table = "```text\n";
    table += "Turn Total | 1 Die | 2 Dice | 3 Dice | 4 Dice | 5 Dice | 6 Dice\n";
    table += "-----------|-------|--------|--------|--------|--------|-------\n";
    
    rangeLabels.forEach((label, idx) => {
        const midPoint = ranges[idx] + 150; 
        let row = label.padEnd(11) + "|";
        for (let d = 1; d <= 6; d++) {
            const thresh = calculateThreshold(d);
            let action = "ROLL";
            if (thresh !== Infinity) {
                if (midPoint < thresh * 0.8) action = "ROLL";
                else if (midPoint > thresh * 1.1) action = "BANK";
                else action = "RISKY";
            }
            row += (" " + action).padEnd(7) + "|";
        }
        table += row + "\n";
    });
    table += "```";
    table += "\n**Legend:**\n";
    table += "*   **ROLL:** Positive EV. Statistically safe.\n";
    table += "*   **BANK:** Negative EV. You are likely to lose points by rolling.\n";
    table += "*   **RISKY:** Marginal EV (near zero). Context dependent (e.g., are you chasing?).";
    return table;
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

## 1. Executive Summary & Risk Analysis
This guide is generated from **1,000,000** Monte Carlo simulations per die count.

### Consolidated Risk Table
${generateRiskTable()}

### Expected Value (EV) Analysis
The "Break-Even" point is where the expected gain from rolling equals the potential loss of your current turn total.
**Formula:** \`EV = (Success% * AvgGain) - (Zilch% * CurrentTurnTotal)\`

${generateEVTable()}

## 2. Special Combinations
Frequency of rolling high-value combinations.

${generateSpecialTable()}

## 3. Tactical Guide

### Opening Turn Strategy
With 6 dice, your EV starting from 0 is **${fmtNum(STATS[6].evScenarios['0'])} points**.
*   **The 400 Point Paradox:** While the math suggests rolling until you hit a much higher threshold, banking at **~400 points** on your first turn is a valid "Tempo Play."
*   **Why?** It secures a lead and often leaves the next player with a difficult inheritance (1 or 2 dice), forcing them to take a risk or start fresh.

### Endgame Tactics
*   **Conservative Play:** If you are leading, adhere strictly to the **Break-Even Thresholds**. Do not give opponents a chance to catch up by taking unnecessary risks.
*   **Chasing:** If you are behind, you must take "Negative EV" risks. Use the **EV Table** to see how much "theoretical value" you are sacrificing for a chance to win.
*   **Final Round Inheritance:** If the player before you banks a low score (< 300) and leaves you 1 or 2 dice, **Start Fresh**. The risk of Zilching immediately is too high compared to the potential gain of a fresh 6-dice roll.

### Multiplayer Dynamics: The "Blocking Strategy"
Banking is not just about securing points; it's about **weaponizing the Inheritance Rule**.
*   **The Trap:** Leaving an opponent with 1 die (Zilch Risk: **${fmtPct(STATS[1].zilchRate)}**) or 2 dice (Zilch Risk: **${fmtPct(STATS[2].zilchRate)}**) is a powerful defensive move.
*   **When to Trap:** If you have a moderate score (e.g., 400-500) and are down to 1 or 2 dice, **BANK**. You force the next player to choose between a high-risk inheritance or starting from 0 (negating your "gift").

#### Inheritance Bait Calculator
Use this table to determine if your banked score is high enough to "bait" a mathematically perfect opponent into taking a bad risk.
*   **Bait Value:** The minimum points you must pass to make it mathematically correct (Positive EV) for your opponent to take the risk.

${generateInheritanceTable()}

## 4. Decision Tools

### Risk/Reward Decision Matrix
Quick reference for mid-game decisions.
${generateDecisionMatrix()}

### Inheritance Decision Tree
*   **Incoming Dice: 1**
    *   Banked Points > **Bait Value**? -> **INHERIT** (High Risk, but mathematically justified)
    *   Else -> **FRESH START**
*   **Incoming Dice: 2**
    *   Banked Points > **Bait Value**? -> **INHERIT**
    *   Else -> **FRESH START**
*   **Incoming Dice: 3+**
    *   Generally **INHERIT** unless banked points are negligible (< 100).

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