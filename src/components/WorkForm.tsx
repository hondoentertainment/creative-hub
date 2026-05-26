import { useState, useEffect } from "react";
import type { CreativeWork, WorkType, WorkLink } from "../types";
import { WORK_TYPES } from "../types";
import { useFocusTrap } from "../hooks/useFocusTrap";

interface WorkFormProps {
  work?: CreativeWork | null;
  collections?: { id: string; name: string; workIds: string[] }[];
  onSubmit: (data: Omit<CreativeWork, "id" | "createdAt">) => void;
  onCancel: () => void;
  onCollectionChange?: (workId: string | null, collectionId: string, add: boolean) => void;
}

function isValidUrl(s: string): boolean {
  try {
    new URL(s.trim());
    return true;
  } catch {
    return false;
  }
}

export function WorkForm({
  work,
  collections = [],
  onSubmit,
  onCancel,
  onCollectionChange,
}: WorkFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<WorkType>("Other");
  const [driveUrl, setDriveUrl] = useState("");
  const [links, setLinks] = useState<WorkLink[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [collectionIds, setCollectionIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!work;

  useEffect(() => {
    if (work) {
      setTitle(work.title);
      setDescription(work.description ?? "");
      setType(work.type);
      setDriveUrl(work.driveUrl);
      setLinks(work.links ?? []);
      setThumbnailUrl(work.thumbnailUrl ?? "");
      setFeatured(work.featured ?? false);
      setTags(work.tags ?? []);
      setCollectionIds(
        collections.filter((c) => c.workIds.includes(work.id)).map((c) => c.id)
      );
    }
  }, [work, collections]);

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
    if (thumbnailUrl.trim() && !isValidUrl(thumbnailUrl)) {
      next.thumbnailUrl = "Please enter a valid URL";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const validLinks = links
      .map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
      .filter((l) => l.label && l.url);
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      driveUrl: driveUrl.trim(),
      links: validLinks.length > 0 ? validLinks : undefined,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      featured,
      tags: tags.length > 0 ? tags : undefined,
    });
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  };
  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t));
  const toggleCollection = (colId: string) => {
    const inCol = collectionIds.includes(colId);
    if (work && onCollectionChange) onCollectionChange(work.id, colId, !inCol);
    setCollectionIds((prev) =>
      inCol ? prev.filter((id) => id !== colId) : [...prev, colId]
    );
  };

  const addLink = () => setLinks((prev) => [...prev, { label: "", url: "" }]);
  const updateLink = (i: number, field: "label" | "url", value: string) => {
    setLinks((prev) => prev.map((l, j) => (j === i ? { ...l, [field]: value } : l)));
  };
  const removeLink = (i: number) => setLinks((prev) => prev.filter((_, j) => j !== i));

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onCancel();
  };

  const formRef = useFocusTrap<HTMLFormElement>(true);

  return (
    <div
      className="form-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-title"
      onClick={handleBackdropClick}
    >
      <form ref={formRef} className="work-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
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

        <div className="form-field form-field-checkbox">
          <label>
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured
          </label>
        </div>

        <div className="form-field">
          <label>Tags</label>
          <div className="form-tags-wrap">
            {tags.map((t) => (
              <span key={t} className="form-tag">
                {t}
                <button type="button" onClick={() => removeTag(t)} aria-label={`Remove ${t}`}>
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              className="form-tag-input"
            />
            <button type="button" className="form-btn form-btn-ghost" onClick={addTag}>
              Add
            </button>
          </div>
        </div>

        {collections.length > 0 && work && (
          <div className="form-field">
            <label>Collections</label>
            <div className="form-collections-wrap">
              {collections.map((c) => (
                <label key={c.id} className="form-collection-item">
                  <input
                    type="checkbox"
                    checked={collectionIds.includes(c.id)}
                    onChange={() => toggleCollection(c.id)}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>
        )}

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
          <label>Additional links</label>
          {links.map((link, i) => (
            <div key={i} className="form-link-row">
              <input
                type="text"
                placeholder="Label (e.g. Live site)"
                value={link.label}
                onChange={(e) => updateLink(i, "label", e.target.value)}
                className="form-link-label"
              />
              <input
                type="url"
                placeholder="URL"
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                className="form-link-url"
              />
              <button
                type="button"
                className="form-link-remove"
                onClick={() => removeLink(i)}
                aria-label="Remove link"
              >
                ×
              </button>
            </div>
          ))}
          <button type="button" className="form-btn form-btn-ghost form-btn-add-link" onClick={addLink}>
            + Add link
          </button>
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
            onBlur={() => {
            if (!thumbnailUrl.trim()) {
              setErrors((prev) => {
                const { thumbnailUrl: _, ...rest } = prev;
                return rest;
              });
            } else {
              setErrors((prev) => ({
                ...prev,
                thumbnailUrl: isValidUrl(thumbnailUrl) ? "" : "Please enter a valid URL",
              }));
            }
          }}
            placeholder="https://..."
            aria-invalid={!!errors.thumbnailUrl}
            aria-describedby={errors.thumbnailUrl ? "thumb-error" : undefined}
          />
          {errors.thumbnailUrl && (
            <span id="thumb-error" className="form-error" role="alert">
              {errors.thumbnailUrl}
            </span>
          )}
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
