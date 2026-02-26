interface HeaderProps {
  onAddClick: () => void;
}

export function Header({ onAddClick }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header-title">Creative Hub</h1>
      <p className="header-subtitle">Your creative works, linked to Google Drive</p>
      <button
        type="button"
        className="header-add-btn"
        onClick={onAddClick}
        aria-label="Add new creative work"
      >
        + Add Work
      </button>
    </header>
  );
}
