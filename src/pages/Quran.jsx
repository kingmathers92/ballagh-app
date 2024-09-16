import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useSwipeable } from "react-swipeable";

import "../styles/Quran.css";

import { arabicNum } from "../utils/arabicNumbers";
import Pagination from "../components/Pagination";

function QuranDisplay() {
  const [pages, setPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState({ loading: true, error: null });

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
              allPages[ayah.page].push(ayah);
            });
          });
          setPages(allPages);
        } else {
          throw new Error("No surahs found in the response.");
        }
      } catch (error) {
        setStatus({
          loading: false,
          error: error.message || "Error fetching Quran data.",
        });
      } finally {
        setStatus({ loading: false, error: null });
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

  if (status.loading) return <p>Loading...</p>;
  if (status.error) return <p>{status.error}</p>;

  return (
    <div {...swipeHandlers} className="quran-container">
      {currentAyahs.length > 0 ? (
        <>
          <h3 className="page-title">Page {arabicNum(currentPage)}</h3>
          <div className="ayah-list">
            {currentAyahs.map((ayah) => (
              <p key={ayah.number} className="ayah-text">
                {ayah.text}{" "}
                <span className="ayah-number">
                  ({arabicNum(ayah.numberInSurah)})
                </span>
              </p>
            ))}
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
