// Level thresholds — how much total XP needed for each level
const THRESHOLDS = [0, 100, 250, 500, 850, 1300, 1900, 2600, 3400, 4300, 5300];

export function getLevelFromXP(xp) {
  let level = 1;
  for (let i = 0; i < THRESHOLDS.length; i++) {
    if (xp >= THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return level;
}

export function getXPForNextLevel(currentLevel) {
  return THRESHOLDS[currentLevel] ?? THRESHOLDS[THRESHOLDS.length - 1];
}

export function getXPForCurrentLevel(currentLevel) {
  return THRESHOLDS[currentLevel - 1] ?? 0;
}