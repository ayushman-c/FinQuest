import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      {/* Left Content */}
      <div className="hero-left">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Next-Gen Financial Learning
        </div>

        <h1 className="hero-heading">
          Master Money <br />
          <span className="hero-heading-green">Before You Play</span> <br />
          the Game
        </h1>

        <p className="hero-subtext">
          Learn essential financial concepts through interactive lessons and
          quizzes, then test your skills in a real-life financial simulator.
        </p>

        <div className="hero-buttons">
          <a href="#final" className="btn-primary">Start Learning</a>
          <a href="#final" className="btn-secondary">Try the Demo Simulation</a>
        </div>
      </div>

      {/* Right Visual */}
      <div className="hero-right">
        {/* Net Worth Badge */}
        <div className="hero-badge-card">
          <div className="hero-badge-card-icon">↗</div>
          <div>
            <p className="hero-badge-card-label">Net Worth</p>
            <p className="hero-badge-card-value">+$12,450.00</p>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="hero-mockup-wrapper">
          <div className="hero-mockup">
            {/* Mockup Top Bar */}
            <div className="mockup-topbar">
              <span className="mockup-tab active">Plan</span>
              <span className="mockup-tab">Payments</span>
              <span className="mockup-tab">Dividends</span>
            </div>

            {/* Mockup Table */}
            <div className="mockup-table">
              <div className="mockup-table-header">
                <span>Payment name</span>
                <span>Label</span>
                <span>In future mode</span>
              </div>
              {[
                { name: 'Savings Account', color: '#d1fae5' },
                { name: 'Financial Investment', color: '#fef9c3' },
                { name: 'Monthly Schedule', color: '#fef9c3' },
                { name: 'Personal Income', color: '#d1fae5' },
                { name: 'Assumption Rate', color: '#f3f4f6' },
              ].map((row, i) => (
                <div className="mockup-table-row" key={i}>
                  <span className="mockup-row-name">{row.name}</span>
                  <span className="mockup-row-bar" style={{ backgroundColor: row.color }} />
                  <span className="mockup-row-bar light" />
                </div>
              ))}
            </div>

            {/* Mockup Footer Chart */}
            <div className="mockup-chart">
              {[40, 65, 50, 80, 55, 70, 45, 90].map((h, i) => (
                <div key={i} className="mockup-bar" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
