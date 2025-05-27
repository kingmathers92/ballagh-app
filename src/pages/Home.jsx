import { Link } from "react-router-dom";
import { FaSearch, FaRandom, FaKaaba } from "react-icons/fa";

function Home() {
  return (
    <div>
      <div className="hero-section">
        <h1 className="title">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</h1>
      </div>
      <div className="container">
        <h2 className="subtitle">Welcome to the Quran App</h2>
        <p className="description">
          Discover the beauty of the Holy Quran. Read verses, listen to soothing
          recitations, search for specific ayahs, or find the Qibla direction to
          enhance your spiritual journey.
        </p>
        <div className="buttons-container">
          <Link to="/search" className="button">
            <FaSearch className="button-icon" /> Search Verses
          </Link>
          <Link to="/random" className="button">
            <FaRandom className="button-icon" /> Get Random Verse
          </Link>
          <Link to="/qibla" className="button">
            <FaKaaba className="button-icon" /> Qibla Direction
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
