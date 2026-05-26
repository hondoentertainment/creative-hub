import { useState, useCallback } from "react";
import type { Collection } from "../types";
import * as collectionStore from "../store/collectionStore";

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>(() =>
    collectionStore.getAllCollections()
  );

  const refresh = useCallback(() => {
    setCollections(collectionStore.getAllCollections());
  }, []);

  const add = useCallback((name: string) => {
    const created = collectionStore.addCollection(name);
    setCollections((prev) => [...prev, created]);
    return created;
  }, []);

  const update = useCallback((id: string, updates: Partial<Omit<Collection, "id">>) => {
    const updated = collectionStore.updateCollection(id, updates);
    if (updated) setCollections((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  }, []);

  const remove = useCallback((id: string) => {
    if (collectionStore.deleteCollection(id)) {
      setCollections((prev) => prev.filter((c) => c.id !== id));
      return true;
    }
    return false;
  }, []);

  const addWork = useCallback((collectionId: string, workId: string) => {
    if (collectionStore.addWorkToCollection(collectionId, workId)) {
      refresh();
      return true;
    }
    return false;
  }, [refresh]);

  const removeWork = useCallback((collectionId: string, workId: string) => {
    if (collectionStore.removeWorkFromCollection(collectionId, workId)) {
      refresh();
      return true;
    }
    return false;
  }, [refresh]);

  return { collections, add, update, remove, addWork, removeWork, refresh };
}
