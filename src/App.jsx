import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home";
import Search from "./components/Search";
import RandomHadith from "./components/RandomHadith";
import "./index.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Router>
      <div className="App">
        <header>
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
          </ul>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/random" element={<RandomHadith />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
