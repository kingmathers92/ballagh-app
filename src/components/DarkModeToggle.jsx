import PropTypes from "prop-types";

const DarkModeToggle = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="dark-mode-toggle"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <span role="img" aria-label="dark mode">
          🌙
        </span>
      ) : (
        <span role="img" aria-label="light mode">
          ☀️
        </span>
      )}
    </button>
  );
};

DarkModeToggle.propTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default DarkModeToggle;
