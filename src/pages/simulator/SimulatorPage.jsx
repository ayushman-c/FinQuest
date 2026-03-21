import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Your actual exports from gameEngine.js ────────────────────────────────────
import {
  calcFixedExpenses,
  calcDisposable,
  applyEventEffect,
  processAllocation,
  applyMonthlyPassive,
  calcNetWorth,
  checkBadges,
  getGrade,
  buildEndSummary,
  advanceMonth,
} from "../../simulator/gameEngine";

// ── Your actual exports from events.js ───────────────────────────────────────
import { drawEvent } from "../../simulator/events";

// ── Your actual exports from constants.js ────────────────────────────────────
import {
  SALARY_TIERS,
  FIXED_EXPENSES,
  INITIAL_STATE,
  TOTAL_MONTHS,
  MONTH_NAMES,
  GAME_BADGES,
  SCORE_GRADES,
  EMERGENCY_FUND_MONTHS,
} from "../../simulator/constants";

import StartScreen from "../../components/simulator/StartScreen";
import "./SimulatorPage.css";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n) {
  const num = Math.round(n || 0);
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  return `₹${num.toLocaleString("en-IN")}`;
}

function getMonthName(month) {
  return MONTH_NAMES[(month - 1) % 12];
}

function getEmergencyTarget(fixedExpenses) {
  const total = (fixedExpenses ?? []).reduce((s, e) => s + e.amount, 0);
  return total * EMERGENCY_FUND_MONTHS;
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function Bar({ value, max, color = "#16a34a", height = 5 }) {
  const pct = Math.min(100, max > 0 ? Math.round((value / max) * 100) : 0);
  return (
    <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height, overflow: "hidden", width: "100%" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 0.5s ease" }} />
    </div>
  );
}

// ── Stats bar (dark header shown every round) ─────────────────────────────────
function StatsBar({ state }) {
  const emergencyTarget = getEmergencyTarget(state.fixedExpenses);
  const emergencyPct    = Math.min(100, emergencyTarget > 0 ? Math.round((state.savings / emergencyTarget) * 100) : 0);
  const monthPct        = Math.round(((state.month - 1) / TOTAL_MONTHS) * 100);
  const netWorth        = calcNetWorth(state);

  const pills = [
    { label: "MONTHLY SALARY",  value: fmt(state.salary),      icon: "💰", color: "neutral" },
    { label: "EMERGENCY FUND",  value: fmt(state.savings),     icon: "🏦", color: emergencyPct >= 100 ? "green" : "neutral" },
    { label: "INVESTMENTS",     value: fmt(state.investments),  icon: "📈", color: state.investments > 0 ? "green" : "neutral" },
    { label: "DEBT",            value: state.debt > 0 ? fmt(state.debt) : "None ✓", icon: "💳", color: state.debt > 0 ? "red" : "green" },
    { label: "NET WORTH",       value: fmt(netWorth),           icon: "📊", color: netWorth > 0 ? "green" : netWorth < 0 ? "red" : "neutral" },
  ];

  return (
    <div className="sp-statsbar">
      {/* Top row */}
      <div className="sp-statsbar__top">
        <div className="sp-statsbar__month">
          <span className="sp-statsbar__month-label">MONTH</span>
          <span className="sp-statsbar__month-val">{getMonthName(state.month)} · {state.month} / {TOTAL_MONTHS}</span>
        </div>
        <div className="sp-statsbar__progress">
          <Bar value={state.month - 1} max={TOTAL_MONTHS} color="#16a34a" />
          <span className="sp-statsbar__pct">{monthPct}% complete</span>
        </div>
        <div className="sp-statsbar__score">
          <span className="sp-statsbar__score-label">SCORE</span>
          <span className="sp-statsbar__score-val">⭐ {(state.score ?? 0).toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Stat pills */}
      <div className="sp-statsbar__pills">
        {pills.map((p) => (
          <div key={p.label} className={`sp-pill sp-pill--${p.color}`}>
            <span className="sp-pill__icon">{p.icon}</span>
            <span className="sp-pill__label">{p.label}</span>
            <span className="sp-pill__value">{p.value}</span>
          </div>
        ))}
      </div>

      {/* Emergency fund bar */}
      <div className="sp-statsbar__ef">
        <div className="sp-statsbar__ef-row">
          <span>🛡️ Emergency Fund</span>
          <span>{emergencyPct}% · {fmt(state.savings)} of {fmt(emergencyTarget)}</span>
        </div>
        <Bar value={state.savings} max={emergencyTarget || 1} color={emergencyPct >= 100 ? "#16a34a" : "#f59e0b"} />
      </div>
    </div>
  );
}

// ── Income breakdown card ─────────────────────────────────────────────────────
function IncomeCard({ state }) {
  const fixed    = state.fixedExpenses ?? [];
  const fixedTotal = fixed.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="sp-card">
      <span className="sp-section-label">💵 THIS MONTH'S INCOME</span>
      <div className="sp-income-row">
        <span>Salary</span>
        <span className="sp-green">+{fmt(state.salary)}</span>
      </div>
      {fixed.map((e) => (
        <div key={e.label} className="sp-income-row">
          <span>{e.label}</span>
          <span className="sp-red">-{fmt(e.amount)}</span>
        </div>
      ))}
      <div className="sp-divider" />
      <div className="sp-income-row sp-income-row--bold">
        <span>Disposable income</span>
        <span>{fmt(state.disposable)}</span>
      </div>
    </div>
  );
}

