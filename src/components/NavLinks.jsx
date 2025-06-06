import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const NavLinks = ({ toggleMenu }) => {
  const links = [
    { path: "/", label: "Home" },
    { path: "/search", label: "Search Hadith" },
    { path: "/random", label: "Random Hadith" },
    { path: "/quran", label: "Quran" },
    { path: "/qibla", label: "Qibla" },
    { path: "/journal", label: "Journal" },
    { path: "/prayer-times", label: "Prayer Times" },
  ];

  return (
    <ul>
      {links.map((link) => (
        <li key={link.path}>
          <NavLink
            to={link.path}
            onClick={toggleMenu}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

NavLinks.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
};

export default NavLinks;
