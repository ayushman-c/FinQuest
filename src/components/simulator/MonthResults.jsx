import { MONTH_NAMES } from "../../simulator/constants";
import "./MonthResults.css";

const TYPE_META = {
  success: { icon: "✅", cls: "mr-item--success" },
  info:    { icon: "ℹ️", cls: "mr-item--info"    },
  warning: { icon: "⚠️", cls: "mr-item--warning" },
  danger:  { icon: "❌", cls: "mr-item--danger"  },
};

export default function MonthResults({ gameState, newBadges, onNext, isLastMonth }) {
  const { month, scoreThisMonth, savings, investments, debt, monthFeedback } = gameState;
  const netWorth   = savings + investments - debt;
  const monthName  = MONTH_NAMES[(month - 1) % 12];
  const isPositive = scoreThisMonth >= 0;

  return (
    <div className="mr">
      {/* Header */}
      <div className="mr__header">
        <div className="mr__month-tag">{monthName} — End of Month</div>
        <div className={`mr__score-delta${isPositive ? " mr__score-delta--pos" : " mr__score-delta--neg"}`}>
          {isPositive ? "+" : ""}{scoreThisMonth} pts this month
        </div>
      </div>

      {/* Net worth snapshot */}
      <div className="mr__snapshot">
        <div className="mr__snap-item">
          <span className="mr__snap-label">Emergency Fund</span>
          <span className="mr__snap-value">₹{savings.toLocaleString()}</span>
        </div>
        <div className="mr__snap-divider" />
        <div className="mr__snap-item">
          <span className="mr__snap-label">Investments</span>
          <span className="mr__snap-value">₹{investments.toLocaleString()}</span>
        </div>
        <div className="mr__snap-divider" />
        <div className="mr__snap-item">
          <span className="mr__snap-label">Debt</span>
          <span className={`mr__snap-value${debt > 0 ? " mr__snap-value--bad" : " mr__snap-value--good"}`}>
            {debt > 0 ? `₹${debt.toLocaleString()}` : "None ✓"}
          </span>
        </div>
        <div className="mr__snap-divider" />
        <div className="mr__snap-item">
          <span className="mr__snap-label">Net Worth</span>
          <span className={`mr__snap-value mr__snap-value--large${netWorth < 0 ? " mr__snap-value--bad" : ""}`}>
            ₹{netWorth.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Feedback list */}
      {monthFeedback && monthFeedback.length > 0 && (
        <div className="mr__feedback">
          <p className="mr__feedback-title">What happened this month</p>
          {monthFeedback.map((item, i) => {
            const meta = TYPE_META[item.type] ?? TYPE_META.info;
            return (
              <div key={i} className={`mr-item ${meta.cls}`}>
                <span className="mr-item__icon">{meta.icon}</span>
                <span className="mr-item__text">{item.text}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* New badges */}
      {newBadges && newBadges.length > 0 && (
        <div className="mr__badges">
          <p className="mr__badges-title">🎖️ New Badge{newBadges.length > 1 ? "s" : ""} Unlocked!</p>
          {newBadges.map((b) => (
            <div key={b.id} className="mr__badge">
              <span className="mr__badge-icon">{b.icon}</span>
              <div>
                <strong>{b.label}</strong>
                <p>{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="mr__next-btn" onClick={onNext}>
        {isLastMonth ? "See Final Results 🏆" : `Start Month ${month + 1} →`}
      </button>
    </div>
  );
}
