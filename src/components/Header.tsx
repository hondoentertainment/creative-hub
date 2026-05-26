import { useEffect, useState } from "react";
import {
  isFirebaseConfigured,
  getSyncStatus,
  subscribeSyncStatus,
  type SyncStatus,
} from "../lib/firebaseSync";

interface HeaderProps {
  worksCount?: number;
  isPublicView?: boolean;
  onCollectionsClick?: () => void;
  onAddClick: () => void;
  onBulkAddClick: () => void;
  onExportClick: () => void;
  onImportClick: () => void;
  onLoadSeedClick?: () => void;
}

export function Header({
  worksCount = 0,
  isPublicView = false,
  onCollectionsClick,
  onAddClick,
  onBulkAddClick,
  onExportClick,
  onImportClick,
  onLoadSeedClick,
}: HeaderProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(getSyncStatus());

  useEffect(() => {
    return subscribeSyncStatus(setSyncStatus);
  }, []);

  const handleCopyShareLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("public", "1");
    navigator.clipboard.writeText(url.toString());
  };

  return (
    <header className="header">
      <h1 className="header-title">Creative Hub</h1>
      <p className="header-subtitle">
        {isPublicView ? "Creative works portfolio" : "Your creative works, linked to Google Drive"}
        {worksCount > 0 && (
          <span className="header-count">
            · {worksCount} work{worksCount !== 1 ? "s" : ""}
          </span>
        )}
        {!isPublicView && isFirebaseConfigured() && (
          <span className="header-sync-status" aria-live="polite">
            {" · "}
            {syncStatus === "syncing" && "Syncing…"}
            {syncStatus === "synced" && "Synced"}
            {syncStatus === "offline" && "Offline"}
            {syncStatus === "error" && "Sync error"}
          </span>
        )}
      </p>
      {!isPublicView && (
      <div className="header-actions">
        {onCollectionsClick && (
          <button
            type="button"
            className="header-btn header-btn-ghost"
            onClick={onCollectionsClick}
            aria-label="Manage collections"
          >
            Collections
          </button>
        )}
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
        <button
          type="button"
          className="header-btn header-btn-ghost"
          onClick={handleCopyShareLink}
          aria-label="Copy share link"
        >
          Share
        </button>
      </div>
      )}
      {isPublicView && (
        <p className="header-public-hint">Viewing in share mode — edit hidden</p>
      )}
    </header>
  );
}
