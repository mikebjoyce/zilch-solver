import fs from 'fs';

const README_PATH = 'README.md';
const STATS_PATH = 'comprehensive_stats.json';

const SIMULATION_ITERATIONS = process.env.SIMULATION_ITERATIONS ? parseInt(process.env.SIMULATION_ITERATIONS) : 0;

if (!fs.existsSync(README_PATH) || !fs.existsSync(STATS_PATH)) {
    console.log("Missing required files for README update. Skipping.");
    process.exit(0);
}

let readmeContent = fs.readFileSync(README_PATH, 'utf8');
const stats = JSON.parse(fs.readFileSync(STATS_PATH, 'utf8'));

// 1. Check Iteration Count
const iterationRegex = /According to \*\*([0-9,]+) simulations per die count:\*\*/;
const match = readmeContent.match(iterationRegex);

if (match) {
    const currentIterations = parseInt(match[1].replace(/,/g, ''));
    if (SIMULATION_ITERATIONS <= currentIterations) {
        console.log(`Current iterations (${SIMULATION_ITERATIONS}) not higher than README (${currentIterations}). Skipping update.`);
        process.exit(0);
    }
}

console.log("Updating README.md with new simulation data...");

// Helpers
const getZilchPct = (d) => (stats[d].zilchRate * 100).toFixed(2) + "%";
const getAvgGain = (d) => stats[d].avgGain.toFixed(0);
const getAvgGainFloat = (d) => stats[d].avgGain.toFixed(2);
const getBreakEven = (d) => {
    const s = 1 - stats[d].zilchRate;
    const g = stats[d].avgGain;
    const z = stats[d].zilchRate;
    return Math.round((s * g) / z);
};

function generateTable(headers, alignments, rows) {
    const headerLine = `| ${headers.join(' | ')} |`;
    const separator = `|${alignments.join('|')}|`;
    return `${headerLine}\n${separator}\n${rows.map(r => `| ${r.join(' | ')} |`).join('\n')}`;
}

// 2. Update Iteration Count Text
readmeContent = readmeContent.replace(
    iterationRegex,
    `According to **${SIMULATION_ITERATIONS.toLocaleString()} simulations per die count:**`
);

// 3. Update Key Strategy Insights
const newInsights = `* **Never stop on 6 dice:** ${getZilchPct(6)} Zilch risk is negligible compared to potential ${getAvgGain(6)}-point average gain
* **The 3-Dice Pivot:** Most critical decision point. Banking threshold ≈ **${getBreakEven(3)} points**
* **The 1-Die Trap:** Banking with 1 die remaining forces ${getZilchPct(1)} Zilch probability on opponent
* **Break-Even Thresholds:** Rolling is mathematically correct until you reach specific turn totals (see table below)`;