// ── Event card ────────────────────────────────────────────────────────────────
function EventCard({ event, chosenIndex, onChoose }) {
  const chosen = chosenIndex !== null && chosenIndex !== undefined;

  return (
    <div className="sp-card">
      <div className="sp-card__tags">
        <span className="sp-tag">{event.tier === "rare" ? "🔴 Rare Event" : event.tier === "uncommon" ? "🟡 Uncommon Event" : "🟢 Common Event"}</span>
        {event.lesson && (
          <span className="sp-tag sp-tag--blue">
            📚 Tests: {event.lesson.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
        )}
      </div>

      <div className="sp-event__emoji">{event.emoji}</div>
      <h2 className="sp-event__title">{event.title}</h2>
      <p className="sp-event__desc">{event.description}</p>

      <div className="sp-choices">
        {event.choices.map((choice, i) => (
          <button
            key={i}
            className={`sp-choice${chosenIndex === i ? " sp-choice--chosen" : ""}`}
            onClick={() => !chosen && onChoose(i)}
            disabled={chosen}
          >
            <span className="sp-choice__letter">{String.fromCharCode(65 + i)}</span>
            <span className="sp-choice__text">{choice.label}</span>
            {chosenIndex === i && <span className="sp-choice__tick">✓</span>}
          </button>
        ))}
      </div>

      {/* Outcome feedback after choice */}
      {chosen && (
        <div className={`sp-outcome sp-outcome--${event.choices[chosenIndex].isCorrect ? "good" : "bad"}`}>
          <span>{event.choices[chosenIndex].isCorrect ? "✅" : "❌"}</span>
          <div>
            <p className="sp-outcome__result">{event.choices[chosenIndex].outcome}</p>
            <p className="sp-outcome__tip">💡 {event.choices[chosenIndex].tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Allocation panel ──────────────────────────────────────────────────────────
function AllocationPanel({ disposable, allocation, onChange, onConfirm }) {
  // allocation keys match your constants: emergencyFund, investments, wants, debtPayment
  const total     = (allocation.emergencyFund || 0) + (allocation.investments || 0) + (allocation.wants || 0) + (allocation.debtPayment || 0);
  const remaining = disposable - total;
  const isValid   = remaining === 0;

  const fields = [
    { key: "emergencyFund", label: "Emergency / Savings", icon: "🏦", hint: "Build your safety net first" },
    { key: "investments",   label: "Investments (SIP)",   icon: "📈", hint: "Long-term wealth building" },
    { key: "wants",         label: "Lifestyle & Wants",   icon: "🛍️", hint: "Dining, shopping, entertainment" },
    { key: "debtPayment",   label: "Debt Repayment",      icon: "💳", hint: "Pay off loans and credit cards" },
  ];

  return (
    <div className="sp-card">
      <h2 className="sp-alloc__title">Allocate Your Income</h2>
      <p className="sp-alloc__sub">
        You have <strong>{fmt(disposable)}</strong> disposable this month. Allocate every rupee before proceeding.
      </p>

      <div className="sp-alloc__fields">
        {fields.map(({ key, label, icon, hint }) => (
          <div key={key} className="sp-alloc__row">
            <div className="sp-alloc__row-left">
              <span className="sp-alloc__icon">{icon}</span>
              <div>
                <span className="sp-alloc__label">{label}</span>
                <span className="sp-alloc__hint">{hint}</span>
              </div>
            </div>
            <div className="sp-alloc__input-wrap">
              <span className="sp-alloc__rupee">₹</span>
              <input
                type="number"
                min="0"
                step="500"
                value={allocation[key] || ""}
                onChange={(e) => onChange({ ...allocation, [key]: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                className="sp-alloc__input"
                placeholder="0"
              />
            </div>
          </div>
        ))}
      </div>

      <div className={`sp-remaining${remaining === 0 ? " sp-remaining--done" : remaining < 0 ? " sp-remaining--over" : ""}`}>
        {remaining === 0
          ? "✅ All income allocated!"
          : remaining > 0
          ? `₹${remaining.toLocaleString("en-IN")} still to allocate`
          : `❌ Over by ₹${Math.abs(remaining).toLocaleString("en-IN")}`}
      </div>

      <button
        className="sp-btn sp-btn--primary sp-btn--full"
        onClick={onConfirm}
        disabled={!isValid}
      >
        Confirm &amp; End Month →
      </button>
    </div>
  );
}

// ── Month results ─────────────────────────────────────────────────────────────
function MonthResults({ state, onNext }) {
  const feedback  = state.monthFeedback ?? [];
  const score     = state.scoreThisMonth ?? 0;
  const netWorth  = calcNetWorth(state);
  const isLast    = state.month > TOTAL_MONTHS;

  return (
    <div className="sp-card">
      <div className="sp-results__header">
        <h2 className="sp-results__title">Month {state.month - 1} Results</h2>
        <span className={`sp-results__score${score >= 0 ? " sp-results__score--pos" : " sp-results__score--neg"}`}>
          {score >= 0 ? "+" : ""}{score} pts
        </span>
      </div>

      {feedback.length > 0 && (
        <div className="sp-results__feedback">
          {feedback.map((f, i) => (
            <div key={i} className={`sp-feedback sp-feedback--${f.type}`}>
              {f.text}
            </div>
          ))}
        </div>
      )}

      {feedback.length === 0 && (
        <p className="sp-results__empty">No feedback this month.</p>
      )}

      <div className="sp-results__networth">
        <span>Net Worth</span>
        <span className={netWorth >= 0 ? "sp-green" : "sp-red"}>{fmt(netWorth)}</span>
      </div>

      <button className="sp-btn sp-btn--primary sp-btn--full" onClick={onNext}>
        {isLast ? "See Final Report →" : `Start Month ${state.month} →`}
      </button>
    </div>
  );
}

// ── End report ────────────────────────────────────────────────────────────────
function EndReport({ summary, playerName, onReplay, onDashboard }) {
  const { grade, finalScore, finalNetWorth, finalSavings, finalInvestments, finalDebt, badges, bestMonth, worstMonth } = summary;

  // Map badge IDs to full badge objects from GAME_BADGES
  const earnedBadgeObjects = (badges ?? [])
    .map((id) => GAME_BADGES.find((b) => b.id === id))
    .filter(Boolean);

  return (
    <div className="sp-end">
      <div className="sp-card sp-end__card">

        <div className="sp-end__grade" style={{ color: SCORE_GRADES.find(g => g.grade === grade.grade)?.color ?? "#16a34a" }}>
          {grade.emoji} {grade.grade}
        </div>
        <div className="sp-end__grade-title">{grade.title}</div>

        <h2 className="sp-end__heading">Year Complete!</h2>
        <p className="sp-end__sub">Here's your financial report, {playerName}.</p>

        <div className="sp-end__score">⭐ {finalScore.toLocaleString("en-IN")} points</div>

        <div className="sp-end__grid">
          {[
            { label: "Final Net Worth",   value: fmt(finalNetWorth),    good: finalNetWorth > 0 },
            { label: "Total Savings",     value: fmt(finalSavings),     good: finalSavings > 0  },
            { label: "Total Investments", value: fmt(finalInvestments),  good: finalInvestments > 0 },
            { label: "Remaining Debt",    value: fmt(finalDebt),        good: finalDebt === 0   },
          ].map((s) => (
            <div key={s.label} className={`sp-end__stat${s.good ? " sp-end__stat--good" : " sp-end__stat--bad"}`}>
              <span className="sp-end__stat-label">{s.label}</span>
              <span className="sp-end__stat-value">{s.value}</span>
            </div>
          ))}
        </div>

        {bestMonth && (
          <div className="sp-end__highlights">
            <div className="sp-outcome sp-outcome--good">
              🏆 Best month: {getMonthName(bestMonth.month)} (+{bestMonth.netWorthChange > 0 ? fmt(bestMonth.netWorthChange) : "0"} net worth)
            </div>
            {worstMonth && worstMonth.month !== bestMonth.month && (
              <div className="sp-outcome sp-outcome--bad">
                ⚠️ Toughest month: {getMonthName(worstMonth.month)}
              </div>
            )}
          </div>
        )}

        {earnedBadgeObjects.length > 0 && (
          <div>
            <span className="sp-section-label" style={{ display: "block", marginBottom: 12 }}>Badges Earned</span>
            <div className="sp-end__badges">
              {earnedBadgeObjects.map((b) => (
                <div key={b.id} className="sp-end__badge" title={b.description}>
                  <span style={{ fontSize: 28 }}>{b.icon}</span>
                  <span className="sp-end__badge-label">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {grade.grade === "F" && (
          <div className="sp-outcome sp-outcome--neutral">
            💡 Review the lessons and come back — you'll do much better next time.
          </div>
        )}

        <div className="sp-end__actions">
          <button className="sp-btn sp-btn--ghost" onClick={onReplay}>Play Again</button>
          <button className="sp-btn sp-btn--primary" onClick={onDashboard}>Back to Dashboard →</button>
        </div>
      </div>
    </div>
  );
}

// ── Main SimulatorPage ────────────────────────────────────────────────────────
export default function SimulatorPage() {
  const navigate = useNavigate();

  // Game state using your INITIAL_STATE shape
  const [gameState,    setGameState]    = useState({ ...INITIAL_STATE });
  const [phase,        setPhase]        = useState("start");    // start | event | allocate | results | end
  const [playerName,   setPlayerName]   = useState("");
  const [chosenIndex,  setChosenIndex]  = useState(null);       // which event choice was picked
  const [allocation,   setAllocation]   = useState({ emergencyFund: 0, investments: 0, wants: 0, debtPayment: 0 });
  const [endSummary,   setEndSummary]   = useState(null);

  const resetAlloc = () => setAllocation({ emergencyFund: 0, investments: 0, wants: 0, debtPayment: 0 });

  // ── Start game ──────────────────────────────────────────────────────────────
  const handleStart = ({ playerName: name, tier }) => {
    setPlayerName(name);

    const { list, total } = calcFixedExpenses(tier.id);
    const disposable      = calcDisposable(tier.salary, total);
    const event           = drawEvent(1);

    setGameState({
      ...INITIAL_STATE,
      salary:        tier.salary,
      fixedExpenses: list,
      disposable,
      currentEvent:  event,
      phase:         "event",
    });

    setPhase("event");
    setChosenIndex(null);
    resetAlloc();
  };

  // ── Player picks event choice ───────────────────────────────────────────────
  const handleEventChoice = (index) => {
    if (chosenIndex !== null) return;
    setChosenIndex(index);

    const effect  = gameState.currentEvent.choices[index].effect;
    const updated = applyEventEffect(gameState, effect);
    setGameState(updated);
  };

  // ── Proceed to allocation after event ──────────────────────────────────────
  const handleProceedToAllocate = () => {
    setPhase("allocate");
  };

  // ── Confirm allocation, process month ──────────────────────────────────────
  const handleConfirmAllocation = () => {
    // 1. Process the allocation (scoring, savings, investments, debt)
    let updated = processAllocation(gameState, allocation);
    // 2. Apply passive changes (investment returns, debt interest)
    updated = applyMonthlyPassive(updated);
    // 3. Check badges
    const { allBadges } = checkBadges(updated, updated.monthlyHistory ?? []);
    updated.earnedBadges = allBadges;
    // 4. Store allocation on state for advanceMonth history
    updated.allocation = { ...allocation };

    setGameState(updated);
    setPhase("results");
  };

  // ── Next month or end ──────────────────────────────────────────────────────
  const handleNextMonth = () => {
    // Check if game is over
    if (gameState.month >= TOTAL_MONTHS) {
      const summary = buildEndSummary(gameState, gameState.monthlyHistory ?? []);
      setEndSummary(summary);
      setPhase("end");
      return;
    }

    // Advance to next month
    let next = advanceMonth(gameState);

    // Set up fresh income for next month
    const { list, total } = calcFixedExpenses(next.salaryTierId ?? gameState.salaryTierId ?? "junior");
    const disposable      = calcDisposable(next.salary ?? gameState.salary, total);
    const event           = drawEvent(next.month);

    // Carry over salary and fixed expenses (advanceMonth doesn't know about them)
    next = {
      ...next,
      salary:        gameState.salary,
      fixedExpenses: gameState.fixedExpenses,
      disposable,
      currentEvent:  event,
    };

    setGameState(next);
    setPhase("event");
    setChosenIndex(null);
    resetAlloc();
  };

  // ── Replay ─────────────────────────────────────────────────────────────────
  const handleReplay = () => {
    setGameState({ ...INITIAL_STATE });
    setPhase("start");
    setPlayerName("");
    setChosenIndex(null);
    setEndSummary(null);
    resetAlloc();
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (phase === "start") {
    return <StartScreen onStart={handleStart} />;
  }

  if (phase === "end" && endSummary) {
    return (
      <EndReport
        summary={endSummary}
        playerName={playerName}
        onReplay={handleReplay}
        onDashboard={() => navigate("/dashboard")}
      />
    );
  }

  return (
    <div className="sp">

      {/* Nav */}
      <header className="sp-nav">
        <button className="sp-nav__back" onClick={() => navigate("/dashboard")}>← Dashboard</button>
        <div className="sp-nav__center">
          <span className="sp-nav__title">🎮 Financial Simulator</span>
          <span className="sp-nav__pill">Month {gameState.month} / {TOTAL_MONTHS}</span>
        </div>
        <span className="sp-nav__player">👤 {playerName}</span>
      </header>

      {/* Game area */}
      <main className="sp-main">
        <div className="sp-wrap">

          {/* Stats bar */}
          {(phase === "event" || phase === "allocate") && (
            <StatsBar state={gameState} />
          )}

          {/* Income breakdown — only on event phase */}
          {phase === "event" && (
            <IncomeCard state={gameState} />
          )}

          {/* Event card */}
          {phase === "event" && gameState.currentEvent && (
            <EventCard
              event={gameState.currentEvent}
              chosenIndex={chosenIndex}
              onChoose={handleEventChoice}
            />
          )}

          {/* Proceed button — appears after event is answered */}
          {phase === "event" && chosenIndex !== null && (
            <button
              className="sp-btn sp-btn--primary sp-btn--full"
              onClick={handleProceedToAllocate}
            >
              Proceed to Income Allocation →
            </button>
          )}

          {/* Allocation panel */}
          {phase === "allocate" && (
            <AllocationPanel
              disposable={gameState.disposable}
              allocation={allocation}
              onChange={setAllocation}
              onConfirm={handleConfirmAllocation}
            />
          )}

          {/* Results */}
          {phase === "results" && (
            <>
              <StatsBar state={gameState} />
              <MonthResults state={gameState} onNext={handleNextMonth} />
            </>
          )}

        </div>
      </main>
    </div>
  );
}
