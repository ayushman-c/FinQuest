// ── Event structure ───────────────────────────────────────────────────────────
// Each event has:
//   id         — unique string
//   tier       — "common" | "uncommon" | "rare"
//   lesson     — which lesson this tests
//   title      — short headline
//   description— full event description shown to player
//   emoji      — visual icon for the card
//   choices    — array of 2-4 options the player can pick
//     Each choice has:
//       label     — button text
//       outcome   — text shown after picking
//       effect    — object describing what changes in game state
//         savingsChange      — number (positive or negative)
//         debtChange         — number (positive = more debt, negative = paid off)
//         investmentChange   — number
//         scoreBonus         — number
//         isCorrect          — boolean (true = teaches right lesson)
//       tip       — what the player should learn from this

// ── COMMON EVENTS (60% draw chance) ──────────────────────────────────────────
export const COMMON_EVENTS = [
  {
    id: "phone-repair",
    tier: "common",
    lesson: "emergency-fund",
    title: "Cracked Screen",
    description: "You dropped your phone and the screen cracked badly. Repair costs ₹3,500. How do you handle it?",
    emoji: "📱",
    choices: [
      {
        label: "Pay from emergency fund",
        outcome: "Smart move. This is exactly what emergency funds are for.",
        effect: { savingsChange: -3500, debtChange: 0, investmentChange: 0, scoreBonus: 60 },
        isCorrect: true,
        tip: "Emergency funds exist precisely for unexpected essential expenses like this.",
      },
      {
        label: "Put it on credit card",
        outcome: "You paid with credit card. Interest will add up next month.",
        effect: { savingsChange: 0, debtChange: 3500, investmentChange: 0, scoreBonus: -60 },
        isCorrect: false,
        tip: "Using a credit card for emergencies when you have savings costs you extra in interest.",
      },
      {
        label: "Use old phone for now, save up",
        outcome: "Practical choice. You managed without spending.",
        effect: { savingsChange: 0, debtChange: 0, investmentChange: 0, scoreBonus: 40 },
        isCorrect: true,
        tip: "Not every problem needs immediate spending. Delaying non-urgent expenses is a solid financial habit.",
      },
    ],
  },
  {
    id: "grocery-splurge",
    tier: "common",
    lesson: "budgeting-basics",
    title: "Weekend Food Festival",
    description: "There is a food festival this weekend. Your friends want to go and the estimated spend is ₹2,500. Your wants budget this month is already at ₹1,500.",
    emoji: "🍔",
    choices: [
      {
        label: "Skip it — already over wants budget",
        outcome: "Disciplined choice. Your budget thanks you.",
        effect: { savingsChange: 0, debtChange: 0, investmentChange: 0, scoreBonus: 60 },
        isCorrect: true,
        tip: "Sticking to your wants budget even when FOMO strikes is a real financial skill.",
      },
      {
        label: "Go — take from next month's budget",
        outcome: "You went but borrowed from next month. Next month will be tighter.",
        effect: { savingsChange: -2500, debtChange: 0, investmentChange: 0, scoreBonus: -30 },
        isCorrect: false,
        tip: "Borrowing from future budgets creates a cycle that is hard to break.",
      },
      {
        label: "Go but spend only ₹1,000",
        outcome: "Good compromise — you joined but kept spending controlled.",
        effect: { savingsChange: -1000, debtChange: 0, investmentChange: 0, scoreBonus: 30 },
        isCorrect: true,
        tip: "Being social does not have to mean overspending. A spending cap is a great tool.",
      },
    ],
  },
  {
    id: "salary-credited",
    tier: "common",
    lesson: "budgeting-basics",
    title: "Salary Day",
    description: "Your salary just arrived. Before anything else, what is your first move?",
    emoji: "💰",
    choices: [
      {
        label: "Transfer savings and investments immediately",
        outcome: "Perfect — pay yourself first before any other expense.",
        effect: { savingsChange: 0, debtChange: 0, investmentChange: 0, scoreBonus: 80 },
        isCorrect: true,
        tip: "Automating savings on payday is the single best financial habit you can build.",
      },
      {
        label: "Pay all bills first then save what is left",
        outcome: "Better than nothing, but saving what is left rarely works consistently.",
        effect: { savingsChange: 0, debtChange: 0, investmentChange: 0, scoreBonus: 20 },
        isCorrect: false,
        tip: "Saving after expenses means you save inconsistently. Pay yourself first.",
      },
      {
        label: "Treat yourself — you worked hard",
        outcome: "You splurged ₹4,000. Morale is up, savings are down.",
        effect: { savingsChange: -4000, debtChange: 0, investmentChange: 0, scoreBonus: -40 },
        isCorrect: false,
        tip: "Rewarding yourself is fine, but it should be planned — not impulsive on payday.",
      },
    ],
  },
  {
    id: "subscription-audit",
    tier: "common",
    lesson: "budgeting-basics",
    title: "Subscription Overload",
    description: "You just noticed you are paying for Netflix, Hotstar, Spotify, Amazon Prime, and two app subscriptions you forgot about. Total: ₹1,800/month.",
    emoji: "📺",
    choices: [
      {
        label: "Cancel the ones you barely use — keep 2",
        outcome: "You cut ₹1,100/month in subscriptions. That is ₹13,200/year saved.",
        effect: { savingsChange: 1100, debtChange: 0, investmentChange: 0, scoreBonus: 70 },
        isCorrect: true,
        tip: "Auditing subscriptions every 6 months is one of the easiest ways to free up money.",
      },
      {
        label: "Keep them all — I might use them",
        outcome: "You kept everything. ₹1,800 gone every month on things you barely use.",
        effect: { savingsChange: -1800, debtChange: 0, investmentChange: 0, scoreBonus: -30 },
        isCorrect: false,
        tip: "Subscriptions feel small individually but add up to thousands per year.",
      },
    ],
  },
  {
    id: "friend-loan",
    tier: "common",
    lesson: "debt-management",
    title: "Friend Needs Money",
    description: "A close friend urgently needs ₹5,000 and asks to borrow it from you. You have it in savings.",
    emoji: "🤝",
    choices: [
      {
        label: "Lend it — set a clear repayment date",
        outcome: "You helped and set expectations. Good balance of generosity and financial sense.",
        effect: { savingsChange: -5000, debtChange: 0, investmentChange: 0, scoreBonus: 30 },
        isCorrect: true,
        tip: "Always treat lending to friends like a formal transaction. Write down the amount and expected repayment.",
      },
      {
        label: "Give it as a gift — no expectation",
        outcome: "Generous, but ₹5,000 from savings hurts your emergency fund.",
        effect: { savingsChange: -5000, debtChange: 0, investmentChange: 0, scoreBonus: -10 },
        isCorrect: false,
        tip: "Gifting large amounts from savings is fine only if your emergency fund is fully funded.",
      },
      {
        label: "Decline politely — protecting your finances",
        outcome: "Difficult but financially sound. Your savings stay intact.",
        effect: { savingsChange: 0, debtChange: 0, investmentChange: 0, scoreBonus: 40 },
        isCorrect: true,
        tip: "Saying no to protect your financial health is always a valid choice.",
      },
    ],
  },
];

