interface HeaderProps {
  worksCount?: number;
  onAddClick: () => void;
  onBulkAddClick: () => void;
  onExportClick: () => void;
  onImportClick: () => void;
  onLoadSeedClick?: () => void;
}

export function Header({
  worksCount = 0,
  onAddClick,
  onBulkAddClick,
  onExportClick,
  onImportClick,
  onLoadSeedClick,
}: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header-title">Creative Hub</h1>
      <p className="header-subtitle">
        Your creative works, linked to Google Drive
        {worksCount > 0 && (
          <span className="header-count">
            · {worksCount} work{worksCount !== 1 ? "s" : ""}
          </span>
        )}
      </p>
      <div className="header-actions">
        <button
          type="button"
          className="header-add-btn"
          onClick={onAddClick}
          aria-label="Add new creative work"
        >
          + Add Work
        </button>
        <button
          type="button"
          className="header-btn header-btn-secondary"
          onClick={onBulkAddClick}
          aria-label="Bulk add works from list"
        >
          Bulk add
        </button>
        <button
          type="button"
          className="header-btn header-btn-ghost"
          onClick={onExportClick}
          aria-label="Export backup"
        >
          Export
        </button>
        <button
          type="button"
          className="header-btn header-btn-ghost"
          onClick={onImportClick}
          aria-label="Import backup"
        >
          Import
        </button>
        {onLoadSeedClick && (
          <button
            type="button"
            className="header-btn header-btn-ghost"
            onClick={onLoadSeedClick}
            aria-label="Load seed works"
          >
            Load seed
          </button>
        )}
      </div>
    </header>
  );
}
