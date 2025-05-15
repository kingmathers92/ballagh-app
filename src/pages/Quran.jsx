import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchQuranData } from "../utils/api";
import useBookmarks from "../hooks/useBookmarks";
import { useSwipeable } from "react-swipeable";
import { arabicNum } from "../utils/arabicNumbers";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import "../styles/Quran.css";

function Quran() {
  const [pages, setPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState({ loading: true, error: null });
  const [currentSurah, setCurrentSurah] = useState("");
  const [surahList, setSurahList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [inputPage, setInputPage] = useState("");
  const [selectedSurahAudio, setSelectedSurahAudio] = useState(1);
  const { bookmarkedPages, removeBookmark } = useBookmarks();

  useEffect(() => {
    const getData = async () => {
      try {
        const surahs = await fetchQuranData();
        if (surahs) {
          const allPages = {};
          const surahNames = surahs.map((surah) => surah.name);

          surahs.forEach((surah) => {
            surah.ayahs.forEach((ayah) => {
              if (!allPages[ayah.page]) allPages[ayah.page] = [];
              allPages[ayah.page].push({ ...ayah, surahName: surah.name });
            });
          });

          setPages(allPages);
          setSurahList(surahNames);
        } else {
          setStatus({ loading: false, error: "Please try again later." });
        }
      } catch (error) {
        setStatus({ loading: false, error: error.message });
      } finally {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    };

    getData();
  }, []);

  const handleSurahChange = (e) => {
    const selectedSurah = e.target.value;
    const surahPage = Object.keys(pages).find(
      (page) => pages[page][0].surahName === selectedSurah
    );
    setCurrentPage(Number(surahPage));
  };

  const handlePageChange = (pageNumber) => {
    if (pages[pageNumber]) setCurrentPage(pageNumber);
  };

  const handlePrev = () => {
    if (pages[currentPage - 1]) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (pages[currentPage + 1]) setCurrentPage((prev) => prev + 1);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    trackMouse: true,
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

  const totalPages = useMemo(() => Object.keys(pages || {}).length, [pages]);

  const debouncedSearch = useCallback(() => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      return;
    }

    const results = [];
    Object.keys(pages).forEach((page) => {
      pages[page].forEach((ayah) => {
        if (ayah.text.includes(query)) {
          results.push({
            ...ayah,
            page: page,
          });
        }
      });
    });
    setSearchResults(results);
  }, [searchQuery, pages]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      debouncedSearch();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [debouncedSearch]);

  const handlePageInputChange = (e) => setInputPage(e.target.value);

  const handleGoToPage = () => {
    const page = parseInt(inputPage, 10);
    if (page && pages[page]) {
      setCurrentPage(page);
      setInputPage("");
    }
  };

  if (status.loading) return <Spinner />;
  if (status.error) return <p>{status.error}</p>;

  return (
    <div {...swipeHandlers} className="quran-container">
      <header className="quran-header">
        <h1>القرآن الكريم</h1>
      </header>
      {/* Sidebar: Only render if pages is available */}
      {pages && (
        <div className="quran-sidebar">
          <h4>الفهرس</h4>
          <ul>
            {surahList.map((surah, index) => {
              const pageNumber = Object.keys(pages).find(
                (page) => pages[page][0]?.surahName === surah
              );
              return (
                <li
                  key={index}
                  onClick={() =>
                    handleSurahChange({ target: { value: surah } })
                  }
                >
                  {surah} - الصفحة {pageNumber ? arabicNum(pageNumber) : "?"}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="quran-main-content">
        <div className="search-surah-container">
          <select onChange={handleSurahChange} className="surah-dropdown">
            {surahList.map((surah, index) => (
              <option key={index} value={surah}>
                {surah}
              </option>
            ))}
          </select>

          <select
            value={selectedSurahAudio}
            onChange={(e) => setSelectedSurahAudio(parseInt(e.target.value))}
            className="audio-dropdown"
          >
            {surahList.map((surah, index) => (
              <option key={index} value={index + 1}>
                {surah} (Surah {arabicNum(index + 1)})
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
          </div>
        </div>

        <AudioPlayer
          autoPlay={false}
          src={`https://download.quranicaudio.com/qdc/mishary_rashid_alafasy/murattal/${String(
            selectedSurahAudio
          ).padStart(3, "0")}.mp3`}
          onPlayError={() => console.log("Playback failed")}
          style={{
            borderRadius: "10px",
            backgroundColor: "var(--secondary-color)",
            padding: "10px",
            margin: "15px 0",
          }}
        />

        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>Search Results:</h3>
            {searchResults.map((result, index) => (
              <div key={index} className="search-result-item">
                <p>
                  {result.surahName} (Page {arabicNum(result.page)}):{" "}
                  {result.text}
                  <span className="ayah-number">
                    ({arabicNum(result.numberInSurah)})
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="page-input-container">
          <input
            type="number"
            placeholder="Enter page number"
            value={inputPage}
            onChange={handlePageInputChange}
          />
          <button onClick={handleGoToPage} disabled={!inputPage}>
            Go
          </button>
        </div>

        {currentAyahs.length > 0 && (
          <>
            <h3 className="page-title">{currentSurah}</h3>
            <div className="ayah-list">
              {currentAyahs.map((ayah) => (
                <p key={ayah.number} className="ayah-text">
                  {ayah.text}
                  <span className="ayah-number">
                    ({arabicNum(ayah.numberInSurah)})
                  </span>
                </p>
              ))}
              <h3 className="page-title">Page {arabicNum(currentPage)}</h3>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onPrev={handlePrev}
              onNext={handleNext}
              isPrevDisabled={!pages[currentPage - 1]}
              isNextDisabled={!pages[currentPage + 1]}
            />
          </>
        )}

        {bookmarkedPages.length > 0 && (
          <div className="bookmarked-pages">
            <h4>Bookmarked Pages:</h4>
            {bookmarkedPages.map((page) => (
              <div key={page} className="bookmarked-item">
                <span onClick={() => setCurrentPage(page)}>
                  Page {arabicNum(page)}
                </span>
                <button onClick={() => removeBookmark(page)}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Quran;
