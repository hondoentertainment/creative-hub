import { useState, useEffect } from "react";
import type { Collection } from "../types";
import { useFocusTrap } from "../hooks/useFocusTrap";

interface CollectionModalProps {
  collections: Collection[];
  onAdd: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function CollectionModal({
  collections,
  onAdd,
  onRename,
  onDelete,
  onClose,
}: CollectionModalProps) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (editingId) setEditingId(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [editingId, onClose]);

  const contentRef = useFocusTrap<HTMLDivElement>(true);

  const handleAdd = () => {
    if (newName.trim()) {
      onAdd(newName.trim());
      setNewName("");
    }
  };

  const handleStartEdit = (c: Collection) => {
    setEditingId(c.id);
    setEditName(c.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      onRename(editingId, editName.trim());
      setEditingId(null);
    }
  };

  return (
    <div
      className="form-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div ref={contentRef} className="work-form" onClick={(e) => e.stopPropagation()}>
        <h2 id="collection-modal-title" className="form-title">
          Collections
        </h2>
        <p className="form-hint">Group works into collections and filter by them.</p>
        <div className="form-field">
          <label htmlFor="collection-new">New collection</label>
          <div className="form-row">
            <input
              id="collection-new"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
              placeholder="Collection name"
            />
            <button type="button" className="form-btn form-btn-submit" onClick={handleAdd}>
              Add
            </button>
          </div>
        </div>
        <ul className="collection-list">
          {collections.map((c) => (
            <li key={c.id} className="collection-item">
              {editingId === c.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                    autoFocus
                  />
                  <button type="button" className="form-btn form-btn-submit" onClick={handleSaveEdit}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span className="collection-name">{c.name}</span>
                  <span className="collection-count">({c.workIds.length})</span>
                  <div className="collection-actions">
                    <button
                      type="button"
                      className="form-btn form-btn-ghost"
                      onClick={() => handleStartEdit(c)}
                      aria-label={`Rename ${c.name}`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="form-btn form-btn-ghost work-card-btn-danger"
                      onClick={() => onDelete(c.id)}
                      aria-label={`Delete ${c.name}`}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        <div className="form-actions">
          <button type="button" className="form-btn form-btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
