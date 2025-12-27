# 🎲 Zilch Strategy Guide: The Serendipity Creak Edition

## 1. Executive Summary & Risk Analysis
This guide is generated from **10,000,000** Monte Carlo simulations per die count.

### Consolidated Risk Table
| Dice | Zilch % | Success % | Avg. Gain |
| :--- | :--- | :--- | :--- |
| **1** | 66.66% | 33.34% | 75.02 pts |
| **2** | 44.44% | 55.56% | 89.98 pts |
| **3** | 27.78% | 72.22% | 120.15 pts |
| **4** | 15.74% | 84.26% | 170.36 pts |
| **5** | 7.71% | 92.29% | 266.35 pts |
| **6** | 2.32% | 97.68% | 475.14 pts |

### Expected Value (EV) Analysis
The "Break-Even" point is where the expected gain from rolling equals the potential loss of your current turn total.
**Formula:** `EV = (Success% * AvgGain) - (Zilch% * CurrentTurnTotal)`

| Dice | EV @ 0 pts | EV @ 500 pts | EV @ 1000 pts | Break-Even (Threshold) |
| :--- | :--- | :--- | :--- | :--- |
| **1** | 25.01 | -308.28 | -641.58 | **~37 pts** |
| **2** | 49.99 | -172.22 | -394.43 | **~112 pts** |
| **3** | 86.77 | -52.13 | -191.03 | **~312 pts** |
| **4** | 143.54 | 64.83 | -13.88 | **~911 pts** |
| **5** | 245.81 | 207.25 | 168.68 | **~3187 pts** |
| **6** | 464.13 | 452.53 | 440.94 | **~20017 pts** |

## 2. Special Combinations
Frequency of rolling high-value combinations.

| Dice | Small Straight | Large Straight | Full Straight | Three Pair |
| :--- | :--- | :--- | :--- | :--- |
| **4** | 0.00% | 0.00% | 0.00% | 0.00% |
| **5** | 1.54% | 1.54% | 0.00% | 0.00% |
| **6** | 5.41% | 5.40% | 1.55% | 4.50% |

*Note: 1-3 dice cannot form these combinations (0.00%).*

## 3. Tactical Guide

### Opening Turn Strategy
With 6 dice, your EV starting from 0 is **464.13 points**.
*   **The 400 Point Paradox:** While the math suggests rolling until you hit a much higher threshold, banking at **~400 points** on your first turn is a valid "Tempo Play."
*   **Why?** It secures a lead and often leaves the next player with a difficult inheritance (1 or 2 dice), forcing them to take a risk or start fresh.

### Endgame Tactics
*   **Conservative Play:** If you are leading, adhere strictly to the **Break-Even Thresholds**. Do not give opponents a chance to catch up by taking unnecessary risks.
*   **Chasing:** If you are behind, you must take "Negative EV" risks. Use the **EV Table** to see how much "theoretical value" you are sacrificing for a chance to win.
*   **Final Round Inheritance:** If the player before you banks a low score (< 300) and leaves you 1 or 2 dice, **Start Fresh**. The risk of Zilching immediately is too high compared to the potential gain of a fresh 6-dice roll.

### Multiplayer Dynamics: The "Blocking Strategy"
Banking is not just about securing points; it's about **weaponizing the Inheritance Rule**.
*   **The Trap:** Leaving an opponent with 1 die (Zilch Risk: **66.66%**) or 2 dice (Zilch Risk: **44.44%**) is a powerful defensive move.
*   **When to Trap:** If you have a moderate score (e.g., 400-500) and are down to 1 or 2 dice, **BANK**. You force the next player to choose between a high-risk inheritance or starting from 0 (negating your "gift").

#### Inheritance Bait Calculator
Use this table to determine if your banked score is high enough to "bait" a mathematically perfect opponent into taking a bad risk.
*   **Bait Value:** The minimum points you must pass to make it mathematically correct (Positive EV) for your opponent to take the risk.

| Dice Passed | Opponent Zilch Risk | Bait Value (Min Bank) |
| :--- | :--- | :--- |
| **1 Dice** | **66.66%** | **1318 pts** |
| **2 Dice** | **44.44%** | **746 pts** |
| **3 Dice** | **27.78%** | **523 pts** |

## 4. Decision Tools

### Risk/Reward Decision Matrix
Quick reference for mid-game decisions.
```text
Turn Total | 1 Die | 2 Dice | 3 Dice | 4 Dice | 5 Dice | 6 Dice
-----------|-------|--------|--------|--------|--------|-------
0-300      | BANK  | BANK  | ROLL  | ROLL  | ROLL  | ROLL  |
300-600    | BANK  | BANK  | BANK  | ROLL  | ROLL  | ROLL  |
600-1000   | BANK  | BANK  | BANK  | RISKY | ROLL  | ROLL  |
1000+      | BANK  | BANK  | BANK  | BANK  | ROLL  | ROLL  |
```
**Legend:**
*   **ROLL:** Positive EV. Statistically safe.
*   **BANK:** Negative EV. You are likely to lose points by rolling.
*   **RISKY:** Marginal EV (near zero). Context dependent (e.g., are you chasing?).

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
| Single 1 | `[1]` | 100 | ✅ |
| Single 5 | `[5]` | 50 | ✅ |
| Three 1s | `[1,1,1]` | 1000 | ✅ |
| Three 2s | `[2,2,2]` | 200 | ✅ |
| Three 6s | `[6,6,6]` | 600 | ✅ |
| Four 1s | `[1,1,1,1]` | 2000 | ✅ |
| Five 1s | `[1,1,1,1,1]` | 4000 | ✅ |
| Six 1s | `[1,1,1,1,1,1]` | 8000 | ✅ |
| Small Straight | `[1,2,3,4,5]` | 750 | ✅ |
| Large Straight | `[2,3,4,5,6]` | 750 | ✅ |
| Full Straight | `[1,2,3,4,5,6]` | 1500 | ✅ |
| Three Pair | `[1,1,2,2,3,3]` | 1500 | ✅ |
| Two Triplets | `[1,1,1,2,2,2]` | 1500 | ✅ |
| Zilch (No Score) | `[2,3,4,6,2,3]` | 0 | ✅ |