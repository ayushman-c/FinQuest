import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot, collection, query, orderBy, getDocs } from "firebase/firestore";
import "./Dashboard.css";
import SimulatorSection from "../../components/simulator/SimulatorSection";

// ── Level thresholds ─────────────────────────────────────────────────────────
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 850, 1300, 1900, 2600, 3400, 4300, 5300];

function getLevelFromXP(xp) {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return level;
}

function getNextLevelXP(level) {
  return LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

function getCurrentLevelXP(level) {
  return LEVEL_THRESHOLDS[level - 1] ?? 0;
}

// ── Badge definitions ────────────────────────────────────────────────────────
const BADGE_META = {
  "finance-rookie":  { label: "Finance Rookie",  icon: "💰" },
  "budget-master":  { label: "Budget Master",  icon: "🏛️" },
  "saving-starter": { label: "Saving Starter", icon: "🐷" },
  "investor":       { label: "Investor",        icon: "🚀" },
  "tax-pro":        { label: "Tax Pro",         icon: "📋" },
  "debt-free":      { label: "Debt Free",       icon: "✂️" },
};

function getKnowledgeLevel(level) {
  if (level <= 2) return "Beginner";
  if (level <= 5) return "Intermediate";
  if (level <= 8) return "Advanced";
  return "Expert";
}

// ── ProgressBar ──────────────────────────────────────────────────────────────
function ProgressBar({ value, max, color, thin }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={`progress-track${thin ? " progress-track--thin" : ""}`}>
      <div
        className="progress-fill"
        style={{ width: `${pct}%`, background: color || "#16a34a" }}
      />
    </div>
  );
}

// ── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ icon, iconBg, label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon" style={{ background: iconBg }}>{icon}</div>
      <div className="stat-card__body">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">{value}</span>
        {sub && <span className="stat-card__sub">{sub}</span>}
      </div>
    </div>
  );
}

