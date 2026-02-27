import type { CreativeWork } from "../types";
import { WORK_TYPES } from "../types";

const EXPORT_FILENAME = "creative-hub-backup.json";

export interface ExportData {
  version: 1;
  exportedAt: string;
  works: CreativeWork[];
}

export function exportToJson(works: CreativeWork[]): void {
  const data: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    works,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = EXPORT_FILENAME;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImportFile(raw: string): CreativeWork[] | { error: string } {
  try {
    const data = JSON.parse(raw);
    const works = Array.isArray(data) ? data : data?.works ?? [];
    if (!Array.isArray(works)) {
      return { error: "Invalid format: expected an array of works" };
    }
    const valid: CreativeWork[] = [];
    for (let i = 0; i < works.length; i++) {
      const w = works[i];
      if (!w || typeof w.title !== "string" || typeof w.driveUrl !== "string") {
        continue;
      }
      valid.push({
        id: typeof w.id === "string" ? w.id : crypto.randomUUID(),
        title: w.title,
        description: typeof w.description === "string" ? w.description : undefined,
        type: WORK_TYPES.includes(w.type) ? w.type : "Other",
        driveUrl: w.driveUrl,
        thumbnailUrl: typeof w.thumbnailUrl === "string" ? w.thumbnailUrl : undefined,
        createdAt: typeof w.createdAt === "string" ? w.createdAt : new Date().toISOString(),
      });
    }
    return valid;
  } catch (e) {
    return { error: "Invalid JSON file" };
  }
}
