import { useMemo } from "react";
import type { CreativeWork, WorkType, SortOption, ViewMode } from "../types";
import { useDebounce } from "../hooks/useDebounce";
import { WorkCard } from "./WorkCard";
import { WORK_TYPES } from "../types";

interface WorkGridProps {
  works: CreativeWork[];
  filter: WorkType | "All";
  onFilterChange: (filter: WorkType | "All") => void;
  search: string;
  onSearchChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (value: ViewMode) => void;
  onEdit: (work: CreativeWork) => void;
  onDelete: (work: CreativeWork) => void;
}

function sortWorks(works: CreativeWork[], sort: SortOption): CreativeWork[] {
  const copy = [...works];
  switch (sort) {
    case "newest":
      return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case "oldest":
      return copy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case "title-az":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "title-za":
      return copy.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return copy;
  }
}

export function WorkGrid({
  works,
  filter,
  onFilterChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onEdit,
  onDelete,
}: WorkGridProps) {
  const debouncedSearch = useDebounce(search, 200);

  const filteredSorted = useMemo(() => {
    let list = filter === "All" ? works : works.filter((w) => w.type === filter);
    const q = debouncedSearch.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          (w.description?.toLowerCase().includes(q) ?? false) ||
          w.type.toLowerCase().includes(q)
      );
    }
    return sortWorks(list, sort);
  }, [works, filter, debouncedSearch, sort]);

  const counts = useMemo(() => {
    const byType: Record<string, number> = {};
    WORK_TYPES.forEach((t) => { byType[t] = works.filter((w) => w.type === t).length; });
    const all = works.length;
    return { all, byType };
  }, [works]);

  return (
    <section className="work-section" aria-label="Creative works">
      <div className="visually-hidden" aria-live="polite" aria-atomic="true">
        {filteredSorted.length} {filteredSorted.length === 1 ? "work" : "works"} displayed
      </div>
      <div className="work-toolbar">
        <div className="search-sort-row">
          <div className="search-wrap">
            <label htmlFor="work-search" className="visually-hidden">
              Search works
            </label>
            <div className="search-input-wrap">
              <input
                id="work-search"
                type="search"
                className={`search-input ${search.trim() ? "search-input-has-clear" : ""}`}
                placeholder="Search by title, description, or type…"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label="Search works"
              />
              {search.trim() && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => onSearchChange("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="sort-view-row">
            <div className="sort-wrap">
              <label htmlFor="work-sort" className="filter-label">Sort</label>
              <select
                id="work-sort"
                className="sort-select"
                value={sort}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="title-az">Title A–Z</option>
                <option value="title-za">Title Z–A</option>
              </select>
            </div>
            <div className="view-toggle" role="group" aria-label="View mode">
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === "grid" ? "view-toggle-active" : ""}`}
                onClick={() => onViewModeChange("grid")}
                aria-pressed={viewMode === "grid"}
                aria-label="Grid view"
              >
                Grid
              </button>
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === "list" ? "view-toggle-active" : ""}`}
                onClick={() => onViewModeChange("list")}
                aria-pressed={viewMode === "list"}
                aria-label="List view"
              >
                List
              </button>
            </div>
          </div>
        </div>

        <div className="filter-bar">
          <span className="filter-label">Filter by type:</span>
          <div className="filter-btns" role="group" aria-label="Work type filter">
            {(["All", ...WORK_TYPES] as const).map((t) => {
              const count = t === "All" ? counts.all : counts.byType[t] ?? 0;
              return (
                <button
                  key={t}
                  type="button"
                  className={`filter-btn ${filter === t ? "filter-btn-active" : ""}`}
                  onClick={() => onFilterChange(t)}
                >
                  {t}
                  <span className="filter-badge">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {search.trim() && filteredSorted.length === 0 && (
        <div className="search-no-results" role="status">
          <p className="search-no-results-message">
            No works match &ldquo;{search.trim()}&rdquo;.
          </p>
          <p className="search-no-results-hint">
            Try different keywords or clear the search.
          </p>
          <button
            type="button"
            className="search-clear-results-btn"
            onClick={() => onSearchChange("")}
          >
            Clear search
          </button>
        </div>
      )}

      {filteredSorted.length === 0 && !search.trim() ? (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true" />
          <p className="empty-state-title">
            {works.length === 0 ? "No creative works yet" : `No works in "${filter}"`}
          </p>
          <p className="empty-state-desc">
            {works.length === 0
              ? "Add your first work to get started—link it to Google Drive, Docs, or Sheets."
              : "Try another filter or clear the filter to see all works."}
          </p>
          {works.length === 0 && (
            <p className="empty-state-cta">
              Click &ldquo;Add Work&rdquo; above or use &ldquo;Bulk add&rdquo; to import many at once.
            </p>
          )}
        </div>
      ) : (
        <div className={`work-grid work-grid-${viewMode}`}>
          {filteredSorted.map((work) => (
            <WorkCard
              key={work.id}
              work={work}
              viewMode={viewMode}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
