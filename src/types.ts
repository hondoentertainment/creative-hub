export type WorkType =
  | "Writing"
  | "Music"
  | "Art"
  | "Video"
  | "Design"
  | "Website"
  | "Other";

export interface CreativeWork {
  id: string;
  title: string;
  description?: string;
  type: WorkType;
  driveUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export type SortOption = "newest" | "oldest" | "title-az" | "title-za";
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
