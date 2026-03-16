import './HowItWorks.css';

const steps = [
  {
    number: '1',
    title: 'Learn',
    desc: 'Engage with visual modules designed by financial experts. No boring textbooks here.',
  },
  {
    number: '2',
    title: 'Quiz',
    desc: 'Apply what you\'ve learned. Our adaptive quizzes ensure you truly understand the core concepts.',
  },
  {
    number: '3',
    title: 'Play',
    desc: 'Step into the life simulator. Buy a house, invest in stocks, and see how your choices play out.',
  },
];

export default function HowItWorks() {
  return (
    <section className="hiw">
      <div className="hiw-header">
        <h2 className="hiw-title">Your Path to Wealth Mastery</h2>
        <p className="hiw-subtitle">Three simple steps to change the way you see money forever.</p>
      </div>

      <div className="hiw-grid">
        {steps.map((step, i) => (
          <div className="hiw-step" key={i}>
            <div className="hiw-number">{step.number}</div>
            <h3 className="hiw-step-title">{step.title}</h3>
            <p className="hiw-step-desc">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
