import { useState, useEffect } from "react";
import "./AllocationPanel.css";

const BUCKETS = [
  { key: "emergencyFund", label: "Emergency Fund",   icon: "🏦", color: "#16a34a", tip: "Target: 3 months of fixed expenses"   },
  { key: "investments",   label: "Investments",      icon: "📈", color: "#2563eb", tip: "Grows at ~12% per year (1% per month)" },
  { key: "wants",         label: "Wants / Lifestyle", icon: "🎯", color: "#d97706", tip: "Keep this below 30% of disposable"    },
  { key: "debtPayment",   label: "Debt Repayment",   icon: "💳", color: "#dc2626", tip: "Pay high-interest debt first"           },
];

export default function AllocationPanel({ disposable, existingDebt, onAllocate }) {
  const [values, setValues] = useState({
    emergencyFund: 0,
    investments:   0,
    wants:         0,
    debtPayment:   0,
  });

  const totalAllocated = Object.values(values).reduce((s, v) => s + v, 0);
  const remaining      = disposable - totalAllocated;
  const isValid        = remaining === 0;
  const overBudget     = remaining < 0;

  // If no debt, cap debt payment input
  useEffect(() => {
    if (!existingDebt && values.debtPayment > 0) {
      setValues((v) => ({ ...v, debtPayment: 0 }));
    }
  }, [existingDebt]);

  const handleChange = (key, raw) => {
    const parsed = parseInt(raw.replace(/[^0-9]/g, ""), 10) || 0;
    setValues((prev) => ({ ...prev, [key]: parsed }));
  };

  const handleMax = (key) => {
    const others      = Object.entries(values)
      .filter(([k]) => k !== key)
      .reduce((s, [, v]) => s + v, 0);
    const maxForThis  = Math.max(0, disposable - others);
    setValues((prev) => ({ ...prev, [key]: maxForThis }));
  };

  const handleSubmit = () => {
    if (!isValid) return;
    onAllocate(values);
  };

  const savingsRate = disposable > 0
    ? Math.round((values.emergencyFund / disposable) * 100)
    : 0;

  return (
    <div className="ap">
      <div className="ap__header">
        <div>
          <h3 className="ap__title">Allocate Your Money</h3>
          <p className="ap__sub">Disposable income this month after fixed expenses</p>
        </div>
        <div className="ap__disposable">
          <span className="ap__disposable-label">Available</span>
          <span className="ap__disposable-value">
            ₹{disposable.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Income breakdown reminder */}
      <div className="ap__reminder">
        💡 <strong>50/30/20 guide:</strong> Needs already deducted.
        Aim for 20%+ to savings (₹{Math.round(disposable * 0.2).toLocaleString()}),
        max 30% to wants (₹{Math.round(disposable * 0.3).toLocaleString()}).
      </div>

      {/* Allocation inputs */}
      <div className="ap__buckets">
        {BUCKETS.map((bucket) => {
          const isDisabled = bucket.key === "debtPayment" && !existingDebt;
          const pct        = disposable > 0
            ? Math.round((values[bucket.key] / disposable) * 100)
            : 0;

          return (
            <div
              key={bucket.key}
              className={`ap__bucket${isDisabled ? " ap__bucket--disabled" : ""}`}
            >
              <div className="ap__bucket-top">
                <span className="ap__bucket-icon">{bucket.icon}</span>
                <div className="ap__bucket-info">
                  <span className="ap__bucket-label">{bucket.label}</span>
                  <span className="ap__bucket-tip">
                    {isDisabled ? "No debt to pay" : bucket.tip}
                  </span>
                </div>
                <span className="ap__bucket-pct">{pct}%</span>
              </div>

              <div className="ap__bucket-input-row">
                <span className="ap__rupee">₹</span>
                <input
                  className="ap__input"
                  type="number"
                  min="0"
                  max={disposable}
                  value={values[bucket.key] || ""}
                  placeholder="0"
                  disabled={isDisabled}
                  onChange={(e) => handleChange(bucket.key, e.target.value)}
                />
                <button
                  className="ap__max-btn"
                  onClick={() => handleMax(bucket.key)}
                  disabled={isDisabled}
                >
                  Max
                </button>
              </div>

              {/* Mini bar */}
              <div className="ap__mini-track">
                <div
                  className="ap__mini-fill"
                  style={{
                    width:      `${Math.min(100, pct)}%`,
                    background: bucket.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Remaining indicator */}
      <div className={`ap__remaining${overBudget ? " ap__remaining--over" : isValid ? " ap__remaining--done" : ""}`}>
        <div className="ap__remaining-bar">
          <div className="ap__remaining-fill" style={{ width: `${Math.min(100, (totalAllocated / disposable) * 100)}%` }} />
        </div>
        <div className="ap__remaining-row">
          <span>
            {overBudget
              ? `⚠️ Over budget by ₹${Math.abs(remaining).toLocaleString()}`
              : isValid
              ? "✓ Fully allocated"
              : `₹${remaining.toLocaleString()} remaining`}
          </span>
          <span className="ap__savings-rate">
            Savings rate: <strong>{savingsRate}%</strong>
          </span>
        </div>
      </div>

      <button
        className={`ap__submit${!isValid ? " ap__submit--disabled" : ""}`}
        onClick={handleSubmit}
        disabled={!isValid}
      >
        {overBudget
          ? "Over budget — adjust allocations"
          : !isValid
          ? `Allocate remaining ₹${remaining.toLocaleString()}`
          : "Confirm Allocations →"}
      </button>
    </div>
  );
}
