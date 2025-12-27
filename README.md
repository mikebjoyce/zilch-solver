# 🎲 Zilch Solver: Serendipity Creak Edition

A **data-driven simulation and strategy suite** for the dice game Zilch, calibrated for the Serendipity Creak ruleset. This project uses **Monte Carlo simulations** and **Game Theory (Expected Value)** to determine optimal banking thresholds and weaponize the **"Inheritance Rule."**

---

## 🚀 Overview

This repository contains a full-stack probability engine for Zilch:

* **Scoring Engine:** Robust validator for all Zilch scoring combinations (Sets, Straights, Three Pair, etc.)
* **Monte Carlo Solver:** Simulation scripts running millions of rolls to find true Zilch rates and average gains
* **Strategy Reporting:** Automated tool generating comprehensive, data-backed strategy guides

---

## 🛠 Project Structure

```
zilch-solver/
├── engine.js              # Core scoring logic (Singles, Sets, Straights)
├── probabilities.js       # Large-scale simulations (1M+ iterations)
├── sabotage.js            # Inheritance Rule trap analysis
├── generate-report.js     # Automated strategy report generator
├── RULES.md               # Human-readable game ruleset
└── STRATEGY_GUIDE.md      # Generated simulation results
```

### Module Descriptions

* **`engine.js`:** Handles all scoring from single 1s/5s to complex Full Straights
* **`probabilities.js`:** Calculates success rates and average scores per die count
* **`sabotage.js`:** Analyzes opponent-trapping tactics via Inheritance Rule
* **`generate-report.js`:** Consumes simulation data, writes `STRATEGY_GUIDE.md`

---

## 📊 Getting Started

### Prerequisites

* **Node.js** (v16+ recommended)

### Installation

```bash
git clone https://github.com/your-username/zilch-solver.git
cd zilch-solver
npm install
```

### Usage

**Run full simulation suite and generate strategy guide:**

```bash
node index.js
```

This executes all probability calculations and outputs `STRATEGY_GUIDE.md` with complete analysis.

**Run individual modules:**

```bash
node probabilities.js    # Calculate Zilch rates and expected values
node sabotage.js         # Analyze inheritance traps
```

---

## 🎯 Key Strategy Insights

According to **100,000,000 simulations per die count:**

* **Never stop on 6 dice:** 2.31% Zilch risk is negligible compared to potential 475-point average gain
* **The 3-Dice Pivot:** Most critical decision point. Banking threshold ≈ **312 points**
* **The 1-Die Trap:** Banking with 1 die remaining forces 66.67% Zilch probability on opponent
* **Break-Even Thresholds:** Rolling is mathematically correct until you reach specific turn totals (see table below)

### Quick Reference: When to Bank

| Dice Remaining | Break-Even Threshold | Risk if Rolling |
|:---------------|:---------------------|:----------------|
| **6** | ~20,047 pts | 2.31% Zilch |
| **5** | ~3,185 pts | 7.72% Zilch |
| **4** | ~911 pts | 15.75% Zilch |
| **3** | **~312 pts** | 27.78% Zilch |
| **2** | ~113 pts | 44.44% Zilch |
| **1** | ~37 pts | 66.67% Zilch |

---

## 📜 Game Rules: Serendipity Creak Edition

### Objective

**Be the player with the highest score over 10,000 points** after the final round is triggered.

---

### 🛠 Turn Structure

1. **The Roll:** Roll 6 dice on your turn

2. **Scoring Requirement:** After every roll, set aside **at least one** scoring die or set

3. **Zilch:** If a roll contains **no scoring dice**, you "Zilch" and **lose all turn points**

4. **Decision Phase:** After setting aside scoring dice:
   - **Bank:** Add turn total to game score, end turn
   - **Roll:** Roll remaining dice to increase turn total

5. **Hot Dice:** If all 6 dice score, **roll all 6 again** to continue turn

---

### 🤝 The Inheritance Rule (Passing)

When a player **Banks**, their turn total and remaining dice pass to the next player.

**Next player's options:**
- **Fresh Start:** New turn with 6 dice, 0 points
- **Inherit:** Start with banked points in running total, roll only remaining dice

**⚠️ Risk:** If inheritor Zilches, they **lose inherited points** and end turn immediately.

---

### 📊 Scoring Table

**Points calculated only from dice in current roll.** Set-aside dice don't combine with new dice.

#### Single Dice
- **[1]:** 100 points
- **[5]:** 50 points

#### Multiples (Sets)

| Number | 3-of-a-Kind | 4-of-a-Kind | 5-of-a-Kind | 6-of-a-Kind |
|:-------|:------------|:------------|:------------|:------------|
| **[1]s** | 1000 | 2000 | 4000 | 8000 |
| **[2]s** | 200 | 400 | 800 | 1600 |
| **[3]s** | 300 | 600 | 1200 | 2400 |
| **[4]s** | 400 | 800 | 1600 | 3200 |
| **[5]s** | 500 | 1000 | 2000 | 4000 |
| **[6]s** | 600 | 1200 | 2400 | 4800 |

#### Special Combinations
- **Small Straight [1,2,3,4,5]:** 750 points *(5 dice)*
- **Large Straight [2,3,4,5,6]:** 750 points *(5 dice)*
- **Full Straight [1,2,3,4,5,6]:** 1500 points *(6 dice)*
- **Three Pair** *(e.g., 1-1, 2-2, 3-3):* 1500 points *(6 dice)*

