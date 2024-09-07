import { useState, useEffect } from "react";
import axios from "axios";
import { useSwipeable } from "react-swipeable";
import "../styles/Quran.css";

function QuranDisplay() {
  const [surahs, setSurahs] = useState([]);
  const [pages, setPages] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
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
          const allPages = {};

          // Group ayahs by pages
          response.data.data.surahs.forEach((surah) => {
            surah.ayahs.forEach((ayah) => {
              if (!allPages[ayah.page]) {
                allPages[ayah.page] = [];
              }
              allPages[ayah.page].push(ayah);
            });
          });
          setPages(allPages);
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

  const handleNextPage = () => {
    if (pages[currentPage + 1]) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pages[currentPage - 1]) {
      setCurrentPage(currentPage - 1);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextPage,
    onSwipedRight: handlePrevPage,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const currentAyahs = pages[currentPage] || [];

  return (
    <div {...swipeHandlers} className="quran-container">
      {currentAyahs.length > 0 ? (
        <>
          <h3>Page {currentPage}</h3>
          <div className="ayah-list">
            {currentAyahs.map((ayah) => (
              <p key={ayah.number} className="ayah-text">
                {ayah.text}
              </p>
            ))}
          </div>
          <div className="pagination-controls">
            <button
              onClick={handlePrevPage}
              disabled={!pages[currentPage - 1]}
              className="pagination-btn"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={!pages[currentPage + 1]}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No ayah data available for this page.</p>
      )}
    </div>
  );
}

export default QuranDisplay;
