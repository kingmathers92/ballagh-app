import PropTypes from "prop-types";

const AVATAR_COLORS = [
  "var(--accent-color)",
  "var(--brass-color)",
  "var(--clay-color)",
  "var(--accent-bright)",
];

const ReciterPicker = ({ isOpen, onClose, reciters, selectedId, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="reciter-sheet-backdrop" onClick={onClose}>
      <div
        className="reciter-sheet cut-corner"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Choose a reciter"
      >
        <div className="reciter-sheet-handle" />
        <h3 className="reciter-sheet-title">Choose a reciter</h3>
        <div className="reciter-list">
          {reciters.map((reciter, index) => {
            const isSelected = reciter.id === selectedId;
            return (
              <button
                key={reciter.id}
                className={`reciter-card${isSelected ? " reciter-card-selected" : ""}`}
                onClick={() => onSelect(reciter.id)}
              >
                <span
                  className="reciter-avatar"
                  style={{
                    backgroundColor:
                      AVATAR_COLORS[index % AVATAR_COLORS.length],
                  }}
                >
                  <svg viewBox="0 0 22 22" aria-hidden="true">
                    <path d="M11 1 13.2 5 18 3.4 16.6 8.2 21 11 16.6 13.8 18 18.6 13.2 17 11 21 8.8 17 4 18.6 5.4 13.8 1 11 5.4 8.2 4 3.4 8.8 5Z" />
                  </svg>
                </span>
                <span className="reciter-card-names">
                  <span className="reciter-card-name-ar">{reciter.nameAr}</span>
                  <span className="reciter-card-name-en">{reciter.name}</span>
                </span>
                {isSelected && (
                  <svg
                    className="reciter-check"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.5 8.5 6.5 11.5 12.5 5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

ReciterPicker.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  reciters: PropTypes.array.isRequired,
  selectedId: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ReciterPicker;
