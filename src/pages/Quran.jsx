import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchQuranData, fetchSurahAudio } from "../utils/api";
import useBookmarks from "../hooks/useBookmarks";
import { useSwipeable } from "react-swipeable";
import { arabicNum } from "../utils/arabicNumbers";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import { debounce } from "../utils/debounceUtils";
import "../styles/Quran.css";

function QuranDisplay() {
  const [pages, setPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState({ loading: true, error: null });
  const [currentSurah, setCurrentSurah] = useState("");
  const [surahList, setSurahList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [inputPage, setInputPage] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const { bookmarkedPages, addBookmark, removeBookmark } = useBookmarks();

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

  const handlePlaySurah = async () => {
    if (audioPlaying) {
      setAudioPlaying(false);
      return;
    }
    try {
      const audio = await fetchSurahAudio();
      setAudioUrl(audio);
      setAudioPlaying(true);
    } catch (error) {
      console.error("Error fetching audio:", error);
    }
  };

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

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handlePageChange(currentPage + 1),
    onSwipedRight: () => handlePageChange(currentPage - 1),
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

  const handleSearch = useCallback(
    debounce(() => {
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
    }, 500),
    [searchQuery, pages]
  );

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

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
        </div>
      </div>
      {searchResults.length > 0 && (
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
      )}

      <button className="play-surah-button" onClick={handlePlaySurah}>
        {audioPlaying ? "Stop Surah" : "Play Surah"}
      </button>

      {audioPlaying && (
        <audio controls autoPlay src={audioUrl}>
          Your browser does not support the audio element.
        </audio>
      )}

      <button
        onClick={() => addBookmark(currentPage)}
        disabled={bookmarkedPages.includes(currentPage)}
        className="bookmark-button"
      >
        {bookmarkedPages.includes(currentPage)
          ? "Bookmarked"
          : "Bookmark this page"}
      </button>

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
                {ayah.text}{" "}
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
            isPrevDisabled={!pages[currentPage - 1]}
            isNextDisabled={!pages[currentPage + 1]}
          />

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
        </>
      )}
    </div>
  );
}

export default QuranDisplay;
