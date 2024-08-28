import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container">
      <h1 className="title">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</h1>
      <h2 className="subtitle">Welcome to the Quran App</h2>
      <p>
        Welcome to the Hadith App. Here you can search for hadiths or get a
        random hadith.
      </p>
      <div className="buttons-container">
        <Link to="/search" className="button">
          Search Hadiths
        </Link>
        <Link to="/random" className="button">
          Get Random Hadith
        </Link>
        <Link to="/qibla" className="button">
          Qibla
        </Link>
      </div>
    </div>
  );
}

export default Home;
