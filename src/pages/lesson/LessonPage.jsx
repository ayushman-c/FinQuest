import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc, getDoc, onSnapshot,
  updateDoc, increment, arrayUnion, serverTimestamp,
} from "firebase/firestore";
import "./LessonPage.css";

// ── Level helper ──────────────────────────────────────────────────────────────
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 850, 1300, 1900, 2600, 3400, 4300, 5300];
function getLevelFromXP(xp) {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return level;
}

// ── Firestore helpers ─────────────────────────────────────────────────────────
async function saveProgress(uid, lessonId, contentStep, quizStarted, quizAnswers) {
  try {
    await updateDoc(doc(db, "users", uid), {
      [`lessonProgress.${lessonId}.contentStep`]: contentStep,
      [`lessonProgress.${lessonId}.quizStarted`]: quizStarted,
      [`lessonProgress.${lessonId}.quizAnswers`]: quizAnswers,
    });
  } catch (e) {
    console.error("Failed to save progress:", e);
  }
}

async function completeLesson(uid, lesson, userData) {
  if (userData.completedLessons?.includes(lesson.id)) return null;

  const newXP      = (userData.xp ?? 0) + (lesson.xpReward ?? 0);
  const newLevel   = getLevelFromXP(newXP);
  const didLevelUp = newLevel > getLevelFromXP(userData.xp ?? 0);

  const updates = {
    xp:               increment(lesson.xpReward ?? 0),
    level:            newLevel,
    completedLessons: arrayUnion(lesson.id),
    lastUpdated:      serverTimestamp(),
    [`lessonProgress.${lesson.id}.contentStep`]:
      (lesson.content?.length ?? 1) - 1,
    [`lessonProgress.${lesson.id}.quizStarted`]: true,
  };

  if (lesson.badgeAwarded) {
    updates.badges = arrayUnion(lesson.badgeAwarded);
  }

  await updateDoc(doc(db, "users", uid), updates);
  return { xpEarned: lesson.xpReward, didLevelUp, newLevel, badge: lesson.badgeAwarded };
}

// ── ContentSlide ──────────────────────────────────────────────────────────────
function ContentSlide({ slide, index, total }) {
    console.log("Slide data:", slide)
  return (
    <div className="lp-slide" key={index}>
      <span className="lp-slide__counter">{index + 1} / {total}</span>
      <h2 className="lp-slide__heading">{slide.heading}</h2>
      <p className="lp-slide__body">{slide.body}</p>
      {slide.tip && slide.tip !== "null" && (
        <div className="lp-slide__tip">
          <span className="lp-slide__tip-icon">💡</span>
          <p>{slide.tip}</p>
        </div>
      )}
    </div>
  );
}

