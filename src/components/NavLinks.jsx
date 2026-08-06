import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const icons = {
  home: (
    <svg viewBox="0 0 20 20" fill="none">
      <path d="M3 9 10 3l7 6v8H3z" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  quran: (
    <svg viewBox="0 0 20 20" fill="none">
      <path
        d="M3 3h6v14H3zM11 3h6v14h-6z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  ),
  hadith: (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 5.5v5l3.2 1.8" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  qibla: (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M10 10 13.8 6.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
  prayer: (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 6v4l2.6 1.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
};

const links = [
  { path: "/", label: "Home", icon: icons.home },
  {
    path: "/quran",
    label: "Quran",
    icon: icons.quran,
    longPress: { state: { randomPage: true }, hint: "Random page" },
  },
  {
    path: "/random",
    label: "Hadith",
    icon: icons.hadith,
    longPress: { state: { freshFetch: true }, hint: "New hadith" },
  },
  { path: "/qibla", label: "Qibla", icon: icons.qibla },
  { path: "/prayer-times", label: "Prayer", icon: icons.prayer },
];

const LONG_PRESS_MS = 500;

const NavLinks = ({ toggleMenu = () => {} }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [pressedPath, setPressedPath] = useState(null);
  const timerRef = useRef(null);
  const firedRef = useRef(false);

  const activeIndex = Math.max(
    0,
    links.findIndex((link) => link.path === pathname),
  );
  const isKnownRoute = links.some((link) => link.path === pathname);

  const clearPress = () => {
    clearTimeout(timerRef.current);
    setPressedPath(null);
  };

  const startPress = (link) => {
    if (!link.longPress) return;
    firedRef.current = false;
    setPressedPath(link.path);
    timerRef.current = setTimeout(() => {
      firedRef.current = true;
      setPressedPath(null);
      navigate(link.path, { state: link.longPress.state });
    }, LONG_PRESS_MS);
  };

  const endPress = (e) => {
    clearPress();
    if (firedRef.current) {
      e.preventDefault();
      firedRef.current = false;
    }
  };

  return (
    <ul className="primary-nav">
      {isKnownRoute && (
        <li
          className="nav-indicator"
          style={{ "--nav-index": activeIndex, "--nav-count": links.length }}
          aria-hidden="true"
        />
      )}
      {links.map((link) => (
        <li key={link.path}>
          <NavLink
            to={link.path}
            end={link.path === "/"}
            onClick={(e) => {
              endPress(e);
              if (!e.defaultPrevented) toggleMenu();
            }}
            onPointerDown={() => startPress(link)}
            onPointerUp={(e) => endPress(e)}
            onPointerLeave={clearPress}
            className={({ isActive }) =>
              `${isActive ? "active" : ""}${
                pressedPath === link.path ? " long-pressing" : ""
              }`
            }
          >
            <span className="nav-icon" aria-hidden="true">
              {link.icon}
            </span>
            <span>{link.label}</span>
            {link.longPress && pressedPath === link.path && (
              <span className="nav-longpress-hint">{link.longPress.hint}</span>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

NavLinks.propTypes = {
  toggleMenu: PropTypes.func,
};

export default NavLinks;
