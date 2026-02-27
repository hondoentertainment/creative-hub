import { useEffect } from "react";
import type { CreativeWork } from "../types";
import { useFocusTrap } from "../hooks/useFocusTrap";

interface ImportModalProps {
  works: CreativeWork[];
  onMerge: (works: CreativeWork[]) => void;
  onReplace: (works: CreativeWork[]) => void;
  onCancel: () => void;
}

export function ImportModal({
  works,
  onMerge,
  onReplace,
  onCancel,
}: ImportModalProps) {
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

  const contentRef = useFocusTrap<HTMLDivElement>(true);

  const handleMerge = () => {
    const withNewIds = works.map((w) => ({
      ...w,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }));
    onMerge(withNewIds);
  };

  return (
    <div
      className="form-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
      onClick={handleBackdropClick}
    >
      <div
        ref={contentRef}
        className="work-form"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="import-modal-title" className="form-title">
          Import Backup
        </h2>
        <p className="import-summary">
          Found {works.length} work{works.length !== 1 ? "s" : ""} in file.
        </p>
        <div className="form-actions form-actions-stack">
          <button
            type="button"
            className="form-btn form-btn-submit"
            onClick={() => onReplace(works)}
          >
            Replace all
          </button>
          <button
            type="button"
            className="form-btn form-btn-secondary"
            onClick={handleMerge}
          >
            Merge (add to existing)
          </button>
          <button type="button" className="form-btn form-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
