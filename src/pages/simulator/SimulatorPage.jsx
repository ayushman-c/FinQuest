import { useNavigate } from "react-router-dom";
import "./SimulatorPage.css";

export default function SimulatorPage() {
  const navigate = useNavigate();

  return (
    <div className="simpage">
      <div className="simpage__card">
        <div className="simpage__icon">🎮</div>
        <h1 className="simpage__title">Financial Simulator</h1>
        <p className="simpage__sub">
          The simulation is being built. Check back soon — this is where
          your financial knowledge gets put to the real test.
        </p>
        <button className="simpage__btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
