import './CTA.css';
import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="cta-wrapper" id="final">
      <div className="cta-card">
        <h2 className="cta-title">Start Your Financial <br /> Journey Today</h2>
        <p className="cta-subtitle">
          Join thousands of others mastering the game of money. It's free to start and rewarding to finish.
        </p>
        <Link to="/sign-in">
         <div className="cta-btn">Begin Learning for Free</div>
        </Link>
      </div>
    </section>
  );
}
