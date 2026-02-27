import { useRef, useState } from "react";
import type { CreativeWork, WorkType, SortOption, ViewMode } from "../types";
import { useWorks } from "../hooks/useWorks";
import { Header } from "../components/Header";
import { WorkGrid } from "../components/WorkGrid";
import { WorkForm } from "../components/WorkForm";
import { BulkLoadModal } from "../components/BulkLoadModal";
import { ImportModal } from "../components/ImportModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { Toast } from "../components/Toast";
import { exportToJson, parseImportFile } from "../utils/exportImport";

export function Home() {
  const { works, add, addMany, update, remove, restore, replaceAll } = useWorks();
  const [filter, setFilter] = useState<WorkType | "All">("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<CreativeWork | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [importWorks, setImportWorks] = useState<CreativeWork[] | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<CreativeWork | null>(null);
  const [deletedForToast, setDeletedForToast] = useState<CreativeWork | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddClick = () => {
    setEditingWork(null);
    setFormOpen(true);
  };

  const handleEdit = (work: CreativeWork) => {
    setEditingWork(work);
    setFormOpen(true);
  };

  const handleFormSubmit = (data: Omit<CreativeWork, "id" | "createdAt">) => {
    if (editingWork) {
      update(editingWork.id, data);
      setSuccessMessage("Work updated");
    } else {
      add(data);
      setSuccessMessage("Work added");
    }
    setFormOpen(false);
    setEditingWork(null);
  };

  const handleFormCancel = () => {
    setFormOpen(false);
    setEditingWork(null);
  };

  const handleDelete = (work: CreativeWork) => {
    setConfirmDelete(work);
  };

  const handleDeleteConfirm = () => {
    if (confirmDelete) {
      remove(confirmDelete.id);
      setDeletedForToast(confirmDelete);
      setConfirmDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  const handleUndo = () => {
    if (deletedForToast) {
      restore(deletedForToast);
      setDeletedForToast(null);
    }
  };

  const handleToastDismiss = () => {
    setDeletedForToast(null);
  };

  const handleBulkImport = (items: { title: string; type: WorkType; driveUrl: string; description?: string }[]) => {
    addMany(items);
    setBulkOpen(false);
  };

  const handleExport = () => {
    exportToJson(works);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const raw = typeof reader.result === "string" ? reader.result : "";
      const parsed = parseImportFile(raw);
      if (Array.isArray(parsed)) {
        setImportWorks(parsed);
      } else {
        alert(parsed.error);
      }
    };
    reader.readAsText(file);
  };

  const handleImportMerge = (newWorks: CreativeWork[]) => {
    addMany(newWorks.map(({ title, type, driveUrl, description, thumbnailUrl }) => ({
      title,
      type,
      driveUrl,
      description,
      thumbnailUrl,
    })));
    setImportWorks(null);
  };

  const handleImportReplace = (newWorks: CreativeWork[]) => {
    replaceAll(newWorks);
    setImportWorks(null);
  };

  const handleLoadSeed = async () => {
    try {
      const res = await fetch("/creative-works-seed.json");
      const raw = await res.text();
      const parsed = parseImportFile(raw);
      if (Array.isArray(parsed)) {
        handleImportMerge(parsed);
        setSuccessMessage(`Added ${parsed.length} seed works`);
      } else {
        alert(parsed.error);
      }
    } catch {
      alert("Could not load seed works");
    }
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="app" tabIndex={-1}>
      <Header
        worksCount={works.length}
        onAddClick={handleAddClick}
        onBulkAddClick={() => setBulkOpen(true)}
        onExportClick={handleExport}
        onImportClick={handleImportClick}
        onLoadSeedClick={handleLoadSeed}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden-file-input"
        aria-hidden="true"
      />

      <WorkGrid
        works={works}
        filter={filter}
        onFilterChange={setFilter}
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {formOpen && (
        <WorkForm
          work={editingWork}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {bulkOpen && (
        <BulkLoadModal
          onImport={handleBulkImport}
          onCancel={() => setBulkOpen(false)}
        />
      )}

      {importWorks && (
        <ImportModal
          works={importWorks}
          onMerge={handleImportMerge}
          onReplace={handleImportReplace}
          onCancel={() => setImportWorks(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete work?"
          message={`"${confirmDelete.title}" will be permanently removed. You can undo within 5 seconds.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          variant="danger"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      {deletedForToast && (
        <Toast
          message={`Deleted ${deletedForToast.title}. Undo?`}
          onUndo={handleUndo}
          onDismiss={handleToastDismiss}
          durationMs={5000}
        />
      )}

      {successMessage && (
        <Toast
          message={successMessage}
          onDismiss={() => setSuccessMessage(null)}
          durationMs={2000}
        />
      )}
    </main>
    </>
  );
}
