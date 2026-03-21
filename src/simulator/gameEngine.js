import {
  FIXED_EXPENSES,
  MONTHLY_INVESTMENT_RETURN,
  CREDIT_CARD_MONTHLY_RATE,
  POINTS,
  GAME_BADGES,
  TOTAL_MONTHS,
  SCORE_GRADES,
} from "./constants.js";

// ── Calculate total fixed expenses for a salary tier ─────────────────────────
export function calcFixedExpenses(tierId) {
  const expenses = FIXED_EXPENSES[tierId] ?? [];
  return {
    list: expenses,
    total: expenses.reduce((sum, e) => sum + e.amount, 0),
  };
}

// ── Calculate disposable income after fixed expenses ─────────────────────────
export function calcDisposable(salary, fixedTotal) {
  return Math.max(0, salary - fixedTotal);
}

// ── Apply an event choice effect to game state ────────────────────────────────
export function applyEventEffect(state, effect) {
  const next = { ...state };

  // Savings change
  if (effect.savingsChange) {
    next.savings = Math.max(0, next.savings + effect.savingsChange);
  }

  // Debt change (positive = more debt, negative = paying off)
  if (effect.debtChange) {
    next.debt = Math.max(0, next.debt + effect.debtChange);
  }

  // Investment change
  if (effect.investmentChange) {
    next.investments = Math.max(0, next.investments + effect.investmentChange);
  }

  // Score bonus
  if (effect.scoreBonus) {
    next.score = Math.max(0, next.score + effect.scoreBonus);
    next.scoreThisMonth = (next.scoreThisMonth ?? 0) + effect.scoreBonus;
  }

  return next;
}

// ── Process the player's monthly allocation ───────────────────────────────────
export function processAllocation(state, allocation) {
  let next = { ...state };
  let feedback = [];
  let scoreChange = 0;

  const { emergencyFund, investments, wants, debtPayment } = allocation;
  const totalAllocated = emergencyFund + investments + wants + debtPayment;
  const disposable = state.disposable;

  // Apply each allocation
  next.savings = (next.savings ?? 0) + emergencyFund;
  next.investments = (next.investments ?? 0) + investments;
  next.debt = Math.max(0, (next.debt ?? 0) - debtPayment);

  // ── Scoring rules ─────────────────────────────────────────────────────────

  // Savings rate
  const savingsRate = disposable > 0 ? (emergencyFund / disposable) : 0;

  if (savingsRate >= 0.2) {
    scoreChange += POINTS.SAVINGS_RATE_ABOVE_20;
    feedback.push({ type: "success", text: `Savings rate ${Math.round(savingsRate * 100)}% — excellent! +${POINTS.SAVINGS_RATE_ABOVE_20} pts` });
  } else if (savingsRate >= 0.1) {
    scoreChange += POINTS.SAVINGS_RATE_ABOVE_10;
    feedback.push({ type: "info", text: `Savings rate ${Math.round(savingsRate * 100)}% — decent. +${POINTS.SAVINGS_RATE_ABOVE_10} pts` });
  } else if (savingsRate < 0.05 && disposable > 0) {
    scoreChange += POINTS.SAVINGS_RATE_BELOW_5;
    feedback.push({ type: "warning", text: `Savings rate only ${Math.round(savingsRate * 100)}% — try to save more. ${POINTS.SAVINGS_RATE_BELOW_5} pts` });
  }

  if (emergencyFund === 0 && disposable > 0) {
    scoreChange += POINTS.ZERO_ALLOCATION_TO_SAVINGS;
    feedback.push({ type: "warning", text: `No allocation to savings this month. ${POINTS.ZERO_ALLOCATION_TO_SAVINGS} pts` });
  }

  // Investment made
  if (investments > 0) {
    scoreChange += POINTS.MADE_INVESTMENT;
    feedback.push({ type: "success", text: `Investment of ₹${investments.toLocaleString()} made. +${POINTS.MADE_INVESTMENT} pts` });
  }

  // Emergency fund target (3 months of fixed expenses)
  const fixedTotal = (state.fixedExpenses ?? []).reduce((s, e) => s + e.amount, 0);
  const emergencyTarget = fixedTotal * 3;
  const wasNotFunded = (state.savings ?? 0) < emergencyTarget;
  const isNowFunded = next.savings >= emergencyTarget;

  if (wasNotFunded && isNowFunded && emergencyTarget > 0) {
    scoreChange += POINTS.EMERGENCY_FUND_FULLY_FUNDED;
    feedback.push({ type: "success", text: `Emergency fund fully funded! +${POINTS.EMERGENCY_FUND_FULLY_FUNDED} pts 🎉` });
  }

  if (next.savings === 0 && disposable > 0) {
    scoreChange += POINTS.EMERGENCY_FUND_ZERO;
    feedback.push({ type: "danger", text: `Emergency fund is empty. ${POINTS.EMERGENCY_FUND_ZERO} pts` });
  }

  // Debt payment
  if (debtPayment > 0 && next.debt === 0 && (state.debt ?? 0) > 0) {
    scoreChange += POINTS.PAID_OFF_DEBT;
    feedback.push({ type: "success", text: `All debt cleared! +${POINTS.PAID_OFF_DEBT} pts 🎊` });
  }

  // Overspending on wants (more than 40% of disposable)
  const wantsRate = disposable > 0 ? (wants / disposable) : 0;
  if (wantsRate > 0.4) {
    scoreChange += POINTS.OVERSPENT_ON_WANTS;
    feedback.push({ type: "warning", text: `${Math.round(wantsRate * 100)}% spent on wants — over the 30% guideline. ${POINTS.OVERSPENT_ON_WANTS} pts` });
  }

  // Apply score
  next.score = Math.max(0, (next.score ?? 0) + scoreChange);
  next.scoreThisMonth = (next.scoreThisMonth ?? 0) + scoreChange;
  next.monthFeedback = [...(next.monthFeedback ?? []), ...feedback];

  return next;
}

