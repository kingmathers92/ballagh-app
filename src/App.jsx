import { useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import DarkModeToggle from "./components/DarkModeToggle";
import NavLinks from "./components/NavLinks";
import ErrorBoundary from "./components/ErrorBoundary";
import Spinner from "./components/Spinner";

const PrayerTimes = lazy(() => import("./pages/PrayerTimes"));
const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const RandomHadith = lazy(() => import("./pages/RandomHadith"));
const Quran = lazy(() => import("./pages/Quran"));
const Qibla = lazy(() => import("./pages/Qibla"));
const Journal = lazy(() => import("./pages/Journal"));

const useTheme = () => {
  const [theme, setTheme] = useState(
    () =>
      document.documentElement.getAttribute("data-theme") ||
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"),
  );

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
          <DarkModeToggle theme={theme} toggleTheme={toggleTheme} />
          <h1 className="app-title">بلَّغ</h1>
          <Link
            to="/search"
            className="header-search-button"
            aria-label="Search"
          >
            <svg viewBox="0 0 20 20" fill="none">
              <circle
                cx="8.5"
                cy="8.5"
                r="5.5"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M13 13 17 17"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </Link>
          <nav>
            <NavLinks />
          </nav>
        </header>

        <main>
          <ErrorBoundary>
            <Suspense fallback={<Spinner />}>
              <Routes>
                {routes.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </Router>
  );
}

export default App;
