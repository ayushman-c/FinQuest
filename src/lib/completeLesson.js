import { doc, updateDoc, increment, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { getLevelFromXP } from "./levels";

export async function completeLesson(uid, lesson, currentUserData) {
  // Don't award XP if already completed
  if (currentUserData.completedLessons.includes(lesson.id)) return;

  const newXP = currentUserData.xp + lesson.xpReward;
  const newLevel = getLevelFromXP(newXP);
  const didLevelUp = newLevel > currentUserData.level;

  const updates = {
    xp: increment(lesson.xpReward),      // atomic — never read-modify-write
    level: newLevel,
    completedLessons: arrayUnion(lesson.id),
    lastUpdated: serverTimestamp(),
  };

  // Award lesson badge if present
  if (lesson.badgeAwarded) {
    updates.badges = arrayUnion(lesson.badgeAwarded);
  }

  await updateDoc(doc(db, "users", uid), updates);

  // Return what happened so the UI can show celebration modals
  return { xpEarned: lesson.xpReward, didLevelUp, newLevel, badge: lesson.badgeAwarded };
}