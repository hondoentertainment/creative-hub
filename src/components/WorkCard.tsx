import type { CreativeWork, ViewMode } from "../types";

interface WorkCardProps {
  work: CreativeWork;
  viewMode?: ViewMode;
  onEdit: (work: CreativeWork) => void;
  onDelete: (work: CreativeWork) => void;
}

function formatRelativeDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

export function WorkCard({ work, viewMode = "grid", onEdit, onDelete }: WorkCardProps) {
  const handleOpenDrive = () => {
    window.open(work.driveUrl, "_blank", "noopener,noreferrer");
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(work);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(work);
  };

  return (
    <article className={`work-card work-card-${viewMode}`} data-type={work.type}>
      {work.thumbnailUrl ? (
        <div className="work-card-thumb" style={{ backgroundImage: `url(${work.thumbnailUrl})` }} />
      ) : (
        <div className="work-card-thumb work-card-thumb-placeholder">
          <span className="work-card-type-badge">{work.type}</span>
        </div>
      )}
      <div className="work-card-body">
        <h2 className="work-card-title">{work.title}</h2>
        <span className="work-card-meta">{formatRelativeDate(work.createdAt)} · {work.type}</span>
        {work.description && (
          <p className="work-card-desc">{work.description}</p>
        )}
        <div className="work-card-actions">
          <button
            type="button"
            className="work-card-btn work-card-btn-primary"
            onClick={handleOpenDrive}
            aria-label={`Open ${work.title} in Google Drive`}
          >
            Open in Drive
          </button>
          <div className="work-card-btn-group">
            <button
              type="button"
              className="work-card-btn work-card-btn-ghost"
              onClick={handleEdit}
              aria-label={`Edit ${work.title}`}
            >
              Edit
            </button>
            <button
              type="button"
              className="work-card-btn work-card-btn-ghost work-card-btn-danger"
              onClick={handleDelete}
              aria-label={`Delete ${work.title}`}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
