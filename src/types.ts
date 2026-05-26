export type WorkType =
  | "Writing"
  | "Music"
  | "Art"
  | "Video"
  | "Design"
  | "Website"
  | "Other";

export interface WorkLink {
  label: string;
  url: string;
}

export interface CreativeWork {
  id: string;
  title: string;
  description?: string;
  type: WorkType;
  driveUrl: string;
  links?: WorkLink[];
  thumbnailUrl?: string;
  featured?: boolean;
  order?: number;
  tags?: string[];
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  workIds: string[];
}

export type SortOption = "newest" | "oldest" | "title-az" | "title-za" | "custom";
export type ViewMode = "grid" | "list";

export const WORK_TYPES: WorkType[] = [
  "Writing",
  "Music",
  "Art",
  "Video",
  "Design",
  "Website",
  "Other",
];
