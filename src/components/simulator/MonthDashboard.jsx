import { MONTH_NAMES, TOTAL_MONTHS } from "../../simulator/constants";
import "./MonthDashboard.css";

function StatPill({ icon, label, value, highlight }) {
  return (
    <div className={`md-pill${highlight ? " md-pill--highlight" : ""}`}>
      <span className="md-pill__icon">{icon}</span>
      <div className="md-pill__body">
        <span className="md-pill__label">{label}</span>
        <span className="md-pill__value">{value}</span>
      </div>
    </div>
  );
}

export default function MonthDashboard({ gameState }) {
  const {
    month, salary, savings, investments,
    debt, score, scoreThisMonth,
  } = gameState;

  const netWorth  = savings + investments - debt;
  const monthName = MONTH_NAMES[(month - 1) % 12];
  const progress  = Math.round(((month - 1) / TOTAL_MONTHS) * 100);

  const fmt = (n) =>
    n < 0
      ? `-₹${Math.abs(n).toLocaleString()}`
      : `₹${n.toLocaleString()}`;

  return (
    <div className="md">
      {/* Top bar */}
      <div className="md__top">
        <div className="md__month">
          <span className="md__month-label">Month</span>
          <span className="md__month-value">
            {monthName} · {month} / {TOTAL_MONTHS}
          </span>
        </div>

        <div className="md__progress-wrap">
          <div className="md__progress-track">
            <div className="md__progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="md__progress-pct">{progress}% complete</span>
        </div>

        <div className="md__score-wrap">
          <span className="md__score-label">Score</span>
          <span className="md__score-value">
            {score.toLocaleString()}
            {scoreThisMonth !== 0 && (
              <span className={`md__score-delta${scoreThisMonth > 0 ? " md__score-delta--up" : " md__score-delta--down"}`}>
                {scoreThisMonth > 0 ? "+" : ""}{scoreThisMonth}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Stat pills */}
      <div className="md__pills">
        <StatPill icon="💰" label="Monthly Salary"   value={fmt(salary)}      />
        <StatPill icon="🏦" label="Emergency Fund"   value={fmt(savings)}     />
        <StatPill icon="📈" label="Investments"      value={fmt(investments)} />
        <StatPill
          icon="💳"
          label="Debt"
          value={debt > 0 ? fmt(debt) : "None ✓"}
          highlight={debt > 0}
        />
        <StatPill
          icon="📊"
          label="Net Worth"
          value={fmt(netWorth)}
          highlight={netWorth < 0}
        />
      </div>
    </div>
  );
}
