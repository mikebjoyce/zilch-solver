export function calculateScore(dice) {
  const counts = new Array(7).fill(0);
  dice.forEach(d => counts[d]++);

  let totalScore = 0;
  let diceUsed = 0;

  // 1. Check for 6-Dice Specials first
  if (dice.length === 6) {
    // Three Pair (or two triplets)
    const pairs = counts.filter(c => c >= 2).length;
    const triplets = counts.filter(c => c >= 3).length;
    if (pairs === 3 || triplets === 2) return { score: 1500, diceUsed: 6 };

    // Full Straight (1,2,3,4,5,6)
    if (counts.slice(1).every(c => c === 1)) return { score: 1500, diceUsed: 6 };
  }

  // 2. Check for 5-Dice Straights
  const smallStraight = [1, 2, 3, 4, 5].every(i => counts[i] > 0);
  const largeStraight = [2, 3, 4, 5, 6].every(i => counts[i] > 0);

  if (smallStraight || largeStraight) {
    let currentScore = 750;
    let currentUsed = 5;

    // Check if the 6th die is a scoring 1 or 5 to get "Hot Dice"
    if (smallStraight && counts[1] > 1) { currentScore += 100; currentUsed = 6; }
    else if (smallStraight && counts[5] > 1) { currentScore += 50; currentUsed = 6; }
    else if (largeStraight && counts[5] > 1) { currentScore += 50; currentUsed = 6; }
    
    // We return this immediately because 750+ is almost always better 
    // than individual sets from the same 5 dice.
    return { score: currentScore, diceUsed: currentUsed };
  }

  // 3. Multiples (3x, 4x, 5x, 6x)
  for (let i = 1; i <= 6; i++) {
    if (counts[i] >= 3) {
      const multiplier = Math.pow(2, counts[i] - 3);
      const base = (i === 1) ? 1000 : i * 100;
      totalScore += base * multiplier;
      diceUsed += counts[i];
      counts[i] = 0; // Consume these dice
    }
  }

  // 4. Individual 1s and 5s
  if (counts[1] > 0) {
    totalScore += counts[1] * 100;
    diceUsed += counts[1];
  }
  if (counts[5] > 0) {
    totalScore += counts[5] * 50;
    diceUsed += counts[5];
  }

  return { score: totalScore, diceUsed: diceUsed };
}