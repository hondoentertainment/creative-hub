import { useEffect } from "react";
import type { CreativeWork } from "../types";
import { useFocusTrap } from "../hooks/useFocusTrap";

interface WorkDetailModalProps {
  work: CreativeWork;
  isPublicView?: boolean;
  onClose: () => void;
  onEdit: (work: CreativeWork) => void;
  onOpenUrl: (url: string) => void;
}

export function WorkDetailModal({
  work,
  isPublicView = false,
  onClose,
  onEdit,
  onOpenUrl,
}: WorkDetailModalProps) {
  useEffect(() => {
    const prevTitle = document.title;
    const prevDesc = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
    document.title = `${work.title} | Creative Hub`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute("content", work.description || `${work.title} — ${work.type} in Creative Hub`);
    }
    return () => {
      document.title = prevTitle;
      const d = document.querySelector('meta[name="description"]');
      if (d) d.setAttribute("content", prevDesc);
    };
  }, [work]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const allLinks = [
    { label: "Open in Drive", url: work.driveUrl },
    ...(work.links ?? []),
  ].filter((l) => l.url?.trim());

  const contentRef = useFocusTrap<HTMLDivElement>(true);

  return (
    <div
      className="form-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
      onClick={handleBackdropClick}
    >
      <div
        ref={contentRef}
        className="work-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="work-detail-header">
          <span className="work-detail-type-badge">{work.type}</span>
          <button
            type="button"
            className="work-detail-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {work.thumbnailUrl ? (
          <div
            className="work-detail-thumb"
            style={{ backgroundImage: `url(${work.thumbnailUrl})` }}
          />
        ) : (
          <div className="work-detail-thumb work-detail-thumb-placeholder">
            <span className="work-detail-type-badge-large">{work.type}</span>
          </div>
        )}
        <h2 id="detail-title" className="work-detail-title">
          {work.title}
        </h2>
        {work.description && (
          <p className="work-detail-desc">{work.description}</p>
        )}
        <div className="work-detail-actions">
          {allLinks.map((link, i) => (
            <button
              key={i}
              type="button"
              className={`work-detail-btn ${i === 0 ? "work-detail-btn-primary" : "work-detail-btn-secondary"}`}
              onClick={() => onOpenUrl(link.url)}
            >
              {link.label}
            </button>
          ))}
          {!isPublicView && (
            <button
              type="button"
              className="work-detail-btn work-detail-btn-ghost"
              onClick={() => {
                onClose();
                onEdit(work);
              }}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
