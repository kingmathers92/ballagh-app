import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";

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

// Five primary destinations only - the ones opened often enough to earn
// permanent thumb-reach real estate. Search lives as a header icon
// (a quick action, not a place you browse) and Journal is one tap away
// through Home's own nav grid - both stay fully reachable, just not
// competing for space in the primary bar.
const links = [
  { path: "/", label: "Home", icon: icons.home },
  { path: "/quran", label: "Quran", icon: icons.quran },
  { path: "/random", label: "Hadith", icon: icons.hadith },
  { path: "/qibla", label: "Qibla", icon: icons.qibla },
  { path: "/prayer-times", label: "Prayer", icon: icons.prayer },
];

const NavLinks = ({ toggleMenu = () => {} }) => {
  const { pathname } = useLocation();
  const activeIndex = Math.max(
    0,
    links.findIndex((link) => link.path === pathname),
  );
  const isKnownRoute = links.some((link) => link.path === pathname);

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
            onClick={toggleMenu}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span className="nav-icon" aria-hidden="true">
              {link.icon}
            </span>
            <span>{link.label}</span>
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
