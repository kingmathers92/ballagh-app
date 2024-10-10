import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useSwipeable } from "react-swipeable";
import { arabicNum } from "../utils/arabicNumbers";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";

import "../styles/Quran.css";

function QuranDisplay() {
  const [pages, setPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState({ loading: true, error: null });
  const [currentSurah, setCurrentSurah] = useState("");

  useEffect(() => {
    const fetchQuranData = async () => {
      try {
        const response = await axios.get(
          "http://api.alquran.cloud/v1/quran/quran-uthmani"
        );
        if (response.data?.data?.surahs) {
          const allPages = {};
          response.data.data.surahs.forEach((surah) => {
            surah.ayahs.forEach((ayah) => {
              if (!allPages[ayah.page]) {
                allPages[ayah.page] = [];
              }
              allPages[ayah.page].push({ ...ayah, surahName: surah.name });
            });
          });
          setPages(allPages);
        } else {
          setStatus({ loading: false, error: "Please try again later." });
        }
      } catch (error) {
        setStatus({
          loading: false,
          error: error.message || "Error fetching Quran data.",
        });
      } finally {
        setStatus((prevState) => ({ ...prevState, loading: false }));
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

  const currentAyahs = useMemo(
    () => pages?.[currentPage] || [],
    [pages, currentPage]
  );

  useEffect(() => {
    if (currentAyahs.length > 0) {
      setCurrentSurah(currentAyahs[0].surahName);
    }
  }, [currentAyahs]);

  {
    status.loading && <Spinner />;
  }
  if (status.error) return <p>{status.error}</p>;

  return (
    <div {...swipeHandlers} className="quran-container">
      {currentAyahs.length > 0 ? (
        <>
          <h3 className="page-title">{currentSurah}</h3>
          <div className="ayah-list">
            {currentAyahs.map((ayah) => (
              <p key={ayah.number} className="ayah-text">
                {ayah.text}{" "}
                <span className="ayah-number">
                  ({arabicNum(ayah.numberInSurah)})
                </span>
              </p>
            ))}
            <h3 className="page-title">Page {arabicNum(currentPage)}</h3>
          </div>
          <Pagination
            onPrev={handlePrevPage}
            onNext={handleNextPage}
            isPrevDisabled={!pages[currentPage - 1]}
            isNextDisabled={!pages[currentPage + 1]}
          />
        </>
      ) : (
        <p>No ayah data available for this page.</p>
      )}
    </div>
  );
}

export default QuranDisplay;
