import { useState } from "react";
import type { CreativeWork, WorkType } from "../types";
import { useWorks } from "../hooks/useWorks";
import { Header } from "../components/Header";
import { WorkGrid } from "../components/WorkGrid";
import { WorkForm } from "../components/WorkForm";

export function Home() {
  const { works, add, update, remove } = useWorks();
  const [filter, setFilter] = useState<WorkType | "All">("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<CreativeWork | null>(null);

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
    } else {
      add(data);
    }
    setFormOpen(false);
    setEditingWork(null);
  };

  const handleFormCancel = () => {
    setFormOpen(false);
    setEditingWork(null);
  };

  const handleDelete = (work: CreativeWork) => {
    if (window.confirm(`Delete "${work.title}"?`)) {
      remove(work.id);
    }
  };

  return (
    <main className="app">
      <Header onAddClick={handleAddClick} />

      <WorkGrid
        works={works}
        filter={filter}
        onFilterChange={setFilter}
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
    </main>
  );
}