---

### 🏆 Winning the Game

Once a player reaches **10,000 points**, the **Final Round** triggers.

Every other player gets **one more turn** to beat the high score.

**Highest total score wins.**

---

## 📈 Complete Strategy Guide

*This section generated from 1,000,000 Monte Carlo simulations per die count.*

### Consolidated Risk Table

| Dice | Zilch % | Success % | Avg. Gain |
|:-----|:--------|:----------|:----------|
| **1** | 66.67% | 33.33% | 75.00 pts |
| **2** | 44.44% | 55.56% | 90.00 pts |
| **3** | 27.78% | 72.22% | 120.19 pts |
| **4** | 15.75% | 84.25% | 170.34 pts |
| **5** | 7.72% | 92.28% | 266.42 pts |
| **6** | 2.31% | 97.69% | 475.06 pts |

---

### Expected Value (EV) Analysis

**Break-Even Point:** Expected gain from rolling equals potential loss of current turn total.

**Formula:** `EV = (Success% × AvgGain) - (Zilch% × CurrentTurnTotal)`

| Dice | EV @ 0 pts | EV @ 500 pts | EV @ 1000 pts | Break-Even Threshold |
|:-----|:-----------|:-------------|:--------------|:---------------------|
| **1** | 25.00 | -308.36 | -641.73 | **~37 pts** |
| **2** | 50.00 | -172.21 | -394.43 | **~113 pts** |
| **3** | 86.80 | -52.10 | -191.00 | **~312 pts** |
| **4** | 143.52 | 64.78 | -13.95 | **~911 pts** |
| **5** | 245.85 | 207.26 | 168.66 | **~3185 pts** |
| **6** | 464.06 | 452.49 | 440.91 | **~20047 pts** |

---

### Special Combinations Frequency

| Dice | Small Straight | Large Straight | Full Straight | Three Pair |
|:-----|:---------------|:---------------|:--------------|:-----------|
| **4** | 0.00% | 0.00% | 0.00% | 0.00% |
| **5** | 1.54% | 1.54% | 0.00% | 0.00% |
| **6** | 3.86% | 3.86% | 1.54% | 4.50% |

*Note: 1-3 dice cannot form these combinations.*

---

### Tactical Guide

#### Opening Turn Strategy

With 6 dice, your EV starting from 0 is **464.06 points**.

* **The 400-Point Paradox:** Math suggests rolling to higher thresholds, but banking at **~400 points** is a valid **"Tempo Play"**
* **Why?** Secures early lead, forces next player into difficult inheritance (1-2 dice), making them risk or restart

#### Endgame Tactics

* **Conservative Play (Leading):** Strictly follow Break-Even Thresholds. Don't give opponents comeback chances
* **Chasing (Behind):** Take "Negative EV" risks. Use EV Table to quantify theoretical value sacrificed
* **Final Round Inheritance:** If previous player banks <300 with 1-2 dice, **Start Fresh**. Immediate Zilch risk too high vs. fresh 6-dice potential

#### Multiplayer Dynamics: The "Blocking Strategy"

Banking weaponizes the **Inheritance Rule**.

* **The Trap:** Leave opponent with 1 die (66.66% Zilch) or 2 dice (44.51% Zilch)
* **When to Trap:** Moderate score (400-500) + down to 1-2 dice → **BANK**. Forces next player into high-risk inherit or restart (negating your "gift")

---

### Inheritance Bait Calculator

**Bait Value:** Minimum points to make it mathematically correct (Positive EV) for opponent to risk inheritance.

| Dice Passed | Opponent Zilch Risk | Bait Value (Min Bank) |
|:------------|:--------------------|:----------------------|
| **1 Die** | **66.67%** | **1318 pts** |
| **2 Dice** | **44.44%** | **746 pts** |
| **3 Dice** | **27.78%** | **523 pts** |

---

### Risk/Reward Decision Matrix

Quick reference for mid-game decisions.

| Turn Total | 1 Die | 2 Dice | 3 Dice | 4 Dice | 5 Dice | 6 Dice |
|:-----------|:------|:-------|:-------|:-------|:-------|:-------|
| **0-300** | BANK | BANK | ROLL | ROLL | ROLL | ROLL |
| **300-600** | BANK | BANK | BANK | ROLL | ROLL | ROLL |
| **600-1000** | BANK | BANK | BANK | RISKY | ROLL | ROLL |
| **1000+** | BANK | BANK | BANK | BANK | ROLL | ROLL |

**Legend:**
* **ROLL:** Positive EV. Statistically safe
* **BANK:** Negative EV. Likely to lose points by rolling
* **RISKY:** Marginal EV (≈0). Context-dependent (chasing? leading?)

---

### Inheritance Decision Tree

**Incoming Dice: 1**
- Banked Points > Bait Value? → **INHERIT** (High risk, mathematically justified)
- Else → **FRESH START**

**Incoming Dice: 2**
- Banked Points > Bait Value? → **INHERIT**
- Else → **FRESH START**

**Incoming Dice: 3+**
- Generally **INHERIT** unless banked points negligible (<100)

---

## 📜 License

This project is open-source and available under the **MIT License**.

---


**Built with probability. Powered by data. Optimized for victory.** 🎲