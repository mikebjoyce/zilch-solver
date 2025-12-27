import { execSync } from 'child_process';

console.log("🚀 Starting Zilch Solver Full Cycle...");

try {
    console.log("\n1️⃣  Running Simulations (probabilities.js)...");
    // Run the probability simulation script
    execSync('node probabilities.js', { stdio: 'inherit' });

    console.log("\n2️⃣  Running Validation Suite (test-suite.js)...");
    // Run the validation script
    execSync('node test-suite.js', { stdio: 'inherit' });

    console.log("\n3️⃣  Generating Strategy Report (generate-report.js)...");
    // Run the report generation script
    execSync('node generate-report.js', { stdio: 'inherit' });

    console.log("\n✅  Cycle Complete! Check STRATEGY_GUIDE.md for results.");
} catch (error) {
    console.error("\n❌  Error during execution:", error.message);
}