import { useEffect } from "react";

interface ToastProps {
  message: string;
  onUndo?: () => void;
  onDismiss: () => void;
  durationMs?: number;
}

export function Toast({
  message,
  onUndo,
  onDismiss,
  durationMs = 5000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [onDismiss, durationMs]);

  return (
    <div
      className="toast"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="toast-message">{message}</span>
      {onUndo && (
        <button
          type="button"
          className="toast-undo-btn"
          onClick={onUndo}
        >
          Undo
        </button>
      )}
    </div>
  );
}
