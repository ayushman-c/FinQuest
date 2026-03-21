import { useState } from "react";
import "./EventCard.css";

const TIER_META = {
  common:   { label: "Common Event",   color: "#64748b", bg: "#f8fafc"  },
  uncommon: { label: "Uncommon Event", color: "#d97706", bg: "#fffbeb"  },
  rare:     { label: "Rare Event",     color: "#7c3aed", bg: "#f5f3ff"  },
};

export default function EventCard({ event, onChoice }) {
  const [chosen,     setChosen]     = useState(null);
  const [showOutcome, setShowOutcome] = useState(false);

  const tier = TIER_META[event.tier] ?? TIER_META.common;

  const handlePick = (index) => {
    if (showOutcome) return;
    setChosen(index);
    setShowOutcome(true);
  };

  const handleContinue = () => {
    onChoice(event.choices[chosen]);
  };

  return (
    <div className="ec">
      {/* Header */}
      <div className="ec__header">
        <div className="ec__tier-pill" style={{ background: tier.bg, color: tier.color }}>
          {tier.label}
        </div>
        <span className="ec__lesson-tag">📚 Tests: {event.lesson.replace(/-/g, " ")}</span>
      </div>

      {/* Event card */}
      <div className="ec__card">
        <div className="ec__emoji">{event.emoji}</div>
        <h2 className="ec__title">{event.title}</h2>
        <p className="ec__desc">{event.description}</p>
      </div>

      {/* Choices */}
      {!showOutcome && (
        <div className="ec__choices">
          <p className="ec__choices-label">What do you do?</p>
          {event.choices.map((choice, i) => (
            <button
              key={i}
              className="ec__choice"
              onClick={() => handlePick(i)}
            >
              <span className="ec__choice-letter">{String.fromCharCode(65 + i)}</span>
              <span className="ec__choice-text">{choice.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Outcome */}
      {showOutcome && chosen !== null && (
        <div className={`ec__outcome${event.choices[chosen].isCorrect ? " ec__outcome--good" : " ec__outcome--bad"}`}>
          <div className="ec__outcome-header">
            <span className="ec__outcome-icon">
              {event.choices[chosen].isCorrect ? "✅" : "❌"}
            </span>
            <span className="ec__outcome-result">
              {event.choices[chosen].isCorrect ? "Good choice!" : "Not ideal"}
            </span>
            <span className={`ec__outcome-score${event.choices[chosen].effect.scoreBonus >= 0 ? " ec__outcome-score--pos" : " ec__outcome-score--neg"}`}>
              {event.choices[chosen].effect.scoreBonus >= 0 ? "+" : ""}
              {event.choices[chosen].effect.scoreBonus} pts
            </span>
          </div>

          <p className="ec__outcome-text">{event.choices[chosen].outcome}</p>

          {/* Effects summary */}
          <div className="ec__effects">
            {event.choices[chosen].effect.savingsChange !== 0 && (
              <span className={`ec__effect${event.choices[chosen].effect.savingsChange > 0 ? " ec__effect--pos" : " ec__effect--neg"}`}>
                🏦 Savings {event.choices[chosen].effect.savingsChange > 0 ? "+" : ""}
                ₹{Math.abs(event.choices[chosen].effect.savingsChange).toLocaleString()}
              </span>
            )}
            {event.choices[chosen].effect.debtChange !== 0 && (
              <span className={`ec__effect${event.choices[chosen].effect.debtChange < 0 ? " ec__effect--pos" : " ec__effect--neg"}`}>
                💳 Debt {event.choices[chosen].effect.debtChange > 0 ? "+" : ""}
                ₹{Math.abs(event.choices[chosen].effect.debtChange).toLocaleString()}
              </span>
            )}
            {event.choices[chosen].effect.investmentChange !== 0 && (
              <span className={`ec__effect${event.choices[chosen].effect.investmentChange > 0 ? " ec__effect--pos" : " ec__effect--neg"}`}>
                📈 Investments {event.choices[chosen].effect.investmentChange > 0 ? "+" : ""}
                ₹{Math.abs(event.choices[chosen].effect.investmentChange).toLocaleString()}
              </span>
            )}
          </div>

          {/* Lesson tip */}
          <div className="ec__tip">
            <span className="ec__tip-icon">💡</span>
            <p>{event.choices[chosen].tip}</p>
          </div>

          <button className="ec__continue-btn" onClick={handleContinue}>
            Continue to Allocation →
          </button>
        </div>
      )}
    </div>
  );
}
