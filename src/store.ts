import type { CreativeWork } from "./types";

const STORAGE_KEY = "creative-hub-works";

function loadWorks(): CreativeWork[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CreativeWork[];
    const needsOrder = parsed.some((w) => w.order == null);
    if (needsOrder) {
      parsed.forEach((w, i) => {
        if (w.order == null) w.order = i;
      });
      saveWorks(parsed);
    }
    return parsed;
  } catch {
    return [];
  }
}

function saveWorks(works: CreativeWork[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(works));
}

export function getAllWorks(): CreativeWork[] {
  return loadWorks();
}

export function addWork(work: Omit<CreativeWork, "id" | "createdAt">): CreativeWork {
  const works = loadWorks();
  const maxOrder = works.reduce((m, w) => Math.max(m, w.order ?? -Infinity), -Infinity);
  const newWork: CreativeWork = {
    ...work,
    id: crypto.randomUUID(),
    order: (work.order ?? maxOrder + 1),
    createdAt: new Date().toISOString(),
  };
  works.push(newWork);
  saveWorks(works);
  return newWork;
}

export function updateWork(id: string, updates: Partial<Omit<CreativeWork, "id" | "createdAt">>): CreativeWork | null {
  const works = loadWorks();
  const idx = works.findIndex((w) => w.id === id);
  if (idx < 0) return null;
  works[idx] = { ...works[idx], ...updates };
  saveWorks(works);
  return works[idx];
}

export function deleteWork(id: string): boolean {
  const works = loadWorks();
  const filtered = works.filter((w) => w.id !== id);
  if (filtered.length === works.length) return false;
  saveWorks(filtered);
  return true;
}

export function restoreWork(work: CreativeWork): CreativeWork {
  const works = loadWorks();
  works.push(work);
  saveWorks(works);
  return work;
}

export function getWorkById(id: string): CreativeWork | null {
  return loadWorks().find((w) => w.id === id) ?? null;
}

export function addManyWorks(
  items: Omit<CreativeWork, "id" | "createdAt">[]
): CreativeWork[] {
  const works = loadWorks();
  let nextOrder = works.reduce((m, w) => Math.max(m, w.order ?? -Infinity), -Infinity) + 1;
  const newWorks: CreativeWork[] = items.map((item) => ({
    ...item,
    id: crypto.randomUUID(),
    order: item.order ?? nextOrder++,
    createdAt: new Date().toISOString(),
  }));
  works.push(...newWorks);
  saveWorks(works);
  return newWorks;
}

export function reorderWorks(workIds: string[]): void {
  const works = loadWorks();
  const byId = new Map(works.map((w) => [w.id, w]));
  const reordered = workIds
    .map((id) => byId.get(id))
    .filter((w): w is CreativeWork => w != null);
  reordered.forEach((w, i) => {
    w.order = i;
  });
  saveWorks(works);
}

export function replaceAllWorks(works: CreativeWork[]): void {
  saveWorks(works);
}
