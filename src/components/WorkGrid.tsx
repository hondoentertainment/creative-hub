import type { CreativeWork, WorkType } from "../types";
import { WorkCard } from "./WorkCard";
import { WORK_TYPES } from "../types";

interface WorkGridProps {
  works: CreativeWork[];
  filter: WorkType | "All";
  onFilterChange: (filter: WorkType | "All") => void;
  onEdit: (work: CreativeWork) => void;
  onDelete: (work: CreativeWork) => void;
}

export function WorkGrid({
  works,
  filter,
  onFilterChange,
  onEdit,
  onDelete,
}: WorkGridProps) {
  const filtered =
    filter === "All" ? works : works.filter((w) => w.type === filter);

  return (
    <section className="work-section" aria-label="Creative works">
      <div className="filter-bar">
        <span className="filter-label">Filter by type:</span>
        <div className="filter-btns" role="group" aria-label="Work type filter">
          {(["All", ...WORK_TYPES] as const).map((t) => (
            <button
              key={t}
              type="button"
              className={`filter-btn ${filter === t ? "filter-btn-active" : ""}`}
              onClick={() => onFilterChange(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>
            {works.length === 0
              ? "No creative works yet. Click “Add Work” to add your first."
              : `No works in “${filter}”. Try another filter.`}
          </p>
        </div>
      ) : (
        <div className="work-grid">
          {filtered.map((work) => (
            <WorkCard
              key={work.id}
              work={work}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