// ── UNCOMMON EVENTS (30% draw chance) ────────────────────────────────────────
export const UNCOMMON_EVENTS = [
  {
    id: "medical-emergency",
    tier: "uncommon",
    lesson: "saving-emergency",
    title: "Sudden Medical Bill",
    description: "You had to visit a specialist doctor urgently. Total bill including tests: ₹8,500. You did not have health insurance.",
    emoji: "🏥",
    choices: [
      {
        label: "Pay from emergency fund",
        outcome: "Your emergency fund absorbed the hit. This is exactly its purpose.",
        effect: { savingsChange: -8500, debtChange: 0, investmentChange: 0, scoreBonus: 80 },
        isCorrect: true,
        tip: "A fully funded emergency fund means unexpected expenses do not derail your finances.",
      },
      {
        label: "Pay with credit card",
        outcome: "Paid the bill but now carrying ₹8,500 in credit card debt at 36% interest.",
        effect: { savingsChange: 0, debtChange: 8500, investmentChange: 0, scoreBonus: -80 },
        isCorrect: false,
        tip: "Medical expenses are the most common reason people take on bad debt. An emergency fund prevents this.",
      },
      {
        label: "Pay half now, negotiate the rest",
        outcome: "Hospitals often allow payment plans. You paid ₹4,250 and arranged the rest.",
        effect: { savingsChange: -4250, debtChange: 4250, investmentChange: 0, scoreBonus: 20 },
        isCorrect: false,
        tip: "Payment plans are better than credit cards but having savings first is always the goal.",
      },
    ],
  },
  {
    id: "investment-opportunity",
    tier: "uncommon",
    lesson: "investing-101",
    title: "Market is Up",
    description: "A colleague says the market is doing great and you should put all your savings into a hot stock tip he heard about. You have ₹15,000 in savings.",
    emoji: "📊",
    choices: [
      {
        label: "Invest in a diversified index fund instead",
        outcome: "Smart. Index funds beat most stock tips over the long run.",
        effect: { savingsChange: -5000, debtChange: 0, investmentChange: 5000, scoreBonus: 100 },
        isCorrect: true,
        tip: "Never invest based on tips. Diversified index funds consistently outperform stock-picking over time.",
      },
      {
        label: "Put everything in the hot stock",
        outcome: "The stock dropped 30% next month. You lost ₹4,500 of your ₹15,000.",
        effect: { savingsChange: -15000, debtChange: 0, investmentChange: 10500, scoreBonus: -100 },
        isCorrect: false,
        tip: "Putting all savings in a single stock tip is speculation, not investing.",
      },
      {
        label: "Ignore it — keep savings in bank",
        outcome: "Safe but your money is not growing above inflation.",
        effect: { savingsChange: 0, debtChange: 0, investmentChange: 0, scoreBonus: -20 },
        isCorrect: false,
        tip: "Keeping all money in a savings account means inflation slowly erodes its value.",
      },
    ],
  },
  {
    id: "tax-deadline",
    tier: "uncommon",
    lesson: "tax-basics",
    title: "March Tax Deadline",
    description: "It is the last week of March. Your CA reminds you that you have not made your 80C investments yet. You can invest up to ₹1,50,000 to save on taxes.",
    emoji: "📋",
    choices: [
      {
        label: "Invest ₹10,000 in ELSS right now",
        outcome: "Good move. ELSS investment saves you tax and grows your wealth.",
        effect: { savingsChange: -10000, debtChange: 0, investmentChange: 10000, scoreBonus: 100 },
        isCorrect: true,
        tip: "ELSS is the best 80C option — shortest lock-in (3 years) and equity returns.",
      },
      {
        label: "Invest in PPF instead",
        outcome: "Safe choice. PPF is tax-free but has a 15-year lock-in.",
        effect: { savingsChange: -10000, debtChange: 0, investmentChange: 10000, scoreBonus: 60 },
        isCorrect: true,
        tip: "PPF is excellent for long-term goals but the 15-year lock-in reduces flexibility.",
      },
      {
        label: "Skip it — too complicated",
        outcome: "You missed the 80C window. You will pay more tax this year.",
        effect: { savingsChange: -3000, debtChange: 0, investmentChange: 0, scoreBonus: -80 },
        isCorrect: false,
        tip: "Missing 80C investments is one of the most expensive financial mistakes salaried employees make.",
      },
    ],
  },
  {
    id: "debt-decision",
    tier: "uncommon",
    lesson: "debt-management",
    title: "Extra ₹8,000 This Month",
    description: "You have ₹8,000 extra after all allocations. You have a credit card balance of ₹12,000 at 36% interest AND a personal loan of ₹30,000 at 14% interest. Where does the extra money go?",
    emoji: "💳",
    choices: [
      {
        label: "Pay the credit card — highest interest first",
        outcome: "Avalanche method. You saved the most in interest. Correct move.",
        effect: { savingsChange: 0, debtChange: -8000, investmentChange: 0, scoreBonus: 100 },
        isCorrect: true,
        tip: "The avalanche method — paying highest interest debt first — saves the most money mathematically.",
      },
      {
        label: "Pay the personal loan — bigger amount",
        outcome: "You paid the bigger loan but the expensive credit card keeps growing.",
        effect: { savingsChange: 0, debtChange: -8000, investmentChange: 0, scoreBonus: 20 },
        isCorrect: false,
        tip: "Always prioritise by interest rate, not by loan size. 36% credit card debt is far more expensive.",
      },
      {
        label: "Split evenly between both",
        outcome: "Neither debt is being attacked efficiently.",
        effect: { savingsChange: 0, debtChange: -8000, investmentChange: 0, scoreBonus: 40 },
        isCorrect: false,
        tip: "Splitting payments feels balanced but mathematically costs you more in total interest.",
      },
      {
        label: "Invest it instead — returns beat debt",
        outcome: "Risky logic. No investment reliably beats 36% credit card interest.",
        effect: { savingsChange: 0, debtChange: 0, investmentChange: 8000, scoreBonus: -60 },
        isCorrect: false,
        tip: "When debt interest exceeds expected investment returns, always pay debt first.",
      },
    ],
  },
  {
    id: "raise-received",
    tier: "uncommon",
    lesson: "budgeting-basics",
    title: "You Got a Raise!",
    description: "Your manager just told you — you are getting a ₹8,000/month raise starting next month. What is your plan for the extra money?",
    emoji: "🎉",
    choices: [
      {
        label: "Upgrade lifestyle a little, invest the rest",
        outcome: "Balanced approach. ₹3,000 lifestyle upgrade, ₹5,000 invested. Smart.",
        effect: { savingsChange: 0, debtChange: 0, investmentChange: 5000, scoreBonus: 80 },
        isCorrect: true,
        tip: "Lifestyle creep is fine in moderation. The key is keeping it smaller than the raise.",
      },
      {
        label: "Upgrade everything — you deserve it",
        outcome: "Full lifestyle upgrade. No improvement in savings or investments.",
        effect: { savingsChange: -3000, debtChange: 0, investmentChange: 0, scoreBonus: -60 },
        isCorrect: false,
        tip: "Lifestyle inflation that matches income growth prevents wealth building entirely.",
      },
      {
        label: "Put the entire raise into investments",
        outcome: "Maximum wealth building. Net worth grows significantly faster.",
        effect: { savingsChange: 0, debtChange: 0, investmentChange: 8000, scoreBonus: 120 },
        isCorrect: true,
        tip: "Investing 100% of a raise while keeping lifestyle the same is the fastest path to wealth.",
      },
    ],
  },
];

