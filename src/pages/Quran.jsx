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
  const [surahList, setSurahList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchQuranData = async () => {
      try {
        const response = await axios.get(
          "http://api.alquran.cloud/v1/quran/quran-uthmani"
        );
        if (response.data?.data?.surahs) {
          const allPages = {};
          const surahNames = [];
          response.data.data.surahs.forEach((surah) => {
            surahNames.push(surah.name);
            surah.ayahs.forEach((ayah) => {
              if (!allPages[ayah.page]) {
                allPages[ayah.page] = [];
              }
              allPages[ayah.page].push({ ...ayah, surahName: surah.name });
            });
          });
          setPages(allPages);
          setSurahList(surahNames);
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

  const handleSurahChange = (e) => {
    const selectedSurah = e.target.value;
    const surahPage = Object.keys(pages).find(
      (page) => pages[page][0].surahName === selectedSurah
    );
    setCurrentPage(Number(surahPage));
  };

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

  const handleSearch = () => {
    if (searchQuery.trim() === "") return;

    const results = [];
    Object.keys(pages).forEach((page) => {
      pages[page].forEach((ayah) => {
        if (ayah.text.includes(searchQuery)) {
          results.push({
            ...ayah,
            page: page,
          });
        }
      });
    });
    setSearchResults(results);
  };

  {
    status.loading && <Spinner />;
  }
  if (status.error) return <p>{status.error}</p>;

  return (
    <div {...swipeHandlers} className="quran-container">
      <div className="search-surah-container">
        <select onChange={handleSurahChange}>
          {surahList.map((surah, index) => (
            <option key={index} value={surah}>
              {surah}
            </option>
          ))}
        </select>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search for Ayah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>
      {searchResults.length > 0 ? (
        <div className="search-results">
          <h3>Search Results:</h3>
          {searchResults.map((result, index) => (
            <div key={index} className="search-result-item">
              <p>
                {result.surahName} (Page {arabicNum(result.page)}):{" "}
                {result.text}{" "}
                <span className="ayah-number">
                  ({arabicNum(result.numberInSurah)})
                </span>
              </p>
            </div>
          ))}
        </div>
      ) : null}

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
