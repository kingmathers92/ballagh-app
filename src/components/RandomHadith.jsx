import { useState, useEffect } from "react";
import axios from "axios";

function RandomHadith() {
  const [verses, setVerses] = useState([]);
  const [currentVerse, setCurrentVerse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchQuran = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://api.alquran.cloud/v1/quran/ar.alafasy"
      );
      const allVerses = response.data.data.surahs.flatMap((surah) =>
        surah.ayahs.map((ayah) => ({
          ...ayah,
          surahName: surah.name,
          surahEnglishName: surah.englishName,
        }))
      );
      setVerses(allVerses);
      getRandomVerse(allVerses);
    } catch (error) {
      console.error("Error fetching Quran:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomVerse = (availableVerses) => {
    const randomIndex = Math.floor(Math.random() * availableVerses.length);
    setCurrentVerse(availableVerses[randomIndex]);
  };

  useEffect(() => {
    fetchQuran();
  }, []);

  const handleGetRandomVerse = () => {
    if (verses.length > 0) {
      getRandomVerse(verses);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Random Verse</h2>
      {isLoading || !currentVerse ? (
        <p>Loading...</p>
      ) : (
        <div className="hadith-container">
          <p className="hadith-text">{currentVerse.text}</p>
          <p className="hadith-source">
            Surah: {currentVerse.surahName} ({currentVerse.surahEnglishName}),
            Verse: {currentVerse.numberInSurah}
          </p>
        </div>
      )}
      <button
        className="button"
        onClick={handleGetRandomVerse}
        disabled={isLoading || verses.length === 0}
      >
        {isLoading ? "Loading..." : "Get Another Random Verse"}
      </button>
    </div>
  );
}

export default RandomHadith;
