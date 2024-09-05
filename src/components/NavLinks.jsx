import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const NavLinks = ({ toggleMenu }) => {
  const links = [
    { path: "/", label: "Home" },
    { path: "/search", label: "Search Verses" },
    { path: "/random", label: "Random Verse" },
    { path: "/quran", label: "Quran" },
    { path: "/qibla", label: "Qibla" },
    { path: "/journal", label: "Journal" },
  ];

  return (
    <ul>
      {links.map((link) => (
        <li key={link.path}>
          <Link to={link.path} onClick={toggleMenu}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

NavLinks.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
};

export default NavLinks;
