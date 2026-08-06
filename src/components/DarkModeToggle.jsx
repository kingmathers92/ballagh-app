import PropTypes from "prop-types";

const DarkModeToggle = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="dark-mode-toggle"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <svg viewBox="0 0 20 20" fill="none" width="20" height="20">
          <path
            d="M12.5 3.5a7 7 0 1 0 0 13 8.2 8.2 0 0 1 0-13Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="none" width="20" height="20">
          <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M10 2v2M10 16v2M18 10h-2M4 10H2M15.5 4.5l-1.4 1.4M5.9 14.1l-1.4 1.4M15.5 15.5l-1.4-1.4M5.9 5.9 4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
};

DarkModeToggle.propTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default DarkModeToggle;
