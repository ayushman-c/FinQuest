// ── Salary tiers the player picks at the start ───────────────────────────────
export const SALARY_TIERS = [
  {
    id:          "junior",
    label:       "Junior Professional",
    salary:      35000,
    description: "Fresh out of college, first real job",
    emoji:       "🎓",
  },
  {
    id:          "mid",
    label:       "Mid-Level Professional",
    salary:      55000,
    description: "2-3 years of experience, growing fast",
    emoji:       "💼",
  },
  {
    id:          "senior",
    label:       "Senior Professional",
    salary:      85000,
    description: "Experienced, higher responsibilities",
    emoji:       "🚀",
  },
];

// ── Fixed expenses per salary tier (auto-deducted every month) ───────────────
export const FIXED_EXPENSES = {
  junior: [
    { label: "Rent",       amount: 9000  },
    { label: "Utilities",  amount: 1500  },
    { label: "Phone bill", amount: 599   },
    { label: "Transport",  amount: 2000  },
  ],
  mid: [
    { label: "Rent",       amount: 14000 },
    { label: "Utilities",  amount: 2000  },
    { label: "Phone bill", amount: 799   },
    { label: "Transport",  amount: 2500  },
  ],
  senior: [
    { label: "Rent",       amount: 22000 },
    { label: "Utilities",  amount: 3000  },
    { label: "Phone bill", amount: 999   },
    { label: "Transport",  amount: 3500  },
  ],
};

// ── Starting financial state ──────────────────────────────────────────────────
export const INITIAL_STATE = {
  month:            1,
  phase:            "start",   // start | event | allocate | results | end
  salary:           0,
  fixedExpenses:    [],
  disposable:       0,
  savings:          0,
  investments:      0,
  debt:             0,
  score:            0,
  netWorth:         0,
  monthlyHistory:   [],        // array of each month's summary
  earnedBadges:     [],
  currentEvent:     null,
  eventChoice:      null,
  allocation:       { emergencyFund: 0, investments: 0, wants: 0, debtPayment: 0 },
  monthFeedback:    [],
  scoreThisMonth:   0,
};

// ── Total months in the game ──────────────────────────────────────────────────
export const TOTAL_MONTHS = 12;

// ── Month names ───────────────────────────────────────────────────────────────
export const MONTH_NAMES = [
  "January", "February", "March",    "April",
  "May",     "June",     "July",     "August",
  "September","October", "November", "December",
];

// ── Scoring thresholds ────────────────────────────────────────────────────────
export const SCORE_GRADES = [
  { min: 10000, grade: "S", title: "Wealth Builder",   emoji: "👑" },
  { min: 8000,  grade: "A", title: "Financial Ninja",  emoji: "🥷" },
  { min: 6000,  grade: "B", title: "Smart Spender",    emoji: "🎯" },
  { min: 4000,  grade: "C", title: "Getting There",    emoji: "📈" },
  { min: 2000,  grade: "D", title: "Needs Work",       emoji: "📚" },
  { min: 0,     grade: "F", title: "Back to Lessons",  emoji: "🔄" },
];

// ── Emergency fund target (months of fixed expenses) ─────────────────────────
export const EMERGENCY_FUND_MONTHS = 3;

// ── Investment return rate (annual, applied monthly) ─────────────────────────
export const MONTHLY_INVESTMENT_RETURN = 0.01; // 12% annual / 12

// ── Credit card interest rate (monthly) ──────────────────────────────────────
export const CREDIT_CARD_MONTHLY_RATE = 0.03; // 36% annual / 12

// ── Score points ──────────────────────────────────────────────────────────────
export const POINTS = {
  SAVINGS_RATE_ABOVE_20:       100,
  SAVINGS_RATE_ABOVE_10:        50,
  MADE_INVESTMENT:              80,
  EMERGENCY_FUND_FULLY_FUNDED: 150,
  PAID_OFF_DEBT:               120,
  CORRECT_EVENT_CHOICE:         60,
  SAVINGS_RATE_BELOW_5:        -80,
  MISSED_DEBT_PAYMENT:        -150,
  TOOK_BAD_DEBT:              -100,
  EMERGENCY_FUND_ZERO:         -50,
  OVERSPENT_ON_WANTS:          -60,
  ZERO_ALLOCATION_TO_SAVINGS:  -40,
};

// ── Badge definitions ─────────────────────────────────────────────────────────
export const GAME_BADGES = [
  {
    id:          "consistent-saver",
    label:       "Consistent Saver",
    icon:        "🏦",
    description: "Added to savings every single month",
  },
  {
    id:          "early-investor",
    label:       "Early Investor",
    icon:        "📈",
    description: "Made an investment within the first 3 months",
  },
  {
    id:          "debt-slayer",
    label:       "Debt Slayer",
    icon:        "🚫",
    description: "Cleared all debt by month 9",
  },
  {
    id:          "safety-net",
    label:       "Safety Net Built",
    icon:        "🛡️",
    description: "Emergency fund fully funded by month 4",
  },
  {
    id:          "no-bad-debt",
    label:       "Clean Slate",
    icon:        "✨",
    description: "Never took on bad debt the entire game",
  },
  {
    id:          "wealth-builder",
    label:       "Wealth Builder",
    icon:        "💎",
    description: "Reached a net worth of ₹1,00,000",
  },
];
