import type { Collection } from "../types";

const STORAGE_KEY = "creative-hub-collections";

function load(): Collection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function save(collections: Collection[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
}

export function getAllCollections(): Collection[] {
  return load();
}

export function addCollection(name: string): Collection {
  const collections = load();
  const newCol: Collection = {
    id: crypto.randomUUID(),
    name,
    workIds: [],
  };
  collections.push(newCol);
  save(collections);
  return newCol;
}

export function updateCollection(id: string, updates: Partial<Omit<Collection, "id">>): Collection | null {
  const collections = load();
  const idx = collections.findIndex((c) => c.id === id);
  if (idx < 0) return null;
  collections[idx] = { ...collections[idx], ...updates };
  save(collections);
  return collections[idx];
}

export function deleteCollection(id: string): boolean {
  const collections = load().filter((c) => c.id !== id);
  if (collections.length === load().length) return false;
  save(collections);
  return true;
}

export function addWorkToCollection(collectionId: string, workId: string): boolean {
  const collections = load();
  const col = collections.find((c) => c.id === collectionId);
  if (!col || col.workIds.includes(workId)) return false;
  col.workIds.push(workId);
  save(collections);
  return true;
}

export function removeWorkFromCollection(collectionId: string, workId: string): boolean {
  const collections = load();
  const col = collections.find((c) => c.id === collectionId);
  if (!col) return false;
  const before = col.workIds.length;
  col.workIds = col.workIds.filter((id) => id !== workId);
  if (col.workIds.length === before) return false;
  save(collections);
  return true;
}