readmeContent = readmeContent.replace(
    /(\* \*\*Never stop on 6 dice:\*\*.*(\n|.)*?)(\n\n### Quick Reference)/,
    `${newInsights}$3`
);

// 4. Update Quick Reference Table
const quickRefRows = [];
for (let d = 6; d >= 1; d--) {
    const threshold = getBreakEven(d);
    const risk = getZilchPct(d);
    const thresholdStr = d === 3 ? `**~${threshold} pts**` : `~${threshold.toLocaleString()} pts`;
    quickRefRows.push([`**${d}**`, thresholdStr, `${risk} Zilch`]);
}
const quickRefTable = generateTable(
    ["Dice Remaining", "Break-Even Threshold", "Risk if Rolling"],
    [":---------------", ":---------------------", ":----------------"],
    quickRefRows
);
readmeContent = readmeContent.replace(
    /\| Dice Remaining \| Break-Even Threshold \| Risk if Rolling \|\n\|:[-]+\|:[-]+\|:[-]+\|\n(\|.*\|\n)+/,
    quickRefTable + '\n'
);

// 5. Update Consolidated Risk Table
const riskRows = [];
for (let d = 1; d <= 6; d++) {
    riskRows.push([
        `**${d}**`,
        getZilchPct(d),
        (100 - stats[d].zilchRate * 100).toFixed(2) + "%",
        getAvgGainFloat(d) + " pts"
    ]);
}
const riskTable = generateTable(
    ["Dice", "Zilch %", "Success %", "Avg. Gain"],
    [":-----", ":--------", ":----------", ":----------"],
    riskRows
);
readmeContent = readmeContent.replace(
    /\| Dice \| Zilch % \| Success % \| Avg. Gain \|\n\|:[-]+\|:[-]+\|:[-]+\|:[-]+\|\n(\|.*\|\n)+/,
    riskTable + '\n'
);

// 6. Update EV Analysis Table
const evRows = [];
for (let d = 1; d <= 6; d++) {
    const s = 1 - stats[d].zilchRate;
    const g = stats[d].avgGain;
    const z = stats[d].zilchRate;
    const ev0 = (s * g).toFixed(2);
    const ev500 = ((s * g) - (z * 500)).toFixed(2);
    const ev1000 = ((s * g) - (z * 1000)).toFixed(2);
    const be = Math.round((s * g) / z);
    evRows.push([`**${d}**`, ev0, ev500, ev1000, `**~${be} pts**`]);
}
const evTable = generateTable(
    ["Dice", "EV @ 0 pts", "EV @ 500 pts", "EV @ 1000 pts", "Break-Even Threshold"],
    [":-----", ":-----------", ":-------------", ":--------------", ":---------------------"],
    evRows
);
readmeContent = readmeContent.replace(
    /\| Dice \| EV @ 0 pts \| EV @ 500 pts \| EV @ 1000 pts \| Break-Even Threshold \|\n\|:[-]+\|:[-]+\|:[-]+\|:[-]+\|:[-]+\|\n(\|.*\|\n)+/,
    evTable + '\n'
);

// 7. Update Special Combinations Frequency
const specialRows = [];
for (let d = 4; d <= 6; d++) {
    const ss = (stats[d].specialProbabilities.smallStraight * 100).toFixed(2) + "%";
    const ls = (stats[d].specialProbabilities.largeStraight * 100).toFixed(2) + "%";
    const fsVal = (stats[d].specialProbabilities.fullStraight * 100).toFixed(2) + "%";
    const tp = (stats[d].specialProbabilities.threePair * 100).toFixed(2) + "%";
    specialRows.push([`**${d}**`, ss, ls, fsVal, tp]);
}
const specialTable = generateTable(
    ["Dice", "Small Straight", "Large Straight", "Full Straight", "Three Pair"],
    [":-----", ":---------------", ":---------------", ":--------------", ":-----------"],
    specialRows
);
readmeContent = readmeContent.replace(
    /\| Dice \| Small Straight \| Large Straight \| Full Straight \| Three Pair \|\n\|:[-]+\|:[-]+\|:[-]+\|:[-]+\|:[-]+\|\n(\|.*\|\n)+/,
    specialTable + '\n'
);

// 8. Update Inheritance Bait Calculator
const freshStartEV = (1 - stats[6].zilchRate) * stats[6].avgGain;
const baitRows = [];
for (let d = 1; d <= 3; d++) {
    const s = 1 - stats[d].zilchRate;
    const g = stats[d].avgGain;
    const bait = Math.ceil((freshStartEV - (s * g)) / s);
    baitRows.push([
        `**${d} ${d===1?'Die':'Dice'}**`,
        `**${getZilchPct(d)}**`,
        `**${bait} pts**`
    ]);
}
const baitTable = generateTable(
    ["Dice Passed", "Opponent Zilch Risk", "Bait Value (Min Bank)"],
    [":------------", ":--------------------", ":----------------------"],
    baitRows
);
readmeContent = readmeContent.replace(
    /\| Dice Passed \| Opponent Zilch Risk \| Bait Value \(Min Bank\) \|\n\|:[-]+\|:[-]+\|:[-]+\|\n(\|.*\|\n)+/,
    baitTable + '\n'
);

// 9. Update Opening Turn Strategy Text
const ev6 = freshStartEV.toFixed(2);
readmeContent = readmeContent.replace(
    /With 6 dice, your EV starting from 0 is \*\*[0-9.]+ points\*\*/,
    `With 6 dice, your EV starting from 0 is **${ev6} points**`
);

// 10. Update Risk/Reward Decision Matrix
const ranges = [0, 300, 600, 1000];
const rangeLabels = ["0-300", "300-600", "600-1000", "1000+"];
const matrixHeaders = ["Turn Total", "1 Die", "2 Dice", "3 Dice", "4 Dice", "5 Dice", "6 Dice"];
const matrixAlignments = [":-----------", ":------", ":-------", ":-------", ":-------", ":-------", ":-------"];
const matrixRows = [];

rangeLabels.forEach((label, idx) => {
    const midPoint = ranges[idx] + 150;
    const row = [`**${label}**`];
    
    for (let d = 1; d <= 6; d++) {
        const threshold = getBreakEven(d);
        let action = "ROLL";
        
        if (midPoint < threshold * 0.8) action = "ROLL";
        else if (midPoint > threshold * 1.1) action = "BANK";
        else action = "RISKY";
        
        row.push(action);
    }
    matrixRows.push(row);
});

const matrixTable = generateTable(matrixHeaders, matrixAlignments, matrixRows);

readmeContent = readmeContent.replace(
    /(### Risk\/Reward Decision Matrix\n\nQuick reference for mid-game decisions\.\n\n)([\s\S]*?)(\n\n\*\*Legend:\*\*)/,
    `$1${matrixTable}$3`
);

fs.writeFileSync(README_PATH, readmeContent);
console.log("README.md updated successfully.");