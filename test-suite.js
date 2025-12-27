import { calculateScore } from './engine.js';
import fs from 'fs';

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    cyan: "\x1b[36m",
    dim: "\x1b[2m",
    yellow: "\x1b[33m"
};

// --- Part 1: Named Test Cases (Semantic Checks) ---
let namedTests = [];
try {
    namedTests = JSON.parse(fs.readFileSync('test_cases.json', 'utf8'));
} catch (e) {
    console.error(`${colors.red}Error: Could not load test_cases.json${colors.reset}`);
    process.exit(1);
}

console.log(`${colors.cyan}${colors.bright}\n--- Engine Validation Suite ---${colors.reset}`);
console.log(`${colors.bright}Running ${namedTests.length} Named Scenarios...${colors.reset}`);

const namedResults = namedTests.map(test => {
    const result = calculateScore(test.roll);
    const passed = result.score === test.expected;
    return {
        name: test.name,
        roll: JSON.stringify(test.roll),
        expected: test.expected,
        actual: result.score,
        passed: passed
    };
});

const namedFailures = namedResults.filter(r => !r.passed);
if (namedFailures.length > 0) {
    console.table(namedFailures);
    console.error(`${colors.red}❌ ${namedFailures.length} named tests failed!${colors.reset}`);
} else {
    console.log(`${colors.green}✅ Named tests passed.${colors.reset}`);
}

// Save named results for report generation
fs.writeFileSync('test_results.json', JSON.stringify(namedResults, null, 2));
console.log(`${colors.dim}Named results saved to test_results.json${colors.reset}`);

// --- Part 2: Exhaustive Permutation Analysis ---
console.log(`\n${colors.cyan}--- Exhaustive Permutation Analysis ---${colors.reset}`);

function generatePermutations(numDice) {
    const results = [];
    function backtrack(current) {
        if (current.length === numDice) {
            results.push([...current]);
            return;
        }
        for (let i = 1; i <= 6; i++) {
            current.push(i);
            backtrack(current);
            current.pop();
        }
    }
    backtrack([]);
    return results;
}

const allVariances = [];
for (let d = 1; d <= 6; d++) {
    allVariances.push(...generatePermutations(d));
}

console.log(`Generated ${allVariances.length.toLocaleString()} unique variances (permutations).`);

const SNAPSHOT_FILE = 'exhaustive_snapshot.json';
let snapshot = {};
let snapshotExists = false;

try {
    snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_FILE, 'utf8'));
    snapshotExists = true;
} catch (e) {
    console.log(`${colors.yellow}No snapshot found. Generating baseline...${colors.reset}`);
}

let exhaustiveFailures = 0;
const newSnapshot = {};

allVariances.forEach(roll => {
    const key = JSON.stringify(roll);
    const result = calculateScore(roll);
    newSnapshot[key] = result.score;

    if (snapshotExists) {
        const expected = snapshot[key];
        if (expected === undefined) {
            // New variance found (e.g. if we increased dice count)
        } else if (expected !== result.score) {
            console.error(`${colors.red}❌ Regression: ${key} Expected ${expected}, Got ${result.score}${colors.reset}`);
            exhaustiveFailures++;
        }
    }
});

if (!snapshotExists) {
    fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(newSnapshot, null, 2));
    console.log(`${colors.green}✅ Baseline snapshot created: ${SNAPSHOT_FILE}${colors.reset}`);
} else if (exhaustiveFailures === 0) {
    console.log(`${colors.green}✅ All ${allVariances.length.toLocaleString()} variances match snapshot.${colors.reset}`);
} else {
    console.error(`${colors.red}❌ ${exhaustiveFailures} exhaustive tests failed!${colors.reset}`);
}

if (namedFailures.length > 0 || exhaustiveFailures > 0) {
    console.error(`\n${colors.red}${colors.bright}❌ Validation Failed${colors.reset}`);
    process.exit(1);
} else {
    console.log(`\n${colors.green}${colors.bright}✅ All Systems Operational${colors.reset}\n`);
}