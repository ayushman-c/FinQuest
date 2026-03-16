import './Features.css';

const features = [
  {
    icon: '📖',
    title: 'Interactive Lessons',
    desc: 'Bite-sized modules on budgeting, saving, inflation, and complex investing made simple.',
    bg: '#f0fdf4',
    iconBg: '#dcfce7',
  },
  {
    icon: '✅',
    title: 'Quiz to Unlock',
    desc: 'Prove your mastery through interactive tests to unlock higher-level financial strategies.',
    bg: '#f0f9ff',
    iconBg: '#e0f2fe',
  },
  {
    icon: '📊',
    title: 'Life Simulator',
    desc: 'Experience 40 years of financial life in 40 minutes. Make big decisions without the real risk.',
    bg: '#f0f9ff',
    iconBg: '#e0f2fe',
  },
  {
    icon: '✨',
    title: 'Achievements',
    desc: 'Earn badges, track your growth, and compete on the global literacy leaderboard.',
    bg: '#fff7ed',
    iconBg: '#ffedd5',
  },
];

export default function Features() {
  return (
    <section className="features" id="features">
      <div className="features-header">
        <h2 className="features-title">Everything you need to succeed</h2>
        <p className="features-subtitle">
          Build a solid foundation, practice your skills, and watch your financial literacy score climb.
        </p>
      </div>

      <div className="features-grid">
        {features.map((f, i) => (
          <div className="feature-card" key={i} style={{ backgroundColor: f.bg }}>
            <div className="feature-icon" style={{ backgroundColor: f.iconBg }}>
              {f.icon}
            </div>
            <h3 className="feature-card-title">{f.title}</h3>
            <p className="feature-card-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
