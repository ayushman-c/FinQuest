import { auth, db } from "../../firebase.js";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import './Signup.css';

const features = [
  {
    title: 'Smart Portfolio Analytics',
    desc: 'Deep insights into your asset allocation and performance.',
  },
  {
    title: 'Expert-Led Curriculum',
    desc: '150+ interactive lessons from certified financial planners.',
  },
];

export default function Signup() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user doc already exists
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // First time — create their document
        await setDoc(userRef, {
          displayName: user.displayName,
          email: user.email,
          xp: 0,
          level: 1,
          streak: 0,
          completedLessons: [],
          badges: [],
          lastLoginDate: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
      }

      navigate("/dashboard");

    } catch (error) {
      console.error("Sign in error:", error.message);
    }
  };

  return (
    <div className="signup-page">

      {/* ── Left Panel ── */}
      <div className="signup-left">
        <div className="signup-logo">
          <div className="signup-logo-icon">F</div>
          <span className="signup-logo-text">FinQuest</span>
        </div>

        <h1 className="signup-heading">
          Master your <br />
          <span className="signup-heading-green">financial future</span>.
        </h1>

        <p className="signup-subtext">
          Join 50,000+ users building wealth through interactive learning and professional-grade tracking tools.
        </p>

        <ul className="signup-features">
          {features.map((f, i) => (
            <li key={i} className="signup-feature-item">
              <span className="signup-check">✓</span>
              <div>
                <p className="signup-feature-title">{f.title}</p>
                <p className="signup-feature-desc">{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <button className="signup-google-btn" onClick={handleGoogleSignIn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p className="signup-terms">
          By continuing, you agree to our{' '}
          <a href="#" className="signup-link">Terms of Service</a> and{' '}
          <a href="#" className="signup-link">Privacy Policy</a>.
        </p>
      </div>

      {/* ── Right Panel ── */}
      <div className="signup-right">
        <div className="signup-right-icon">↗</div>

        <h2 className="signup-right-heading">Elevate your financial IQ.</h2>

        <div className="signup-stats">
          <div className="signup-stat-card">
            <span className="signup-stat-emoji">📚</span>
            <p className="signup-stat-number">150+</p>
            <p className="signup-stat-label">EXPERT LESSONS</p>
          </div>
          <div className="signup-stat-card">
            <span className="signup-stat-emoji">🔒</span>
            <p className="signup-stat-number">Bank</p>
            <p className="signup-stat-label">GRADE SECURITY</p>
          </div>
        </div>

        <div className="signup-trusted">
          <p className="signup-trusted-label">TRUSTED BY INNOVATORS AT</p>
          <div className="signup-trusted-logos">
            {['Stellar', 'Orbit.', 'NEXUS', 'Prime'].map((name) => (
              <span key={name} className="signup-trusted-name">{name}</span>
            ))}
          </div>
        </div>

        <div className="signup-right-footer">
          <span className="signup-platform">FINQUEST PLATFORM V4.0</span>
          <span className="signup-status">
            <span className="signup-status-dot" /> SYSTEM STATUS: ONLINE
          </span>
        </div>
      </div>

    </div>
  );
}