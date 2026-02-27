import { useEffect } from "react";
import { useFocusTrap } from "../hooks/useFocusTrap";

export type ConfirmModalVariant = "danger" | "default";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  variant: ConfirmModalVariant;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const contentRef = useFocusTrap<HTMLDivElement>(true);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onCancel();
  };

  const confirmClass =
    variant === "danger"
      ? "form-btn form-btn-danger"
      : "form-btn form-btn-submit";
  const cancelClass = "form-btn form-btn-cancel";

  return (
    <div
      className="form-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
      onClick={handleBackdropClick}
    >
      <div
        ref={contentRef}
        className="work-form delete-confirm-form"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-modal-title" className="form-title">
          {title}
        </h2>
        <p id="confirm-modal-desc" className="delete-confirm-desc">
          {message}
        </p>
        <div className="form-actions">
          <button
            type="button"
            className={cancelClass}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={confirmClass}
            onClick={onConfirm}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
