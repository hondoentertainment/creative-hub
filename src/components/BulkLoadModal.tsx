import { useState, useEffect } from "react";
import type { WorkType } from "../types";
import { parseBulkInput } from "../utils/bulkParse";
import { useFocusTrap } from "../hooks/useFocusTrap";

interface BulkLoadModalProps {
  onImport: (items: { title: string; type: WorkType; driveUrl: string; description?: string }[]) => void;
  onCancel: () => void;
}

const FORMAT_HINT = `One entry per line. Formats:
• Title | Drive URL
• Title | Type | Drive URL
• Or paste a list of Drive URLs (one per line)`;

export function BulkLoadModal({ onImport, onCancel }: BulkLoadModalProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ReturnType<typeof parseBulkInput> | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setResult(null);
      return;
    }
    setResult(parseBulkInput(input));
  }, [input]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onCancel();
  };

  const handleSubmit = () => {
    if (result && result.valid.length > 0) {
      onImport(result.valid);
    }
  };

  const validCount = result?.valid.length ?? 0;
  const invalidCount = result?.invalid.length ?? 0;

  const contentRef = useFocusTrap<HTMLDivElement>(true);

  return (
    <div
      className="form-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-load-title"
      onClick={handleBackdropClick}
    >
      <div
        ref={contentRef}
        className="work-form bulk-load-form"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="bulk-load-title" className="form-title">
          Bulk Add Works
        </h2>
        <p className="bulk-load-hint">{FORMAT_HINT}</p>

        <div className="form-field">
          <label htmlFor="bulk-input">Paste your list</label>
          <textarea
            id="bulk-input"
            className="bulk-load-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="My Short Story | Writing | https://drive.google.com/..."
            rows={8}
          />
        </div>

        {result && (
          <div className="bulk-load-summary">
            {validCount > 0 && (
              <span className="bulk-summary-valid">{validCount} ready to import</span>
            )}
            {invalidCount > 0 && (
              <span className="bulk-summary-invalid">{invalidCount} skipped</span>
            )}
          </div>
        )}

        {result && result.invalid.length > 0 && (
          <details className="bulk-load-errors">
            <summary>Skipped lines</summary>
            <ul>
              {result.invalid.map(({ line, reason }, i) => (
                <li key={i}>
                  <code>{line.slice(0, 50)}{line.length > 50 ? "…" : ""}</code> — {reason}
                </li>
              ))}
            </ul>
          </details>
        )}

        <div className="form-actions">
          <button type="button" className="form-btn form-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="form-btn form-btn-submit"
            onClick={handleSubmit}
            disabled={validCount === 0}
          >
            Import {validCount} work{validCount !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
