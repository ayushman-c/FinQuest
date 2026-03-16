import './Navbar.css';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <div className="navbar-logo-icon">F</div>
        <span className="navbar-logo-text">FinQuest</span>
      </div>

      {/* Nav Links + CTA */}
      <div className="navbar-right">
        {['Features', 'How It Works', 'Leaderboard'].map((item) => (
          <a key={item} href="#features" className="navbar-link">
            {item}
          </a>
        ))}
        
        <Link to="/sign-in" className="navbar-cta">
          Get Started
        </Link>
      </div>
    </nav>
  );
}
