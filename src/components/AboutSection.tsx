import { useState } from "react";
import type { AboutData } from "../store/aboutStore";
import { getAbout, saveAbout } from "../store/aboutStore";
import { useFocusTrap } from "../hooks/useFocusTrap";

interface AboutSectionProps {
  isPublicView: boolean;
}

export function AboutSection({ isPublicView }: AboutSectionProps) {
  const [about, setAbout] = useState<AboutData>(() => getAbout());
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<AboutData>({});

  const startEditing = () => {
    setDraft({ ...about });
    setIsEditing(true);
  };

  const handleSave = () => {
    saveAbout(draft);
    setAbout(draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft({ ...about });
    setIsEditing(false);
  };

  const contentRef = useFocusTrap<HTMLDivElement>(isEditing);

  const hasContent = about.name || about.bio || about.photoUrl || (about.links?.length ?? 0) > 0;

  if (!hasContent && !isEditing) {
    if (isPublicView) return null;
    return (
      <section className="about-section about-section-empty">
        <button
          type="button"
          className="about-add-btn"
          onClick={startEditing}
          aria-label="Add profile"
        >
          + Add your profile
        </button>
      </section>
    );
  }

  return (
    <section className="about-section" aria-label="About">
      {isEditing ? (
        <div
          ref={contentRef}
          className="about-edit"
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-edit-title"
        >
          <h2 id="about-edit-title" className="about-edit-title">
            Edit profile
          </h2>
          <div className="form-field">
            <label htmlFor="about-name">Name</label>
            <input
              id="about-name"
              type="text"
              value={draft.name ?? ""}
              onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
            />
          </div>
          <div className="form-field">
            <label htmlFor="about-bio">Bio</label>
            <textarea
              id="about-bio"
              value={draft.bio ?? ""}
              onChange={(e) => setDraft((p) => ({ ...p, bio: e.target.value }))}
              placeholder="A brief intro..."
              rows={3}
            />
          </div>
          <div className="form-field">
            <label htmlFor="about-photo">Photo URL</label>
            <input
              id="about-photo"
              type="url"
              value={draft.photoUrl ?? ""}
              onChange={(e) => setDraft((p) => ({ ...p, photoUrl: e.target.value }))}
              placeholder="https://..."
            />
          </div>
          <div className="form-field">
            <label htmlFor="about-email">Email</label>
            <input
              id="about-email"
              type="email"
              value={draft.email ?? ""}
              onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
            />
          </div>
          <div className="form-field">
            <label>Links</label>
            {(draft.links ?? []).map((link, i) => (
              <div key={i} className="form-link-row">
                <input
                  type="text"
                  placeholder="Label"
                  value={link.label}
                  onChange={(e) => {
                    const next = [...(draft.links ?? [])];
                    next[i] = { ...next[i], label: e.target.value };
                    setDraft((p) => ({ ...p, links: next }));
                  }}
                  className="form-link-label"
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => {
                    const next = [...(draft.links ?? [])];
                    next[i] = { ...next[i], url: e.target.value };
                    setDraft((p) => ({ ...p, links: next }));
                  }}
                  className="form-link-url"
                />
                <button
                  type="button"
                  className="form-link-remove"
                  onClick={() => {
                    const next = (draft.links ?? []).filter((_, j) => j !== i);
                    setDraft((p) => ({ ...p, links: next }));
                  }}
                  aria-label="Remove link"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="form-btn form-btn-ghost form-btn-add-link"
              onClick={() => setDraft((p) => ({ ...p, links: [...(p.links ?? []), { label: "", url: "" }] }))}
            >
              + Add link
            </button>
          </div>
          <div className="form-actions">
            <button type="button" className="form-btn form-btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" className="form-btn form-btn-submit" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="about-display">
          {about.photoUrl && (
            <img
              src={about.photoUrl}
              alt=""
              className="about-photo"
              width={80}
              height={80}
            />
          )}
          <div className="about-text">
            {about.name && <h2 className="about-name">{about.name}</h2>}
            {about.bio && <p className="about-bio">{about.bio}</p>}
            {about.email && (
              <a href={`mailto:${about.email}`} className="about-email">
                {about.email}
              </a>
            )}
            {about.links && about.links.length > 0 && (
              <div className="about-links">
                {about.links.map((l, i) => (
                  <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="about-link">
                    {l.label || l.url}
                  </a>
                ))}
              </div>
            )}
          </div>
          {!isPublicView && (
            <button
              type="button"
              className="about-edit-btn"
              onClick={startEditing}
              aria-label="Edit profile"
            >
              Edit profile
            </button>
          )}
        </div>
      )}
    </section>
  );
}
