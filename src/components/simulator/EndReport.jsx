import { GAME_BADGES } from "../../simulator/constants";
import "./EndReport.css";

export default function EndReport({ summary, playerName, onRestart, onDashboard }) {
  const {
    finalScore, finalNetWorth, finalSavings,
    finalInvestments, finalDebt, grade, badges,
    bestMonth, worstMonth,
  } = summary;

  const fmt = (n) => `₹${Math.abs(n).toLocaleString()}`;

  return (
    <div className="er">

      {/* Grade hero */}
      <div className={`er__hero er__hero--${grade.grade.toLowerCase()}`}>
        <div className="er__grade-emoji">{grade.emoji}</div>
        <div className="er__grade-letter">{grade.grade}</div>
        <h2 className="er__grade-title">{grade.title}</h2>
        <p className="er__player">Well played, {playerName}!</p>
        <div className="er__final-score">
          <span className="er__final-score-label">Final Score</span>
          <span className="er__final-score-value">{finalScore.toLocaleString()} pts</span>
        </div>
      </div>

      {/* Financial summary */}
      <div className="er__section">
        <h3 className="er__section-title">Year in Numbers</h3>
        <div className="er__stats-grid">
          <div className="er__stat">
            <span className="er__stat-icon">📊</span>
            <span className="er__stat-label">Final Net Worth</span>
            <span className={`er__stat-value${finalNetWorth < 0 ? " er__stat-value--bad" : " er__stat-value--good"}`}>
              {finalNetWorth < 0 ? "-" : ""}{fmt(finalNetWorth)}
            </span>
          </div>
          <div className="er__stat">
            <span className="er__stat-icon">🏦</span>
            <span className="er__stat-label">Total Saved</span>
            <span className="er__stat-value">{fmt(finalSavings)}</span>
          </div>
          <div className="er__stat">
            <span className="er__stat-icon">📈</span>
            <span className="er__stat-label">Total Invested</span>
            <span className="er__stat-value">{fmt(finalInvestments)}</span>
          </div>
          <div className="er__stat">
            <span className="er__stat-icon">💳</span>
            <span className="er__stat-label">Remaining Debt</span>
            <span className={`er__stat-value${finalDebt > 0 ? " er__stat-value--bad" : " er__stat-value--good"}`}>
              {finalDebt > 0 ? fmt(finalDebt) : "Debt Free ✓"}
            </span>
          </div>
          {bestMonth && (
            <div className="er__stat">
              <span className="er__stat-icon">🌟</span>
              <span className="er__stat-label">Best Month</span>
              <span className="er__stat-value er__stat-value--good">
                Month {bestMonth.month} (+{fmt(bestMonth.netWorthChange)})
              </span>
            </div>
          )}
          {worstMonth && (
            <div className="er__stat">
              <span className="er__stat-icon">📉</span>
              <span className="er__stat-label">Toughest Month</span>
              <span className="er__stat-value er__stat-value--bad">
                Month {worstMonth.month}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="er__section">
        <h3 className="er__section-title">Badges Earned</h3>
        <div className="er__badges">
          {GAME_BADGES.map((b) => {
            const earned = badges.includes(b.id);
            return (
              <div key={b.id} className={`er__badge${earned ? " er__badge--earned" : " er__badge--locked"}`}>
                <span className="er__badge-icon">{b.icon}</span>
                <span className="er__badge-label">{b.label}</span>
                {!earned && <span className="er__badge-lock">🔒</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grade message */}
      {grade.grade === "F" && (
        <div className="er__message er__message--retry">
          <span>📚</span>
          <p>
            Don't worry — financial skills take practice. Head back to the lessons,
            review the concepts, and try again. You'll do better next time!
          </p>
        </div>
      )}
      {(grade.grade === "S" || grade.grade === "A") && (
        <div className="er__message er__message--congrats">
          <span>🎉</span>
          <p>
            Outstanding! You applied your financial knowledge exceptionally well.
            Real-world financial health is built exactly like this — one good decision at a time.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="er__actions">
        <button className="er__btn er__btn--secondary" onClick={onRestart}>
          Play Again
        </button>
        <button className="er__btn er__btn--primary" onClick={onDashboard}>
          Back to Dashboard →
        </button>
      </div>
    </div>
  );
}
