export interface AboutData {
  name?: string;
  bio?: string;
  photoUrl?: string;
  email?: string;
  links?: { label: string; url: string }[];
}

const STORAGE_KEY = "creative-hub-about";

export function getAbout(): AboutData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveAbout(data: AboutData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
