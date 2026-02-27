import { useState, useEffect, useCallback } from "react";
import type { CreativeWork } from "../types";
import * as store from "../store";

export function useWorks() {
  const [works, setWorks] = useState<CreativeWork[]>([]);

  const refresh = useCallback(() => {
    setWorks(store.getAllWorks());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    (work: Omit<CreativeWork, "id" | "createdAt">) => {
      const created = store.addWork(work);
      setWorks((prev) => [...prev, created]);
      return created;
    },
    []
  );

  const update = useCallback(
    (id: string, updates: Partial<Omit<CreativeWork, "id" | "createdAt">>) => {
      const updated = store.updateWork(id, updates);
      if (updated) setWorks((prev) => prev.map((w) => (w.id === id ? updated : w)));
      return updated;
    },
    []
  );

  const remove = useCallback((id: string) => {
    if (store.deleteWork(id)) {
      setWorks((prev) => prev.filter((w) => w.id !== id));
      return true;
    }
    return false;
  }, []);

  const restore = useCallback((work: CreativeWork) => {
    store.restoreWork(work);
    setWorks((prev) => [...prev, work]);
  }, []);

  const addMany = useCallback(
    (items: Omit<CreativeWork, "id" | "createdAt">[]) => {
      const created = store.addManyWorks(items);
      setWorks((prev) => [...prev, ...created]);
      return created;
    },
    []
  );

  const replaceAll = useCallback((newWorks: CreativeWork[]) => {
    store.replaceAllWorks(newWorks);
    setWorks(newWorks);
  }, []);

  return { works, add, addMany, update, remove, restore, replaceAll, refresh };
}
