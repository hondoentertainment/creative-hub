import type { CreativeWork } from "../types";

export type SyncStatus = "idle" | "syncing" | "synced" | "offline" | "error";

const ENV_KEYS = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_APP_ID",
] as const;

export function isFirebaseConfigured(): boolean {
  return ENV_KEYS.every((key) => typeof import.meta.env[key] === "string" && import.meta.env[key]);
}

let syncStatus: SyncStatus = "idle";
const listeners = new Set<(s: SyncStatus) => void>();

export function getSyncStatus(): SyncStatus {
  return syncStatus;
}

export function subscribeSyncStatus(cb: (s: SyncStatus) => void): () => void {
  listeners.add(cb);
  cb(syncStatus);
  return () => listeners.delete(cb);
}

function setSyncStatus(s: SyncStatus) {
  syncStatus = s;
  listeners.forEach((cb) => cb(s));
}

export async function fetchWorksFromFirebase(): Promise<CreativeWork[] | null> {
  if (!isFirebaseConfigured()) return null;
  try {
    setSyncStatus("syncing");
    const { getFirebase } = await import("./firebase");
    const { auth, db } = getFirebase();
    const user = auth.currentUser;
    if (!user) return null;
    const { collection, getDocs } = await import("firebase/firestore");
    const snapshot = await getDocs(collection(db, "users", user.uid, "works"));
    const works = snapshot.docs.map((d) => d.data() as CreativeWork);
    setSyncStatus("synced");
    return works;
  } catch (e) {
    console.warn("Firebase fetch failed:", e);
    setSyncStatus("error");
    return null;
  }
}

export async function syncWorksToFirebase(works: CreativeWork[]): Promise<void> {
  if (!isFirebaseConfigured()) return;
  try {
    setSyncStatus("syncing");
    const { getFirebase } = await import("./firebase");
    const { auth, db } = getFirebase();
    const user = auth.currentUser;
    if (!user) {
      setSyncStatus("idle");
      return;
    }
    const { collection, doc, writeBatch } = await import("firebase/firestore");
    const batch = writeBatch(db);
    const col = collection(db, "users", user.uid, "works");
  works.forEach((w) => {
    const d = doc(col, w.id);
    batch.set(d, { ...w, updatedAt: new Date().toISOString() }, { merge: true });
  });
    await batch.commit();
    setSyncStatus("synced");
  } catch (e) {
    console.warn("Firebase sync failed:", e);
    setSyncStatus("error");
  }
}

export async function initFirebaseSync(
  localWorks: CreativeWork[],
  onRemoteFetch: (works: CreativeWork[]) => void
): Promise<void> {
  if (!isFirebaseConfigured()) {
    setSyncStatus("idle");
    return;
  }
  try {
    setSyncStatus("syncing");
    const { getFirebase } = await import("./firebase");
    const { auth, db } = getFirebase();
    const { signInAnonymously } = await import("firebase/auth");
    await signInAnonymously(auth);
    const user = auth.currentUser;
    if (!user) {
      setSyncStatus("idle");
      return;
    }
    const { collection, getDocs } = await import("firebase/firestore");
    const snapshot = await getDocs(collection(db, "users", user.uid, "works"));
    const remote = snapshot.docs.map((d) => d.data() as CreativeWork & { updatedAt?: string });

    if (remote.length === 0 && localWorks.length > 0) {
      await syncWorksToFirebase(localWorks);
    } else if (remote.length > 0) {
      const merged = mergeWorks(localWorks, remote);
      onRemoteFetch(merged);
    }
    setSyncStatus("synced");
  } catch (e) {
    console.warn("Firebase init failed:", e);
    setSyncStatus("offline");
  }
}

function mergeWorks(local: CreativeWork[], remote: (CreativeWork & { updatedAt?: string })[]): CreativeWork[] {
  const byId = new Map<string, CreativeWork & { updatedAt?: string }>();
  local.forEach((w) => byId.set(w.id, w));
  remote.forEach((r) => {
    const existing = byId.get(r.id);
    const rUpdated = r.updatedAt ? new Date(r.updatedAt).getTime() : 0;
    const lUpdated = existing?.createdAt ? new Date(existing.createdAt).getTime() : 0;
    if (!existing || rUpdated >= lUpdated) {
      const { updatedAt, ...work } = r;
      byId.set(r.id, work);
    }
  });
  return Array.from(byId.values()) as CreativeWork[];
}
