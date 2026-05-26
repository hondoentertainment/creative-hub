import type { CreativeWork, ViewMode, SortOption } from "../types";

interface WorkCardProps {
  work: CreativeWork;
  viewMode?: ViewMode;
  sort?: SortOption;
  allWorks?: CreativeWork[];
  collections?: { id: string; name: string; workIds: string[] }[];
  isPublicView?: boolean;
  onSelect: (work: CreativeWork) => void;
  onEdit: (work: CreativeWork) => void;
  onDelete: (work: CreativeWork) => void;
  onReorder?: (workIds: string[]) => void;
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

export function WorkCard({
  work,
  viewMode = "grid",
  sort = "newest",
  allWorks = [],
  collections = [],
  isPublicView = false,
  onSelect,
  onEdit,
  onDelete,
  onReorder,
}: WorkCardProps) {
  const handleOpenDrive = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(work.driveUrl, "_blank", "noopener,noreferrer");
  };

  const handleCardClick = () => onSelect(work);

  const canMoveUp = !isPublicView && sort === "custom" && onReorder && allWorks.length > 1;
  const idx = allWorks.findIndex((w) => w.id === work.id);
  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (idx > 0 && onReorder) {
      const ids = [...allWorks.map((w) => w.id)];
      [ids[idx - 1], ids[idx]] = [ids[idx], ids[idx - 1]];
      onReorder(ids);
    }
  };
  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (idx >= 0 && idx < allWorks.length - 1 && onReorder) {
      const ids = [...allWorks.map((w) => w.id)];
      [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]];
      onReorder(ids);
    }
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
    <article
      className={`work-card work-card-${viewMode}`}
      data-type={work.type}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`View ${work.title}`}
    >
      {work.thumbnailUrl ? (
        <div className="work-card-thumb" style={{ backgroundImage: `url(${work.thumbnailUrl})` }} />
      ) : (
        <div className="work-card-thumb work-card-thumb-placeholder">
          <span className="work-card-type-badge">{work.type}</span>
        </div>
      )}
      <div className="work-card-body">
        <h2 className="work-card-title">{work.title}</h2>
        <span className="work-card-meta">
          {formatRelativeDate(work.createdAt)} · {work.type}
          {work.featured && (
            <span className="work-card-featured-badge" aria-label="Featured">★</span>
          )}
        </span>
        {((work.tags?.length) ?? 0) > 0 && (
          <div className="work-card-tags">
            {(work.tags ?? []).map((t) => (
              <span key={t} className="work-card-tag">#{t}</span>
            ))}
          </div>
        )}
        {collections.filter((c) => c.workIds.includes(work.id)).length > 0 && (
          <div className="work-card-collections">
            {collections
              .filter((c) => c.workIds.includes(work.id))
              .map((c) => (
                <span key={c.id} className="work-card-collection-badge">{c.name}</span>
              ))}
          </div>
        )}
        {work.description && (
          <p className="work-card-desc">{work.description}</p>
        )}
        <div className="work-card-actions">
          {canMoveUp && (
            <div className="work-card-reorder">
              <button
                type="button"
                className="work-card-btn work-card-btn-ghost"
                onClick={handleMoveUp}
                disabled={idx <= 0}
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                className="work-card-btn work-card-btn-ghost"
                onClick={handleMoveDown}
                disabled={idx >= allWorks.length - 1}
                aria-label="Move down"
              >
                ↓
              </button>
            </div>
          )}
          <button
            type="button"
            className="work-card-btn work-card-btn-primary"
            onClick={handleOpenDrive}
            aria-label={`Open ${work.title}`}
          >
            Open
          </button>
          {!isPublicView && (
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
          )}
        </div>
      </div>
    </article>
  );
}
