import { useState, useEffect } from "react";
import axios from "axios";
import { useSwipeable } from "react-swipeable";
import "../styles/Quran.css";

function QuranDisplay() {
  const [surahs, setSurahs] = useState([]);
  const [currentSurahIndex, setCurrentSurahIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuranData = async () => {
      try {
        const response = await axios.get(
          "http://api.alquran.cloud/v1/quran/quran-uthmani"
        );
        if (response.data && response.data.data && response.data.data.surahs) {
          setSurahs(response.data.data.surahs);
        } else {
          setError("No surahs found in the response.");
        }
      } catch (error) {
        setError("Error fetching Quran data.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuranData();
  }, []);

  const handleNextSurah = () => {
    if (currentSurahIndex < surahs.length - 1) {
      setCurrentSurahIndex(currentSurahIndex + 1);
    }
  };

  const handlePrevSurah = () => {
    if (currentSurahIndex > 0) {
      setCurrentSurahIndex(currentSurahIndex - 1);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextSurah,
    onSwipedRight: handlePrevSurah,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const currentSurah = surahs[currentSurahIndex];

  return (
    <div {...swipeHandlers} className="quran-container">
      {currentSurah ? (
        <>
          <h3>
            {currentSurah.name} ({currentSurah.englishName})
          </h3>
          <div className="ayah-list">
            {currentSurah.ayahs.map((ayah) => (
              <p key={ayah.number} className="ayah-text">
                {ayah.text}
              </p>
            ))}
          </div>
          <div className="pagination-controls">
            <button
              onClick={handlePrevSurah}
              disabled={currentSurahIndex === 0}
              className="pagination-btn"
            >
              Previous
            </button>
            <button
              onClick={handleNextSurah}
              disabled={currentSurahIndex === surahs.length - 1}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No surah data available.</p>
      )}
    </div>
  );
}

export default QuranDisplay;
