import { execSync } from 'child_process';

const args = process.argv.slice(2);
const inputIterations = args[0] ? parseInt(args[0].replace(/_/g, ''), 10) : NaN;
const SIMULATION_ITERATIONS = !isNaN(inputIterations) ? inputIterations : 10000000;
const env = { ...process.env, SIMULATION_ITERATIONS };

// ANSI color codes for prettier output
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    red: "\x1b[31m",
};

const steps = [
    { name: "Running Validation Suite", script: "test-suite.js" },
    { name: "Running Simulations", script: "probabilities.js" },
    { name: "Generating Strategy Report", script: "generate-report.js" },
    { name: "Generating Hand Analysis Report", script: "generate-analysis-report.js" },
    { name: "Running Sabotage Analysis", script: "sabotage.js" },
    { name: "Updating Documentation", script: "update-readme.js" },
    { name: "Displaying Console Guide", script: "guide.js" }
];

function drawProgressBar(current, total) {
    const width = 40;
    const percent = Math.min(100, Math.round((current / total) * 100));
    const filled = Math.round((width * current) / total);
    const empty = width - filled;
    const bar = "█".repeat(filled) + "░".repeat(empty);
    return `${colors.blue}[${bar}] ${percent}%${colors.reset}`;
}

console.log(colors.cyan + colors.bright + "\n========================================");
console.log("   ZILCH SOLVER - FULL CYCLE EXECUTION");
console.log("========================================" + colors.reset);
console.log(colors.dim + `Configuration: ${SIMULATION_ITERATIONS.toLocaleString()} iterations` + colors.reset + "\n");

const startTime = Date.now();

try {
    steps.forEach((step, index) => {
        console.log(drawProgressBar(index, steps.length));
        console.log(`${colors.yellow}${colors.bright}Step ${index + 1}/${steps.length}: ${step.name}...${colors.reset}`);
        
        const stepStart = Date.now();
        execSync(`node ${step.script}`, { stdio: 'inherit', env });
        const stepDuration = ((Date.now() - stepStart) / 1000).toFixed(2);
        
        console.log(`${colors.green}✔ Completed in ${stepDuration}s${colors.reset}\n`);
    });

    console.log(drawProgressBar(steps.length, steps.length));
    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n${colors.green}${colors.bright}✅ Cycle Complete!${colors.reset}`);
    console.log(`Total execution time: ${totalDuration}s`);
    console.log(colors.dim + "Check STRATEGY_GUIDE.md and ANALYSIS_RESULTS.md for results." + colors.reset + "\n");
} catch (error) {
    console.error(`\n${colors.red}❌ Error during execution:${colors.reset}`, error.message);
    process.exit(1);
}