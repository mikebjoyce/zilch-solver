import { execSync } from 'child_process';

const SIMULATION_ITERATIONS = 10000000;
const env = { ...process.env, SIMULATION_ITERATIONS };

console.log("🚀 Starting Zilch Solver Full Cycle...");
console.log(`ℹ️  Simulation Iterations: ${SIMULATION_ITERATIONS.toLocaleString()}`);

try {
    console.log("\n1️⃣  Running Simulations (probabilities.js)...");
    // Run the probability simulation script
    execSync('node probabilities.js', { stdio: 'inherit', env });

    console.log("\n2️⃣  Running Validation Suite (test-suite.js)...");
    // Run the validation script
    execSync('node test-suite.js', { stdio: 'inherit', env });

    console.log("\n3️⃣  Generating Strategy Report (generate-report.js)...");
    // Run the report generation script
    execSync('node generate-report.js', { stdio: 'inherit', env });

    console.log("\n4️⃣  Generating Hand Analysis Report (generate-analysis-report.js)...");
    // Run the analysis report generation script
    execSync('node generate-analysis-report.js', { stdio: 'inherit', env });

    console.log("\n✅  Cycle Complete! Check STRATEGY_GUIDE.md and ANALYSIS_RESULTS.md for results.");
} catch (error) {
    console.error("\n❌  Error during execution:", error.message);
}