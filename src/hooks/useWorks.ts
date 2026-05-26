import { useState, useEffect, useCallback } from "react";
import type { CreativeWork } from "../types";
import * as store from "../store";
import {
  isFirebaseConfigured,
  initFirebaseSync,
  syncWorksToFirebase,
} from "../lib/firebaseSync";

export function useWorks() {
  const [works, setWorks] = useState<CreativeWork[]>([]);

  const refresh = useCallback(() => {
    setWorks(store.getAllWorks());
  }, []);

  useEffect(() => {
    const local = store.getAllWorks();
    setWorks(local);
    if (isFirebaseConfigured()) {
      initFirebaseSync(local, (merged) => {
        store.replaceAllWorks(merged);
        setWorks(merged);
      }).catch(() => {});
    }
  }, []);

  const sync = useCallback(() => {
    if (isFirebaseConfigured()) syncWorksToFirebase(store.getAllWorks());
  }, []);

  const add = useCallback(
    (work: Omit<CreativeWork, "id" | "createdAt">) => {
      const created = store.addWork(work);
      setWorks((prev) => [...prev, created]);
      sync();
      return created;
    },
    [sync]
  );

  const update = useCallback(
    (id: string, updates: Partial<Omit<CreativeWork, "id" | "createdAt">>) => {
      const updated = store.updateWork(id, updates);
      if (updated) {
        setWorks((prev) => prev.map((w) => (w.id === id ? updated : w)));
        sync();
      }
      return updated;
    },
    [sync]
  );

  const remove = useCallback((id: string) => {
    if (store.deleteWork(id)) {
      setWorks((prev) => prev.filter((w) => w.id !== id));
      sync();
      return true;
    }
    return false;
  }, [sync]);

  const restore = useCallback((work: CreativeWork) => {
    store.restoreWork(work);
    setWorks((prev) => [...prev, work]);
    sync();
  }, [sync]);

  const addMany = useCallback(
    (items: Omit<CreativeWork, "id" | "createdAt">[]) => {
      const created = store.addManyWorks(items);
      setWorks((prev) => [...prev, ...created]);
      sync();
      return created;
    },
    [sync]
  );

  const replaceAll = useCallback((newWorks: CreativeWork[]) => {
    store.replaceAllWorks(newWorks);
    setWorks(newWorks);
    sync();
  }, [sync]);

  const reorder = useCallback((workIds: string[]) => {
    store.reorderWorks(workIds);
    setWorks(store.getAllWorks());
    sync();
  }, [sync]);

  return { works, add, addMany, update, remove, restore, replaceAll, reorder, refresh };
}
