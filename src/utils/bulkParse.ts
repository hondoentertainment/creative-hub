import type { WorkType } from "../types";
import { WORK_TYPES } from "../types";

const VALID_TYPES = new Set(WORK_TYPES);
const DRIVE_PATTERNS = /drive\.google\.com|docs\.google\.com/;

function isValidType(s: string): s is WorkType {
  return VALID_TYPES.has(s as WorkType);
}

function extractUrl(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  if (DRIVE_PATTERNS.test(trimmed)) return trimmed;
  if (trimmed.startsWith("http")) return trimmed;
  return null;
}

export interface ParsedRow {
  title: string;
  type: WorkType;
  driveUrl: string;
  description?: string;
}

export interface ParseResult {
  valid: ParsedRow[];
  invalid: { line: string; reason: string }[];
}

/**
 * Parse bulk input. Supports:
 * - "Title | Type | URL" or "Title | URL" (pipe)
 * - "Title, Type, URL" or "Title, URL" (comma)
 * - Single URL per line (title from URL or "Untitled")
 */
export function parseBulkInput(input: string): ParseResult {
  const valid: ParsedRow[] = [];
  const invalid: { line: string; reason: string }[] = [];
  const lines = input
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  for (const line of lines) {
    const parts = line.split(/[|,]|[\t]/).map((p) => p.trim()).filter(Boolean);

    if (parts.length === 1) {
      const url = extractUrl(parts[0]);
      if (url) {
        valid.push({
          title: "Untitled",
          type: "Other",
          driveUrl: url,
        });
      } else {
        invalid.push({ line, reason: "Single value must be a Google Drive/Docs URL" });
      }
      continue;
    }

    if (parts.length === 2) {
      const [title, urlOrType] = parts;
      const url = extractUrl(urlOrType);
      if (url) {
        valid.push({
          title: title || "Untitled",
          type: "Other",
          driveUrl: url,
        });
      } else if (extractUrl(title)) {
        invalid.push({ line, reason: "Second value should be the Drive URL" });
      } else {
        invalid.push({ line, reason: "Could not find a valid Drive URL" });
      }
      continue;
    }

    if (parts.length >= 3) {
      const title = parts[0] || "Untitled";
      const a = parts[1];
      const b = parts[2];
      const urlA = extractUrl(a);
      const urlB = extractUrl(b);
      const driveUrl = urlA ?? urlB ?? (parts.length > 3 ? extractUrl(parts[2]) : null);
      const typeStr = isValidType(a) ? a : isValidType(b) ? b : null;

      if (!driveUrl) {
        invalid.push({ line, reason: "Could not find a valid Drive URL" });
        continue;
      }

      valid.push({
        title,
        type: typeStr ?? "Other",
        driveUrl,
      });
      continue;
    }

    invalid.push({ line, reason: "Could not parse line" });
  }

  return { valid, invalid };
}
