import { useNavigate } from "react-router-dom";
import "./SimulatorSection.css";

// Features shown in the simulator preview
const SIMULATOR_FEATURES = [
  { icon: "📈", label: "Live market simulation" },
  { icon: "🏦", label: "Loan & EMI decisions" },
  { icon: "💼", label: "Portfolio management" },
  { icon: "🎯", label: "Real-world scenarios" },
];

export default function SimulatorSection({ completedCount, totalCount }) {
  const navigate   = useNavigate();
  const isUnlocked = completedCount >= totalCount && totalCount > 0;
  const remaining  = totalCount - completedCount;
  const pct        = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <section className="sim-section">

      {/* ── Section heading ───────────────────────────────────────────────── */}
      <div className="sim-section__heading">
        <h2 className="sim-section__title">Financial Simulator</h2>
        <p className="sim-section__subtitle">
          Apply everything you have learned in a real-world financial simulation
        </p>
      </div>

      {/* ── Card ──────────────────────────────────────────────────────────── */}
      <div className={`sim-card${isUnlocked ? " sim-card--unlocked" : " sim-card--locked"}`}>

        {/* Left: info */}
        <div className="sim-card__left">

          {/* Status pill */}
          <div className={`sim-card__pill${isUnlocked ? " sim-card__pill--unlocked" : " sim-card__pill--locked"}`}>
            {isUnlocked ? "✓ Unlocked" : "🔒 Locked"}
          </div>

          <h3 className="sim-card__heading">
            {isUnlocked
              ? "You're ready. Enter the simulation."
              : "Complete all lessons to unlock the simulator"}
          </h3>

          <p className="sim-card__desc">
            {isUnlocked
              ? "You have mastered the fundamentals of personal finance. Now put your knowledge to the real test — make investment decisions, manage debt, navigate market crashes, and grow your virtual wealth from scratch."
              : "The simulator puts you in charge of your own financial life. Make real decisions, face real consequences, and see how your knowledge holds up under pressure. Finish all lessons to get access."}
          </p>

          {/* Feature tags */}
          <div className="sim-card__features">
            {SIMULATOR_FEATURES.map((f) => (
              <div key={f.label} className="sim-feature">
                <span className="sim-feature__icon">{f.icon}</span>
                <span className="sim-feature__label">{f.label}</span>
              </div>
            ))}
          </div>

          {/* Progress or CTA */}
          {isUnlocked ? (
            <button
              className="sim-card__btn"
              onClick={() => navigate("/simulator")}
            >
              Launch Simulator →
            </button>
          ) : (
            <div className="sim-card__progress">
              <div className="sim-card__progress-row">
                <span>{completedCount} of {totalCount} lessons complete</span>
                <span className="sim-card__progress-pct">{pct}%</span>
              </div>
              <div className="sim-progress-track">
                <div
                  className="sim-progress-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="sim-card__remaining">
                {remaining === 1
                  ? "Just 1 more lesson to go!"
                  : `Complete ${remaining} more lessons to unlock`}
              </p>
            </div>
          )}
        </div>

        {/* Right: visual */}
        <div className="sim-card__right">
          {isUnlocked ? (
            <div className="sim-visual sim-visual--unlocked">
              <div className="sim-visual__glow" />
              <div className="sim-visual__icon">🎮</div>
              <div className="sim-visual__ring sim-visual__ring--1" />
              <div className="sim-visual__ring sim-visual__ring--2" />
              <div className="sim-visual__ring sim-visual__ring--3" />
            </div>
          ) : (
            <div className="sim-visual sim-visual--locked">
              <div className="sim-visual__icon sim-visual__icon--locked">🔒</div>
              {/* Mini lesson dots */}
              <div className="sim-dots">
                {Array.from({ length: totalCount }).map((_, i) => (
                  <div
                    key={i}
                    className={`sim-dot${i < completedCount ? " sim-dot--done" : ""}`}
                  />
                ))}
              </div>
              <span className="sim-visual__label">
                {completedCount}/{totalCount} lessons
              </span>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
