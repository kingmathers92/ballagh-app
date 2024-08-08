import { useState } from "react";
import axios from "axios";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchVerses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://api.alquran.cloud/v1/quran/en.asad"
      );
      const verses = response.data.data.surahs.flatMap((surah) =>
        surah.ayahs.map((ayah) => ({
          text: ayah.text,
          surah: surah.englishName,
          numberInSurah: ayah.numberInSurah,
        }))
      );
      const filteredVerses = verses.filter((verse) =>
        verse.text.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredVerses);
    } catch (error) {
      console.error("Error fetching Quran:", error);
      setError(
        "An error occurred while fetching the Quran. Please try again later."
      );
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2 className="title">Search Verses</h2>
      <input
        className="input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter search term"
      />
      <button className="button" onClick={searchVerses}>
        Search
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {results.map((result, index) => (
        <div key={index} className="hadith-container">
          <p className="hadith-text">{result.text}</p>
          <p className="hadith-source">
            Surah: {result.surah}, Verse: {result.numberInSurah}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Search;
