import './SocialProof.css';

const testimonials = [
  {
    initials: 'JD',
    quote: '"The simulator is eye-opening. I realized my \'safe\' strategy was actually losing value to inflation every year. Now I feel confident starting a brokerage account."',
    author: '— Jamie D., University Student',
    color: '#22c55e',
  },
  {
    initials: 'MK',
    quote: '"Finally, a financial app that doesn\'t feel like a lecture. It\'s as addictive as Duolingo but helps me save real money."',
    author: '— Marcus K., Creative Lead',
    color: '#6366f1',
  },
];

export default function SocialProof() {
  return (
    <section className="sp">
      {/* Left */}
      <div className="sp-left">
        <div className="sp-stat-card">
          <span className="sp-stat-number">85%</span>
          <p className="sp-stat-label">of young adults lack basic financial literacy.</p>
        </div>

        <h2 className="sp-heading">We're on a mission to change that statistic.</h2>
        <p className="sp-body">
          FinQuest was built to bridge the gap between academic knowledge and real-world application. Hear from our beta users.
        </p>
      </div>

      {/* Right */}
      <div className="sp-right">
        {testimonials.map((t, i) => (
          <div className="sp-card" key={i}>
            <div className="sp-avatar" style={{ backgroundColor: t.color }}>
              {t.initials}
            </div>
            <div className="sp-card-content">
              <p className="sp-quote">{t.quote}</p>
              <p className="sp-author">{t.author}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
