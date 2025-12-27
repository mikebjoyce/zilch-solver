import { calculateScore } from './engine.js';
import fs from 'fs';

const tests = [
    { name: "Single 1", roll: [1], expected: 100 },
    { name: "Single 5", roll: [5], expected: 50 },
    { name: "Three 1s", roll: [1, 1, 1], expected: 1000 },
    { name: "Three 2s", roll: [2, 2, 2], expected: 200 },
    { name: "Three 6s", roll: [6, 6, 6], expected: 600 },
    { name: "Four 1s", roll: [1, 1, 1, 1], expected: 2000 },
    { name: "Five 1s", roll: [1, 1, 1, 1, 1], expected: 4000 },
    { name: "Six 1s", roll: [1, 1, 1, 1, 1, 1], expected: 8000 },
    { name: "Small Straight", roll: [1, 2, 3, 4, 5], expected: 750 },
    { name: "Large Straight", roll: [2, 3, 4, 5, 6], expected: 750 },
    { name: "Full Straight", roll: [1, 2, 3, 4, 5, 6], expected: 1500 },
    { name: "Three Pair", roll: [1, 1, 2, 2, 3, 3], expected: 1500 },
    { name: "Two Triplets", roll: [1, 1, 1, 2, 2, 2], expected: 1500 },
    { name: "Zilch (No Score)", roll: [2, 3, 4, 6, 2, 3], expected: 0 }
];

console.log("--- Engine Validation Suite ---");

const results = tests.map(test => {
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

console.table(results);

const allPassed = results.every(r => r.passed);

if (!allPassed) {
    console.error("❌ Some tests failed!");
    // We do not exit(1) so the report generation can still attempt to run, 
    // but in a real CI this would fail the build.
} else {
    console.log("✅ All tests passed!");
}

fs.writeFileSync('test_results.json', JSON.stringify(results, null, 2));