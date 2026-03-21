import { useState } from "react";
import { SALARY_TIERS } from "../../simulator/constants";
import "./StartScreen.css";

export default function StartScreen({ onStart }) {
  const [selected,   setSelected]   = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [step,       setStep]       = useState(1); // 1 = intro, 2 = pick tier

  const handleContinue = () => {
    if (step === 1) { setStep(2); return; }
    if (!selected || !playerName.trim()) return;
    const tier = SALARY_TIERS.find((t) => t.id === selected);
    onStart({ tier, playerName: playerName.trim() });
  };

  return (
    <div className="ss">
      {step === 1 && (
        <div className="ss__intro">
          <div className="ss__badge">🎮 Financial Simulator</div>
          <h1 className="ss__title">Your Financial Life Starts Now</h1>
          <p className="ss__desc">
            You just got your first job. Over the next <strong>12 months</strong>,
            you will face real financial decisions — budgeting, saving, investing,
            handling debt, and surviving unexpected events.
          </p>
          <p className="ss__desc">
            Every choice you make affects your <strong>net worth</strong> and
            your <strong>score</strong>. Apply what you learned in the lessons
            and see how you do.
          </p>

          <div className="ss__rules">
            <div className="ss__rule">
              <span className="ss__rule-icon">📅</span>
              <div>
                <strong>12 rounds</strong>
                <p>One round = one month of your financial life</p>
              </div>
            </div>
            <div className="ss__rule">
              <span className="ss__rule-icon">🎲</span>
              <div>
                <strong>Random events</strong>
                <p>Life is unpredictable — medical bills, bonuses, opportunities</p>
              </div>
            </div>
            <div className="ss__rule">
              <span className="ss__rule-icon">⭐</span>
              <div>
                <strong>Score points</strong>
                <p>Good decisions earn points, bad ones cost you</p>
              </div>
            </div>
            <div className="ss__rule">
              <span className="ss__rule-icon">🏆</span>
              <div>
                <strong>Earn badges</strong>
                <p>Hit financial milestones to unlock achievements</p>
              </div>
            </div>
          </div>

          <button className="ss__btn" onClick={handleContinue}>
            Let's Begin →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="ss__setup">
          <div className="ss__badge">Step 2 of 2 — Character Setup</div>
          <h2 className="ss__title">Who are you?</h2>
          <p className="ss__desc">
            Pick your starting salary and enter your name. This determines
            your income, fixed expenses, and how challenging the game will be.
          </p>

          {/* Name input */}
          <div className="ss__name-wrap">
            <label className="ss__label">Your name</label>
            <input
              className="ss__name-input"
              type="text"
              placeholder="Enter your name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
            />
          </div>

          {/* Salary tier cards */}
          <div className="ss__tiers">
            {SALARY_TIERS.map((tier) => (
              <button
                key={tier.id}
                className={`ss__tier${selected === tier.id ? " ss__tier--selected" : ""}`}
                onClick={() => setSelected(tier.id)}
              >
                <span className="ss__tier-emoji">{tier.emoji}</span>
                <div className="ss__tier-info">
                  <span className="ss__tier-label">{tier.label}</span>
                  <span className="ss__tier-salary">
                    ₹{tier.salary.toLocaleString()} / month
                  </span>
                  <span className="ss__tier-desc">{tier.description}</span>
                </div>
                {selected === tier.id && (
                  <span className="ss__tier-check">✓</span>
                )}
              </button>
            ))}
          </div>

          <button
            className={`ss__btn${!selected || !playerName.trim() ? " ss__btn--disabled" : ""}`}
            onClick={handleContinue}
            disabled={!selected || !playerName.trim()}
          >
            Start My Journey →
          </button>
        </div>
      )}
    </div>
  );
}
