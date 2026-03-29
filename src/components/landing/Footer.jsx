import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">

        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-icon">FQ</div>
            <span className="footer-logo-text">FinQuest</span>
          </div>
          <p className="footer-tagline">
            FinQuest — Learn Money. Test Knowledge. Play Your Financial Life.
            Empowering the next generation through gamified finance.
          </p>
        </div>

        {/* Platform */}
        <div className="footer-col">
          <h4 className="footer-col-title">PLATFORM</h4>
          <ul className="footer-links">
            {['Learn', 'Quiz', 'Simulator', 'Leaderboard'].map((item) => (
              <li key={item}><a href="#" className="footer-link">{item}</a></li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="footer-col">
          <h4 className="footer-col-title">COMPANY</h4>
          <ul className="footer-links">
            {['About Us', 'Careers', 'Contact', 'Privacy Policy'].map((item) => (
              <li key={item}><a href="#" className="footer-link">{item}</a></li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div className="footer-col">
          <h4 className="footer-col-title">CONNECT</h4>
          <div className="footer-socials">
            <a href="#" className="footer-social-btn" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" className="footer-social-btn" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p className="footer-copy">© 2023 FinQuest Inc. All rights reserved.</p>
        <div className="footer-legal">
          <a href="#" className="footer-legal-link">Terms of Service</a>
          <a href="#" className="footer-legal-link">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}
