export type WorkType =
  | "Writing"
  | "Music"
  | "Art"
  | "Video"
  | "Design"
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

export const WORK_TYPES: WorkType[] = [
  "Writing",
  "Music",
  "Art",
  "Video",
  "Design",
  "Other",
];