// ── Apply monthly passive changes (investment returns, debt interest) ──────────
export function applyMonthlyPassive(state) {
  const next = { ...state };

  // Investment returns
  if (next.investments > 0) {
    const returnAmount = Math.round(next.investments * MONTHLY_INVESTMENT_RETURN);
    next.investments += returnAmount;
    next.monthFeedback = [
      ...(next.monthFeedback ?? []),
      { type: "info", text: `Investments grew by ₹${returnAmount.toLocaleString()} this month 📈` },
    ];
  }

  // Credit card interest on existing debt
  if (next.debt > 0) {
    const interest = Math.round(next.debt * CREDIT_CARD_MONTHLY_RATE);
    next.debt += interest;
    next.score = Math.max(0, (next.score ?? 0) + POINTS.MISSED_DEBT_PAYMENT * 0.3);
    next.monthFeedback = [
      ...(next.monthFeedback ?? []),
      { type: "danger", text: `₹${interest.toLocaleString()} interest charged on debt 💳` },
    ];
  }

  return next;
}

// ── Recalculate net worth ─────────────────────────────────────────────────────
export function calcNetWorth(state) {
  return (state.savings ?? 0) + (state.investments ?? 0) - (state.debt ?? 0);
}

// ── Check and award badges ────────────────────────────────────────────────────
export function checkBadges(state, monthHistory) {
  const awarded = [...(state.earnedBadges ?? [])];
  const newBadges = [];

  const hasBadge = (id) => awarded.includes(id);

  // Consistent saver — added to savings every month so far
  if (!hasBadge("consistent-saver") && monthHistory.length >= 2) {
    const alwaysSaved = monthHistory.every((m) => m.emergencyFundAdded > 0);
    if (alwaysSaved) {
      newBadges.push("consistent-saver");
    }
  }

  // Early investor — invested in first 3 months
  if (!hasBadge("early-investor") && state.month <= 3 && (state.investments ?? 0) > 0) {
    newBadges.push("early-investor");
  }

  // Debt slayer — cleared all debt by month 9
  if (!hasBadge("debt-slayer") && state.month <= 9 && state.debt === 0 &&
    monthHistory.some((m) => m.hadDebt)) {
    newBadges.push("debt-slayer");
  }

  // Safety net — emergency fund funded by month 4
  if (!hasBadge("safety-net") && state.month <= 4) {
    const fixedTotal = (state.fixedExpenses ?? []).reduce((s, e) => s + e.amount, 0);
    const emergencyTarget = fixedTotal * 3;
    if ((state.savings ?? 0) >= emergencyTarget && emergencyTarget > 0) {
      newBadges.push("safety-net");
    }
  }

  // Wealth builder — net worth above ₹1,00,000
  if (!hasBadge("wealth-builder") && calcNetWorth(state) >= 100000) {
    newBadges.push("wealth-builder");
  }

  return { newBadges, allBadges: [...awarded, ...newBadges] };
}

// ── Get grade from final score ────────────────────────────────────────────────
export function getGrade(score) {
  for (const g of SCORE_GRADES) {
    if (score >= g.min) return g;
  }
  return SCORE_GRADES[SCORE_GRADES.length - 1];
}

// ── Build the end-of-game summary ─────────────────────────────────────────────
export function buildEndSummary(state, monthHistory) {
  const netWorth = calcNetWorth(state);
  const grade = getGrade(state.score ?? 0);
  const { allBadges } = checkBadges(state, monthHistory);

  const bestMonth = monthHistory.reduce(
    (best, m) => (m.netWorthChange > (best?.netWorthChange ?? -Infinity) ? m : best),
    null
  );
  const worstMonth = monthHistory.reduce(
    (worst, m) => (m.netWorthChange < (worst?.netWorthChange ?? Infinity) ? m : worst),
    null
  );

  return {
    finalScore: state.score ?? 0,
    finalNetWorth: netWorth,
    finalSavings: state.savings ?? 0,
    finalInvestments: state.investments ?? 0,
    finalDebt: state.debt ?? 0,
    grade,
    badges: allBadges,
    bestMonth,
    worstMonth,
    totalMonths: TOTAL_MONTHS,
  };
}

// ── Advance to the next month — sets up fresh state ──────────────────────────
export function advanceMonth(state) {
  const prevNetWorth = calcNetWorth(state);
  const newNetWorth = prevNetWorth;

  // Save this month to history
  const monthRecord = {
    month: state.month,
    score: state.scoreThisMonth ?? 0,
    netWorthChange: newNetWorth - (state.prevNetWorth ?? 0),
    emergencyFundAdded: state.allocation?.emergencyFund ?? 0,
    hadDebt: (state.debt ?? 0) > 0,
    eventId: state.currentEvent?.id ?? null,
  };

  return {
    ...state,
    month: state.month + 1,
    phase: "event",
    currentEvent: null,
    eventChoice: null,
    monthFeedback: [],
    scoreThisMonth: 0,
    prevNetWorth: newNetWorth,
    allocation: { emergencyFund: 0, investments: 0, wants: 0, debtPayment: 0 },
    monthlyHistory: [...(state.monthlyHistory ?? []), monthRecord],
  };
}
