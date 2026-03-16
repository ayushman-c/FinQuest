import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export function useUser(uid) {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    if (!uid) return;
    return onSnapshot(doc(db, "users", uid), (snap) => {
      setUserData({ id: snap.id, ...snap.data() });
    });
  }, [uid]);
  return userData;
}