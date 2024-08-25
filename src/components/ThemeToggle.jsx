import { useState, useEffect } from "react";

const DarkModeToggle = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button onClick={toggleTheme} className="dark-mode-toggle">
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

export default DarkModeToggle;
