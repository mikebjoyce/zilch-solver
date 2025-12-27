import fs from 'fs';

const STATS = JSON.parse(fs.readFileSync('comprehensive_stats.json', 'utf8'));

function generateGuide() {
    console.log("=== ZILCH OPTIMAL STRATEGY GUIDE ===");
    console.log("Rule: If your current turn total is ABOVE the threshold, BANK.\n");
    
    const tableData = [];

    for (let dice = 1; dice <= 6; dice++) {
        const zilchProb = STATS[dice].zilchRate;
        const successProb = 1 - zilchProb;
        const avgGain = STATS[dice].avgGain;

        /* The 'Break Even' point is where:
           (SuccessProb * AvgGain) = (ZilchProb * CurrentTotal)
           Solving for CurrentTotal:
           CurrentTotal = (SuccessProb * AvgGain) / ZilchProb
        */
        const threshold = (successProb * avgGain) / zilchProb;

        tableData.push({
            "Dice in Hand": dice,
            "Zilch Risk": (zilchProb * 100).toFixed(1) + "%",
            "Banking Threshold": Math.floor(threshold) + " points",
            "Action": `Roll if under ${Math.floor(threshold)}`
        });
    }

    console.table(tableData);
}

generateGuide();