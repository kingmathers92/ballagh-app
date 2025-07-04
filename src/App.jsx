import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DarkModeToggle from "./components/DarkModeToggle";
import NavLinks from "./components/NavLinks";
import ErrorBoundary from "./components/ErrorBoundary";
import PrayerTimes from "./components/PrayerTimes";
import Home from "./pages/Home";
import Search from "./pages/Search";
import RandomHadith from "./pages/RandomHadith";
import Quran from "./pages/Quran";
import Qibla from "./pages/Qibla";
import Journal from "./pages/Journal";

const useTheme = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return { theme, toggleTheme };
};

const routes = [
  { path: "/", element: <Home /> },
  { path: "/search", element: <Search /> },
  { path: "/random", element: <RandomHadith /> },
  { path: "/quran", element: <Quran /> },
  { path: "/qibla", element: <Qibla /> },
  { path: "/journal", element: <Journal /> },
  { path: "/prayer-times", element: <PrayerTimes /> },
];

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Router>
      <div className="App">
        <header>
          <DarkModeToggle theme={theme} toggleテーマ={toggleTheme} />
          <h1 className="app-title">بلَّغ</h1>
          <nav>
            <NavLinks />
          </nav>
        </header>

        <main>
          <ErrorBoundary>
            <Routes>
              {routes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </Router>
  );
}

export default App;
