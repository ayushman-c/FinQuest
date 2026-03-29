# FinQuest

> **Built for HACKONOMICS 2026**

Most people learn about money the hard way — by making expensive mistakes in real life. FinQuest tries to change that. It's a gamified financial literacy platform where you learn personal finance through interactive lessons, earn XP and badges as you progress, and then put everything you've learned to the test in a 12-month financial simulation game.

The idea is simple: make financial education feel less like a textbook and more like something you actually want to come back to.

🔗 [Live Demo – FinQuest](https://fin-quest-flax.vercel.app/)

---

## What it does

**Learn** — Six structured lessons covering the fundamentals of personal finance. Each lesson is broken into content slides you read through, followed by a quiz you have to pass before the lesson is marked complete. You can't just skip to the quiz — you go through the material first.

**Earn** — Every completed lesson awards XP. XP unlocks harder lessons and increases your level. Complete lessons also award badges which show up on your dashboard. The progression feels earned because it is.

**Play** — Once you've finished all the lessons, the Financial Simulator unlocks. You play as a 22-year-old who just started their first job. Over 12 simulated months, you allocate your income, respond to life events (medical bills, market crashes, salary raises, tax season), and try to build net worth without making decisions your future self would regret. Each event is directly tied to one of the lessons — so if you paid attention, you'll know what to do.

---

## Lessons

| # | Lesson | XP Required | XP Reward | Badge |
|---|--------|------------|-----------|-------|
| 1 | Finance Basics | 0 | 150 | Finance Rookie |
| 2 | Budgeting Basics | 0 | 200 | Budget Master |
| 3 | Saving & Emergency Funds | 0 | 250 | Saving Starter |
| 4 | Investing 101 | 500 | 300 | Investor |
| 5 | Tax Basics | 800 | 350 | Tax Pro |
| 6 | Debt Management | 1500 | 400 | Debt Free |

Lessons 1-3 are free for everyone. Lessons 4-6 require XP earned from completing earlier lessons, which forces progression rather than letting people jump straight to advanced content.

---

## The Simulator

The simulator is the part we're most proud of. After 12 months of decisions, you get a full financial report — grade (S through F), net worth growth, badges earned in-game, and a breakdown of your best and worst months.

**Salary tiers** — Junior (₹35k/month), Mid-Level (₹55k/month), Senior (₹85k/month). Fixed expenses scale with your tier. The game gets meaningfully harder at lower salaries.

**Every month:**
1. A random life event card appears — common, uncommon, or rare. You pick from 2-3 options.
2. You see the outcome and a financial lesson tied to your choice.
3. You allocate your disposable income across four buckets: emergency fund, investments, lifestyle, and debt repayment.
4. Your score updates based on how you allocated — savings rate, investment habits, debt decisions.

**Events cover everything from** a cracked phone screen (do you use your emergency fund or put it on a credit card?) to a market dip (do you panic sell or buy more?), tax season 80C planning, a friend asking for a loan, a sudden layoff, and a startup investment opportunity.

**Scoring** rewards good financial habits and penalises bad ones:
- Savings rate above 20% → +100 pts
- Made an investment → +80 pts
- Emergency fund fully funded → +200 pts
- Carrying debt → -50 pts/month
- Lifestyle spending above 40% of disposable → -60 pts

---

## Tech stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Auth | Firebase Authentication (Google OAuth) |
| Database | Cloud Firestore |
| Styling | Plain CSS with CSS variables |
| Game logic | Pure JS — no libraries, no Firestore during gameplay |

No UI component libraries. No CSS frameworks. The whole UI is hand-written CSS which means it's fast, customisable, and doesn't look like every other Tailwind project at a hackathon.

---

## Project structure

```
src/
├── firebase.js                  # Firebase init — exports auth and db
│
├── pages/
│   ├── landing/                 # Marketing/intro page
│   ├── Sign-in/                 # Google OAuth + first-time user doc creation
│   ├── dashboard/               # Main hub — lessons, XP, badges, simulator unlock
│   ├── lesson/                  # Individual lesson with content slides + quiz
│   └── simulator/               # The financial simulation game
│
├── components/
│   ├── ProtectedRoutes.jsx      # Auth guard for all protected pages
│   ├── SimulatorSection.jsx     # Unlock card at bottom of dashboard
│   └── simulator/
│       └── StartScreen.jsx      # Name + salary tier selection
│
├── simulator/                   # Game logic — no React, no Firebase
│   ├── constants.js             # All numbers, salary tiers, scoring, badges
│   ├── events.js                # All event cards with choices and outcomes
│   └── gameEngine.js            # Pure functions: state in → new state out
│
└── App.jsx                      # Route definitions
```

The game engine (`simulator/`) is deliberately separated from React. Every function takes a state object and returns a new state object. No side effects, no database calls. This makes the logic easy to reason about and means the game can theoretically run anywhere.

---

## How the data model works

Two Firestore collections do everything.

**`lessons/{lessonId}`** — static, seeded once, never changes during gameplay. Stores the content slides, quiz questions, XP values, and badge IDs.

**`users/{uid}`** — one document per user, updates constantly. Stores XP, level, completed lessons array, badges array, per-lesson progress (which slide they left off on, which quiz answers they gave), and streak.

The lock/unlock logic for lessons is two lines:

```js
const isUnlocked  = userData.xp >= lesson.xpRequired
const isCompleted = userData.completedLessons.includes(lesson.id)
```

No extra fields. No cloud functions. Just comparing two numbers at render time.

When a lesson is completed, XP is awarded using Firestore's `increment()` operator so there's no race condition even if somehow triggered twice. Badges use `arrayUnion()` for the same reason.

---

## Running locally

```bash
# Clone and install
git clone https://github.com/your-username/finquest.git
cd finquest
npm install

# Set up environment variables
cp .env.example .env
# Fill in your Firebase config values in .env

# Seed the lessons database (run once)
node seed.js

# Start dev server
npm run dev
```

The `.env` file needs these six values from your Firebase project settings:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## Firestore security rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /lessons/{lessonId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

Users can only read and write their own document. Lessons are read-only for everyone — only writable via admin scripts.

---

## What we'd build next

The current version covers the core loop well but there's a lot of room to grow.

A proper leaderboard using the Firestore `score` field that already exists on every user document — the infrastructure is there, just needs a UI.

Multiplayer simulator rounds where two players get the same set of events and compete on final net worth, which would make the hackathon demo significantly more fun to watch.

More lesson modules — the content system is fully data-driven so adding a new lesson is just adding a Firestore document and a row in `lessonData.js`. Compound interest, insurance basics, mutual fund selection, and retirement planning are all natural next modules.

A streak system that actually sends reminder notifications, using Firebase Cloud Messaging. The `lastLoginDate` and `streak` fields already exist on the user document.

---


---

*Personal finance is one of those things nobody teaches you but everyone needs. We built FinQuest because we wanted something that makes learning it feel less like homework and more like a game you'd actually play.*
