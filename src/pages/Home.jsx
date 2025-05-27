import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container">
      <h1 className="title">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</h1>
      <h2 className="subtitle">Welcome to the Quran App</h2>
      <p className="description">
        Explore the Holy Quran, search for verses, listen to recitations, or
        find the Qibla direction with ease.
      </p>
      <div className="buttons-container">
        <Link to="/search" className="button">
          Search Verses
        </Link>
        <Link to="/random" className="button">
          Get Random Verse
        </Link>
        <Link to="/qibla" className="button">
          Qibla Direction
        </Link>
      </div>
    </div>
  );
}

export default Home;