// ── LessonCard ───────────────────────────────────────────────────────────────
function LessonCard({ lesson, userXp, isCompleted, isActive, onAction }) {
  const isLocked = userXp < lesson.xpRequired;
  const xpNeeded = lesson.xpRequired - userXp;

  const levelColors = {
    BEGINNER:     { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" },
    INTERMEDIATE: { bg: "#fef9c3", color: "#ca8a04", dot: "#eab308" },
    ADVANCED:     { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" },
  };
  const lc = levelColors[lesson.level] || levelColors.BEGINNER;

  return (
    <div className={`lesson-card${isActive ? " lesson-card--active" : ""}${isLocked ? " lesson-card--locked" : ""}${isCompleted ? " lesson-card--completed" : ""}`}>

      {isActive && <div className="lesson-card__active-badge">ACTIVE</div>}

      <div className="lesson-card__top">
        <div className="lesson-card__icon">{lesson.icon || "📖"}</div>
        {isLocked && <span className="lesson-card__lock">🔒</span>}
      </div>

      <div className="lesson-card__level-badge" style={{ background: lc.bg, color: lc.color }}>
        <span className="lesson-card__level-dot" style={{ background: lc.dot }} />
        {lesson.level}
      </div>

      <h3 className="lesson-card__title">{lesson.title}</h3>
      <p className="lesson-card__desc">{lesson.description}</p>

      <div className="lesson-card__xp-row">
        <span>⭐</span>
        <span className="lesson-card__xp-text">{lesson.xpReward} XP reward</span>
        {lesson.badgeAwarded && <span className="lesson-card__badge-hint">+ badge</span>}
      </div>

      {!isLocked && (
        <div className="lesson-card__progress">
          <div className="lesson-card__progress-row">
            <span>Progress</span>
            <span>{isCompleted ? 100 : lesson.progress ?? 0}%</span>
          </div>
          <ProgressBar
            value={isCompleted ? 100 : lesson.progress ?? 0}
            max={100}
            color={isCompleted ? "#22c55e" : "#16a34a"}
            thin
          />
        </div>
      )}

      {isLocked && (
        <div className="lesson-card__locked-msg">
          🔒 Need {xpNeeded} more XP to unlock
        </div>
      )}

      {!isLocked && (
        <button
          className={`lesson-card__btn${isCompleted ? " lesson-card__btn--review" : " lesson-card__btn--start"}`}
          onClick={() => onAction(lesson.id)}
        >
          {isCompleted ? <>Review Lesson <span>↺</span></> : <>Start Lesson <span>→</span></>}
        </button>
      )}
    </div>
  );
}

// ── BadgeShelf ───────────────────────────────────────────────────────────────
function BadgeShelf({ earnedBadges }) {
  console.log("earned badges:", earnedBadges);
  return (
    <div className="badge-shelf">
      {Object.entries(BADGE_META).map(([id, meta]) => {
        const earned = earnedBadges.includes(id);
        return (
          <div key={id} className="badge-item" title={meta.label}>
            <div className={`badge-circle${earned ? " badge-circle--earned" : " badge-circle--locked"}`}>
              {meta.icon}
            </div>
            <span className={`badge-label${earned ? " badge-label--earned" : " badge-label--locked"}`}>
              {meta.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [authUser, setAuthUser]   = useState(null);
  const [userData, setUserData]   = useState(null);
  const [lessons,  setLessons]    = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [activeNav, setActiveNav] = useState("Learn");

  const NAV_LINKS = ["Learn", "Simulator", "Leaderboard", "Community"];

  // 1 — Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setAuthUser(user);
      else navigate("/sign-in");
    });
    return unsub;
  }, [navigate]);

  // 2 — Live user document
  useEffect(() => {
    if (!authUser) return;
    const unsub = onSnapshot(doc(db, "users", authUser.uid), (snap) => {
      if (snap.exists()) setUserData({ id: snap.id, ...snap.data() });
    });
    return unsub;
  }, [authUser]);

  // 3 — Lessons (fetched once, ordered by `order` field)
  useEffect(() => {
    async function fetchLessons() {
      const q    = query(collection(db, "lessons"), orderBy("order"));
      const snap = await getDocs(q);
      setLessons(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    fetchLessons();
  }, []);

  // ── Derived values ───────────────────────────────────────────────────────
  const xp               = userData?.xp ?? 0;
  const level            = getLevelFromXP(xp);
  const currentLevelXP   = getCurrentLevelXP(level);
  const nextLevelXP      = getNextLevelXP(level);
  const xpIntoLevel      = xp - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  const completedLessons = userData?.completedLessons ?? [];
  const badges           = userData?.badges ?? [];
  const streak           = userData?.streak ?? 0;
  const totalLessons     = lessons.length;
  const completionPct    = totalLessons > 0
    ? Math.round((completedLessons.length / totalLessons) * 100)
    : 0;

  const nextUnlockLesson = lessons.find(
    (l) => !completedLessons.includes(l.id) && xp < l.xpRequired
  );

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/sign-in");
  };

  if (loading || !userData) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading__spinner" />
        <p>Loading your journey...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="navbar">
        <div className="navbar__logo">
          <div className="navbar__logo-icon">FQ</div>
          <span className="navbar__logo-text">FinQuest</span>
        </div>

        <div className="navbar__links">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              className={`navbar__link${activeNav === link ? " navbar__link--active" : ""}`}
              onClick={() => setActiveNav(link)}
            >
              {link}
            </button>
          ))}
        </div>

        <div className="navbar__right">
          <div className="navbar__search">
            <span>🔍</span>
            <span>Search modules...</span>
          </div>
          <span className="navbar__bell">🔔</span>
          <div className="navbar__avatar" onClick={handleSignOut} title="Sign out">
            {authUser?.displayName?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      </nav>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="dashboard__main">

        {/* Header */}
        <div className="dashboard__header">
          <div className="dashboard__header-left">
            <h1 className="dashboard__title">Your Learning Journey</h1>
            <p className="dashboard__subtitle">
              Master financial concepts step by step before entering the simulation.
            </p>
          </div>

          <div className="completion-card">
            <div className="completion-card__top">
              <span className="completion-card__label">Course Completion</span>
              <span className="completion-card__pct">{completionPct}%</span>
            </div>
            <ProgressBar value={completedLessons.length} max={totalLessons || 1} />
            <span className="completion-card__sub">
              {completedLessons.length} of {totalLessons} lessons finished
            </span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="stat-cards-row">
          <StatCard
            icon="📚" iconBg="#f0fdf4"
            label="Lessons Completed"
            value={completedLessons.length}
            sub="+2 today"
          />
          <StatCard
            icon="🎯" iconBg="#fffbeb"
            label="Quizzes Passed"
            value={completedLessons.length}
            sub={streak > 0 ? `${streak} day streak` : "Start a streak!"}
          />
          <StatCard
            icon="📊" iconBg="#eff6ff"
            label="Knowledge Level"
            value={getKnowledgeLevel(level)}
            sub={`+${xpIntoLevel} exp`}
          />
        </div>

        {/* Body: lessons + sidebar */}
        <div className="dashboard__body">

          {/* Lessons */}
          <section className="lessons-section">
            <div className="lessons-section__header">
              <h2 className="lessons-section__title">Learning Modules</h2>
              <button className="lessons-section__view-all">View All →</button>
            </div>
            <div className="lessons-grid">
              {lessons.map((lesson) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isActive    = !isCompleted && xp >= lesson.xpRequired && (lesson.progress ?? 0) > 0;
                return (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    userXp={xp}
                    isCompleted={isCompleted}
                    isActive={isActive}
                    onAction={(id) => navigate(`/lessons/${id}`)}
                  />
                );
              })}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="sidebar">

            {/* Achievements card */}
            <div className="sidebar-card">
              <div className="sidebar-card__header">
                <div className="sidebar-card__title-row">
                  <span>⭐</span>
                  <span className="sidebar-card__title">Your Achievements</span>
                </div>
                <div className="level-badge">Level {level}</div>
              </div>

              <div className="xp-section">
                <div className="xp-section__row">
                  <span className="xp-section__label">XP Points</span>
                  <span className="xp-section__value">
                    {xp.toLocaleString()} / {nextLevelXP.toLocaleString()}
                  </span>
                </div>
                <ProgressBar value={xpIntoLevel} max={xpNeededForLevel || 1} color="#f59e0b" />
                <span className="xp-section__sub">
                  {(nextLevelXP - xp).toLocaleString()} XP to Level {level + 1}
                </span>
              </div>

              <div className="streak-card">
                <div className="streak-card__left">
                  <div className="streak-card__flame">🔥</div>
                  <div>
                    <div className="streak-card__label">CURRENT STREAK</div>
                    <div className="streak-card__value">{streak} Days</div>
                  </div>
                </div>
                <span className="streak-card__icon">📈</span>
              </div>
            </div>

            {/* Badges card */}
            <div className="sidebar-card">
              <div className="sidebar-card__section-label">BADGES EARNED</div>
              <BadgeShelf earnedBadges={badges} />
            </div>

            {/* Next unlock card */}
            {nextUnlockLesson && (
              <div className="next-unlock-card">
                <div className="next-unlock-card__label">NEXT UNLOCK</div>
                <div className="next-unlock-card__title">{nextUnlockLesson.title}</div>
                <div className="next-unlock-card__sub">
                  Earn {nextUnlockLesson.xpRequired - xp} more XP to unlock
                </div>
                <ProgressBar value={xp} max={nextUnlockLesson.xpRequired} color="#16a34a" thin />
              </div>
            )}

          </aside>
        </div>

        {/* Simulator unlock section */}
        <SimulatorSection
          completedCount={completedLessons.length}
          totalCount={totalLessons}
        />
      </main>
    </div>
  );
}
