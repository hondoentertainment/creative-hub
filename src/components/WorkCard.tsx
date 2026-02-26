import type { CreativeWork } from "../types";

interface WorkCardProps {
  work: CreativeWork;
  onEdit: (work: CreativeWork) => void;
  onDelete: (work: CreativeWork) => void;
}

export function WorkCard({ work, onEdit, onDelete }: WorkCardProps) {
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
    <article className="work-card" data-type={work.type}>
      {work.thumbnailUrl ? (
        <div className="work-card-thumb" style={{ backgroundImage: `url(${work.thumbnailUrl})` }} />
      ) : (
        <div className="work-card-thumb work-card-thumb-placeholder">
          <span className="work-card-type-badge">{work.type}</span>
        </div>
      )}
      <div className="work-card-body">
        <h2 className="work-card-title">{work.title}</h2>
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
