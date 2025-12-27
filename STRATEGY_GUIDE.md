# 🎲 Zilch Strategy Guide: The Serendipity Creak Edition

## 1. The "Golden Rule" of 6 Dice
**Never, under any circumstances, stop when you have Hot Dice (6 dice remaining).**

*   **The Math:** Your chance of Zilching is only **2.3%**.
*   **The Logic:** Even if you have a massive turn total, the risk of losing it is statistically negligible compared to the massive scoring potential of a fresh 6-dice roll.

## 2. The 3-Dice Pivot Point
**3 dice is the "danger zone."**

*   **The Math:** You have a **72.25%** success rate with 3 dice, but that drops to **55.55%** once you go down to 2.
*   **Strategy:** If your current turn total is over **312 points** and you are down to 3 dice, Bank. The expected gain from rolling those 3 dice is not high enough to justify risking the points you already have.

## 3. Weaponizing the "Inheritance Rule"
**This is how you beat players who only look at their own score. You don't just bank points; you "gift" a bad hand to the next player.**

*   **The 'Trap' Play:** If you have 500 points and only 1 die left, STOP.
*   **The Result:** You bank your 500 points, and the next player is forced to choose: start at 0, or inherit your 500 points with a **66.71%** chance of Zilching immediately.
*   **Winning Tip:** If you leave them 1 or 2 dice, you aren't just being safe; you are actively trying to make them lose points.

### The "Handoff" Calculator
Use this table to know if your "gift" is actually a trap. The **Min. Bank to Bait** is the minimum points you must pass to make it mathematically correct for your opponent to take the risk. If you pass less than this, a smart opponent will just start fresh.

| Dice Passed | Opponent Zilch Risk | Min. Bank to Bait |
| :--- | :--- | :--- |
| **1 Dice** | **66.7%** | **438 pts** |
| **2 Dice** | **44.5%** | **413 pts** |
| **3 Dice** | **27.8%** | **376 pts** |

## 4. Know Your Thresholds

| Dice Remaining | Max "Safe" Points | Logic |
| :--- | :--- | :--- |
| **6 Dice** | **Always Roll** | The risk is too low to ignore. |
| **5 Dice** | **~3196 Points** | Only bank if you are already at a massive total. |
| **4 Dice** | **~912 Points** | Still relatively safe (84% success). |
| **3 Dice** | **~312 Points** | The "Pivot." Be very careful here. |
| **2 Dice** | **~112 Points** | A coin flip. Only roll if you have almost nothing. |
| **1 Die** | **~37 Points** | Effectively a "Death Sentence." Never roll. |

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