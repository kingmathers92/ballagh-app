import { useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
