import { useState, useEffect } from "react";
import axios from "axios";

function RandomHadith() {
  const [hadith, setHadith] = useState(null);

  const fetchRandomHadith = async () => {
    try {
      const response = await axios.get(
        "https://api.alquran.cloud/v1/ayah/random/en"
      );
      setHadith(response.data.data);
    } catch (error) {
      console.error("Error fetching random hadith:", error);
    }
  };

  useEffect(() => {
    fetchRandomHadith();
  }, []);

  return (
    <div className="container">
      <h2 className="title">Random Verse</h2>
      {hadith ? (
        <div className="hadith-container">
          <p className="hadith-text">{hadith.text}</p>
          <p className="hadith-source">
            Surah: {hadith.surah.englishName}, Verse: {hadith.numberInSurah}
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <button className="button" onClick={fetchRandomHadith}>
        Get Another Random Verse
      </button>
    </div>
  );
}

export default RandomHadith;
