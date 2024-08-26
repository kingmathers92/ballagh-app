import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import RandomHadith from "./pages/RandomHadith";
import Quran from "./pages/Quran";
import Qibla from "./pages/Qibla";
import DarkModeToggle from "./components/ThemeToggle";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else if (systemPrefersDark) {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Router>
      <div className={`App ${theme === "dark" ? "dark-mode" : ""}`}>
        <header>
          <DarkModeToggle theme={theme} toggleTheme={toggleTheme} />
          <button className="menu-toggle" onClick={toggleMenu}>
            <span className="menu-icon"></span>
          </button>
          <h1 className="app-title">بلَّغ</h1>
        </header>
        <nav className={menuOpen ? "open" : ""}>
          <ul>
            <li>
              <Link to="/" onClick={toggleMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/search" onClick={toggleMenu}>
                Search Verses
              </Link>
            </li>
            <li>
              <Link to="/random" onClick={toggleMenu}>
                Random Verse
              </Link>
            </li>
            <li>
              <Link to="/quran" onClick={toggleMenu}>
                Quran
              </Link>
            </li>
            <li>
              <Link to="/qibla" onClick={toggleMenu}>
                Qibla
              </Link>
            </li>
          </ul>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/random" element={<RandomHadith />} />
            <Route path="/quran" element={<Quran />} />
            <Route path="/qibla" element={<Qibla />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
