import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import useBookmarks from "../hooks/useBookmarks";
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
  const [inputPage, setInputPage] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const { bookmarkedPages, addBookmark, removeBookmark } = useBookmarks();

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

  const handlePlaySurah = async (surahNumber) => {
    try {
      const response = await axios.get(
        `http://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`
      );
      if (response.data?.data?.ayahs) {
        setAudioUrl(response.data.data.ayahs[0].audio);
        setAudioPlaying(true);
      }
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

  const handlePageChange = (pageNumber) => {
    if (pages[pageNumber]) {
      setCurrentPage(pageNumber);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextPage,
    onSwipedRight: handlePrevPage,
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

  const handlePageInputChange = (e) => {
    setInputPage(e.target.value);
  };

  const handleGoToPage = () => {
    const page = parseInt(inputPage, 10);
    if (page && pages[page]) {
      setCurrentPage(page);
      setInputPage("");
    }
  };

  // const handleAudioToggle = () => {
  //   const audioElement = document.getElementById("audioPlayer");
  //   if (audioPlaying) {
  //     audioElement.pause();
  //   } else {
  //     audioElement.play();
  //   }
  //   setAudioPlaying(!audioPlaying);
  // };

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

      <button
        className="play-surah-button"
        onClick={() => handlePlaySurah(currentAyahs[0].surahNumber)}
      >
        Play Surah
      </button>

      {audioPlaying && (
        <audio controls autoPlay>
          <source src={audioUrl} type="audio/mp3" />
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
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPrev={handlePrevPage}
            onNext={handleNextPage}
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
      ) : (
        <p>No ayah data available for this page.</p>
      )}
    </div>
  );
}

export default QuranDisplay;