// ── QuizQuestion ──────────────────────────────────────────────────────────────
function QuizQuestion({ question, questionIndex, total, selectedAnswer, onSelect, showResult }) {
  const isCorrect = selectedAnswer === question.correct;
  return (
    <div className="lp-quiz">
      <span className="lp-quiz__counter">Question {questionIndex + 1} of {total}</span>
      <h2 className="lp-quiz__text">{question.question}</h2>
      <div className="lp-quiz__options">
        {question.options.map((option, i) => {
          let cls = "lp-option";
          if (selectedAnswer === i) {
            if (showResult) cls += isCorrect ? " lp-option--correct" : " lp-option--wrong";
            else cls += " lp-option--selected";
          } else if (showResult && i === question.correct) {
            cls += " lp-option--correct";
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => !showResult && onSelect(i)}
              disabled={showResult}
            >
              <span className="lp-option__letter">{String.fromCharCode(65 + i)}</span>
              <span className="lp-option__text">{option}</span>
              {showResult && i === question.correct && (
                <span className="lp-option__tick">✓</span>
              )}
              {showResult && selectedAnswer === i && !isCorrect && (
                <span className="lp-option__tick lp-option__tick--wrong">✗</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── CelebrationModal ──────────────────────────────────────────────────────────
function CelebrationModal({ xpEarned, didLevelUp, newLevel, badge, onDone }) {
  return (
    <div className="lp-overlay">
      <div className="lp-modal">
        <div className="lp-modal__emoji">🎉</div>
        <h2 className="lp-modal__title">Lesson Complete!</h2>
        <p className="lp-modal__sub">You crushed it. Keep the momentum going!</p>
        <div className="lp-modal__rewards">
          <div className="lp-modal__reward">
            <span>⭐</span>
            <span>+{xpEarned} XP earned</span>
          </div>
          {didLevelUp && (
            <div className="lp-modal__reward lp-modal__reward--green">
              <span>🏆</span>
              <span>Level Up! You're now Level {newLevel}</span>
            </div>
          )}
          {badge && (
            <div className="lp-modal__reward lp-modal__reward--green">
              <span>🎖️</span>
              <span>New badge unlocked!</span>
            </div>
          )}
        </div>
        <button className="lp-modal__btn" onClick={onDone}>
          Back to Dashboard →
        </button>
      </div>
    </div>
  );
}

// ── LessonPage ────────────────────────────────────────────────────────────────
export default function LessonPage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  // auth + data
  const [authUser,     setAuthUser]     = useState(null);
  const [userData,     setUserData]     = useState(null);
  const [lesson,       setLesson]       = useState(null);

  // ui states
  const [loading,      setLoading]      = useState(true);
  const [blocked,      setBlocked]      = useState(false);
  const [lessonReady,  setLessonReady]  = useState(false);

  // content
  const [contentStep,  setContentStep]  = useState(0);
  const [phase,        setPhase]        = useState("content"); // content | quiz | done

  // quiz
  const [currentQ,     setCurrentQ]     = useState(0);
  const [selected,     setSelected]     = useState(null);
  const [showResult,   setShowResult]   = useState(false);
  const [quizAnswers,  setQuizAnswers]  = useState({});
  const [wrongAnswer,  setWrongAnswer]  = useState(false);

  // celebration
  const [celebration,  setCelebration]  = useState(null);

  // ── 1. Auth ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setAuthUser(user);
      else navigate("/sign-in");
    });
    return unsub;
  }, [navigate]);

  // ── 2. Live user doc ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!authUser) return;
    const unsub = onSnapshot(doc(db, "users", authUser.uid), (snap) => {
      if (snap.exists()) setUserData({ id: snap.id, ...snap.data() });
    });
    return unsub;
  }, [authUser]);

  // ── 3. Load lesson once user data is ready ────────────────────────────────
  useEffect(() => {
    if (!authUser || !userData || lessonReady) return;

    async function load() {
      const snap = await getDoc(doc(db, "lessons", id));

      // lesson doesn't exist
      if (!snap.exists()) {
        navigate("/dashboard");
        return;
      }

      const data = { id: snap.id, ...snap.data() };

      // XP gate
      if ((userData.xp ?? 0) < (data.xpRequired ?? 0)) {
        setBlocked(true);
        setLoading(false);
        return;
      }

      const alreadyDone = userData.completedLessons?.includes(id);
      const saved       = userData.lessonProgress?.[id];

      if (alreadyDone) {
        // review mode — show done screen
        setPhase("done");
        setContentStep((data.content?.length ?? 1) - 1);
      } else if (saved) {
        // restore where they left off
        setContentStep(saved.contentStep ?? 0);
        setQuizAnswers(saved.quizAnswers ?? {});
        if (saved.quizStarted) {
          setPhase("quiz");
          // find the first unanswered question
          const firstUnanswered = (data.quiz ?? []).findIndex(
            (_, i) => !(i in (saved.quizAnswers ?? {}))
          );
          setCurrentQ(firstUnanswered >= 0 ? firstUnanswered : 0);
        }
      }

      setLesson(data);
      setLessonReady(true);
      setLoading(false);
    }

    load();
  }, [authUser, userData, id, lessonReady, navigate]);

  // ── Content navigation ────────────────────────────────────────────────────
  const handleNext = async () => {
    const total = lesson.content?.length ?? 0;
    if (contentStep < total - 1) {
      const next = contentStep + 1;
      setContentStep(next);
      await saveProgress(authUser.uid, lesson.id, next, false, quizAnswers);
    } else {
      // end of content → go to quiz
      setPhase("quiz");
      setCurrentQ(0);
      setSelected(null);
      await saveProgress(authUser.uid, lesson.id, contentStep, true, quizAnswers);
    }
  };

  const handlePrev = async () => {
    if (contentStep > 0) {
      const prev = contentStep - 1;
      setContentStep(prev);
      await saveProgress(authUser.uid, lesson.id, prev, false, quizAnswers);
    }
  };

  // ── Quiz logic ────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (selected === null) return;

    const q         = lesson.quiz[currentQ];
    const isCorrect = selected === q.correct;

    setShowResult(true);
    const updatedAnswers = { ...quizAnswers, [currentQ]: selected };
    setQuizAnswers(updatedAnswers);
    await saveProgress(authUser.uid, lesson.id, contentStep, true, updatedAnswers);

    if (!isCorrect) {
      setWrongAnswer(true);
      return;
    }

    // correct — show green tick briefly then move on
    setTimeout(async () => {
      setShowResult(false);
      setSelected(null);
      setWrongAnswer(false);

      if (currentQ < lesson.quiz.length - 1) {
        setCurrentQ((q) => q + 1);
      } else {
        // all answered correctly → complete
        const result = await completeLesson(authUser.uid, lesson, userData);
        setCelebration(result);
        setPhase("done");
      }
    }, 900);
  };

  const handleRetry = () => {
    // clear the wrong answer and let them try again
    const cleaned = { ...quizAnswers };
    delete cleaned[currentQ];
    setQuizAnswers(cleaned);
    setShowResult(false);
    setSelected(null);
    setWrongAnswer(false);
  };

  // ── Loading / blocked screens ─────────────────────────────────────────────
  if (loading || !userData) {
    return (
      <div className="lp-loading">
        <div className="lp-loading__spinner" />
        <p>Loading lesson...</p>
      </div>
    );
  }

  if (blocked) {
    return (
      <div className="lp-blocked">
        <div className="lp-blocked__card">
          <span className="lp-blocked__icon">🔒</span>
          <h2>Lesson Locked</h2>
          <p>You need more XP to access this lesson.</p>
          <button className="lp-blocked__btn" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) return null;

  // ── Derived values ────────────────────────────────────────────────────────
  const totalContent  = lesson.content?.length ?? 0;
  const totalQuiz     = lesson.quiz?.length ?? 0;
  const isCompleted   = userData.completedLessons?.includes(id);
  const progressPct   = totalContent > 0
    ? Math.round(((contentStep + 1) / totalContent) * 100)
    : 100;

  return (
    <div className="lp">

      {/* Celebration modal */}
      {celebration && (
        <CelebrationModal {...celebration} onDone={() => navigate("/dashboard")} />
      )}

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="lp-header">
        <button className="lp-header__back" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </button>

        <div className="lp-header__center">
          <span className="lp-header__title">{lesson.title}</span>
          <div className="lp-header__track">
            <div
              className="lp-header__fill"
              style={{ width: phase === "content" ? `${progressPct}%` : "100%" }}
            />
          </div>
        </div>

        <div className="lp-header__right">
          {phase === "content" && (
            <span className="lp-header__pill">
              {contentStep + 1} / {totalContent}
            </span>
          )}
          {phase === "quiz" && (
            <span className="lp-header__pill lp-header__pill--quiz">
              Quiz · {currentQ + 1}/{totalQuiz}
            </span>
          )}
          {phase === "done" && isCompleted && (
            <span className="lp-header__pill lp-header__pill--done">✓ Completed</span>
          )}
        </div>
      </header>

      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <div className="lp-tabs">
        <button
          className={`lp-tab${phase === "content" || phase === "done" ? " lp-tab--active" : ""}`}
          onClick={() => setPhase("content")}
        >
          📖 Content
        </button>
        <button
          className={`lp-tab${phase === "quiz" ? " lp-tab--active" : ""}${!isCompleted && phase === "content" ? " lp-tab--locked" : ""}`}
          onClick={() => { if (isCompleted || phase !== "content") setPhase("quiz"); }}
          disabled={!isCompleted && phase === "content"}
          title={!isCompleted && phase === "content" ? "Finish the content first" : ""}
        >
          🎯 Quiz {!isCompleted && phase === "content" && "🔒"}
        </button>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <main className="lp-main">
        <div className="lp-wrap">

          {/* ── Content phase ─────────────────────────────────────────────── */}
          {phase === "content" && lesson.content && (
            <>
              <ContentSlide
                slide={lesson.content[contentStep]}
                index={contentStep}
                total={totalContent}
              />
              <div className="lp-nav">
                <button
                  className="lp-btn lp-btn--ghost"
                  onClick={handlePrev}
                  disabled={contentStep === 0}
                >
                  ← Previous
                </button>
                <button
                  className="lp-btn lp-btn--primary"
                  onClick={handleNext}
                >
                  {contentStep < totalContent - 1 ? "Next →" : "Start Quiz →"}
                </button>
              </div>
            </>
          )}

          {/* ── Quiz phase ────────────────────────────────────────────────── */}
          {phase === "quiz" && lesson.quiz && (
            <>
              <QuizQuestion
                question={lesson.quiz[currentQ]}
                questionIndex={currentQ}
                total={totalQuiz}
                selectedAnswer={selected}
                onSelect={setSelected}
                showResult={showResult}
              />

              {wrongAnswer && showResult && (
                <div className="lp-feedback">
                  <span>❌ Not quite — give it another try!</span>
                  <button className="lp-feedback__btn" onClick={handleRetry}>
                    Try Again
                  </button>
                </div>
              )}

              {!showResult && (
                <div className="lp-nav lp-nav--right">
                  <button
                    className="lp-btn lp-btn--primary"
                    onClick={handleSubmit}
                    disabled={selected === null}
                  >
                    Submit Answer
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── Done phase ────────────────────────────────────────────────── */}
          {phase === "done" && !celebration && (
            <div className="lp-done">
              <div className="lp-done__emoji">✅</div>
              <h2 className="lp-done__title">Lesson Complete!</h2>
              <p className="lp-done__sub">
                You earned <strong>{lesson.xpReward} XP</strong> for completing this lesson.
              </p>
              <div className="lp-done__actions">
                <button
                  className="lp-btn lp-btn--ghost"
                  onClick={() => { setPhase("content"); setContentStep(0); }}
                >
                  Review Content
                </button>
                <button
                  className="lp-btn lp-btn--ghost"
                  onClick={() => {
                    setPhase("quiz");
                    setCurrentQ(0);
                    setSelected(null);
                    setShowResult(false);
                    setWrongAnswer(false);
                  }}
                >
                  Retake Quiz
                </button>
                <button
                  className="lp-btn lp-btn--primary"
                  onClick={() => navigate("/dashboard")}
                >
                  Back to Dashboard →
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
