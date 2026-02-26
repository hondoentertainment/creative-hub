import { useState, useEffect } from "react";
import type { CreativeWork, WorkType } from "../types";
import { WORK_TYPES } from "../types";

interface WorkFormProps {
  work?: CreativeWork | null;
  onSubmit: (data: Omit<CreativeWork, "id" | "createdAt">) => void;
  onCancel: () => void;
}

export function WorkForm({ work, onSubmit, onCancel }: WorkFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<WorkType>("Other");
  const [driveUrl, setDriveUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!work;

  useEffect(() => {
    if (work) {
      setTitle(work.title);
      setDescription(work.description ?? "");
      setType(work.type);
      setDriveUrl(work.driveUrl);
      setThumbnailUrl(work.thumbnailUrl ?? "");
    }
  }, [work]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Title is required";
    if (!driveUrl.trim()) next.driveUrl = "Google Drive URL is required";
    else if (
      !driveUrl.includes("drive.google.com") &&
      !driveUrl.includes("docs.google.com")
    ) {
      next.driveUrl = "Please enter a valid Google Drive or Docs URL";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      driveUrl: driveUrl.trim(),
      thumbnailUrl: thumbnailUrl.trim() || undefined,
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div
      className="form-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-title"
      onClick={handleBackdropClick}
    >
      <form className="work-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <h2 id="form-title" className="form-title">
          {isEditing ? "Edit Work" : "Add Work"}
        </h2>

        <div className="form-field">
          <label htmlFor="work-title">Title *</label>
          <input
            id="work-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Short story: The Lighthouse"
            autoFocus
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <span id="title-error" className="form-error" role="alert">
              {errors.title}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="work-type">Type</label>
          <select
            id="work-type"
            value={type}
            onChange={(e) => setType(e.target.value as WorkType)}
          >
            {WORK_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="work-drive-url">Google Drive URL *</label>
          <input
            id="work-drive-url"
            type="url"
            value={driveUrl}
            onChange={(e) => setDriveUrl(e.target.value)}
            placeholder="https://drive.google.com/file/d/..."
            aria-invalid={!!errors.driveUrl}
            aria-describedby={errors.driveUrl ? "drive-error" : undefined}
          />
          {errors.driveUrl && (
            <span id="drive-error" className="form-error" role="alert">
              {errors.driveUrl}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="work-desc">Description</label>
          <textarea
            id="work-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the work..."
            rows={3}
          />
        </div>

        <div className="form-field">
          <label htmlFor="work-thumb">Thumbnail URL</label>
          <input
            id="work-thumb"
            type="url"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="form-btn form-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="form-btn form-btn-submit">
            {isEditing ? "Save Changes" : "Add Work"}
          </button>
        </div>
      </form>
    </div>
  );
}