// ── RARE EVENTS (10% draw chance) ────────────────────────────────────────────
export const RARE_EVENTS = [
  {
    id: "job-loss",
    tier: "rare",
    lesson: "saving-emergency",
    title: "Laid Off",
    description: "Your company is restructuring and your role has been made redundant. You have one month of notice pay. How prepared are you?",
    emoji: "😰",
    choices: [
      {
        label: "I have 3+ months emergency fund — I am fine",
        outcome: "Your emergency fund gives you time to find the right next job without panic.",
        effect: { savingsChange: 0, debtChange: 0, investmentChange: 0, scoreBonus: 150 },
        isCorrect: true,
        tip: "This is why the emergency fund exists. It buys you time and negotiating power.",
      },
      {
        label: "Only 1 month saved — start cutting everything",
        outcome: "Stressful month. You manage but it is very tight.",
        effect: { savingsChange: -5000, debtChange: 0, investmentChange: 0, scoreBonus: 0 },
        isCorrect: false,
        tip: "One month of expenses is not enough buffer. Three to six months is the target.",
      },
      {
        label: "No savings — need to borrow immediately",
        outcome: "You take a personal loan of ₹30,000 to survive. Debt spiral begins.",
        effect: { savingsChange: 0, debtChange: 30000, investmentChange: 0, scoreBonus: -150 },
        isCorrect: false,
        tip: "No emergency fund means any crisis immediately creates debt. This is the exact scenario the fund prevents.",
      },
    ],
  },
  {
    id: "real-estate-offer",
    tier: "rare",
    lesson: "investing-101",
    title: "Property Investment Pitch",
    description: "A relative is offering you a chance to co-invest in a plot of land for ₹50,000. He says it will double in 2 years. You would need to liquidate all your investments.",
    emoji: "🏗️",
    choices: [
      {
        label: "Decline — too illiquid and unverified",
        outcome: "Wise. Unverified real estate deals from relatives are high risk.",
        effect: { savingsChange: 0, debtChange: 0, investmentChange: 0, scoreBonus: 100 },
        isCorrect: true,
        tip: "Real estate is illiquid — you cannot sell it quickly in an emergency. Always verify any investment claim.",
      },
      {
        label: "Invest ₹10,000 — small exposure only",
        outcome: "Limited exposure. You participate without overcommitting.",
        effect: { savingsChange: -10000, debtChange: 0, investmentChange: 0, scoreBonus: 20 },
        isCorrect: false,
        tip: "Small speculative investments are acceptable if they do not affect your core financial plan.",
      },
      {
        label: "Go all in — liquidate everything",
        outcome: "You lost liquidity and your investment returns. The deal fell through 6 months later.",
        effect: { savingsChange: 0, debtChange: 0, investmentChange: -30000, scoreBonus: -150 },
        isCorrect: false,
        tip: "Never liquidate a diversified portfolio for a single illiquid investment based on a verbal promise.",
      },
    ],
  },
  {
    id: "bonus-received",
    tier: "rare",
    lesson: "investing-101",
    title: "Surprise Annual Bonus",
    description: "Your company announced a performance bonus — you are getting ₹40,000! This is unexpected money. What do you do?",
    emoji: "🎊",
    choices: [
      {
        label: "50% investments, 30% emergency fund, 20% treat yourself",
        outcome: "Textbook windfall allocation. Balanced and smart.",
        effect: { savingsChange: 12000, debtChange: 0, investmentChange: 20000, scoreBonus: 150 },
        isCorrect: true,
        tip: "Windfall money should be split — some invested for the future, some to strengthen your safety net, some enjoyed guilt-free.",
      },
      {
        label: "Spend it all — this is extra money",
        outcome: "The entire bonus is gone on lifestyle. Net worth unchanged.",
        effect: { savingsChange: 0, debtChange: 0, investmentChange: 0, scoreBonus: -100 },
        isCorrect: false,
        tip: "Windfalls are rare opportunities to accelerate wealth building. Spending them entirely is a missed chance.",
      },
      {
        label: "Invest the entire amount",
        outcome: "Maximum wealth building move. ₹40,000 invested will compound significantly.",
        effect: { savingsChange: 0, debtChange: 0, investmentChange: 40000, scoreBonus: 130 },
        isCorrect: true,
        tip: "Investing windfalls entirely is aggressive but highly effective for long-term wealth.",
      },
      {
        label: "Pay off all existing debt first",
        outcome: "If you have high-interest debt, this was the right call.",
        effect: { savingsChange: 0, debtChange: -40000, investmentChange: 0, scoreBonus: 120 },
        isCorrect: true,
        tip: "Paying off high-interest debt with a windfall often gives a better return than investing.",
      },
    ],
  },
];

// ── Helper to draw a random event ─────────────────────────────────────────────
export function drawEvent(month) {
  const roll = Math.random();
  let pool;

  if (roll < 0.1) {
    pool = RARE_EVENTS;
  } else if (roll < 0.4) {
    pool = UNCOMMON_EVENTS;
  } else {
    pool = COMMON_EVENTS;
  }

  // Pick a random event from the pool
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
