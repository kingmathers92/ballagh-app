import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { fetchQuranData } from "../utils/api";
import useBookmarks from "../hooks/useBookmarks";
import { useSwipeable } from "react-swipeable";
import { arabicNum } from "../utils/arabicNumbers";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useReciterAudio } from "../hooks/useReciterAudio";
import ReciterPicker from "../components/ReciterPicker";
import { usePersistedState } from "../hooks/usePersistedState";

import "../styles/Quran.css";

function Quran() {
  const location = useLocation();
  const [pages, setPages] = useState(null);
  const [currentPage, setCurrentPage] = usePersistedState("quranLastPage", 1);
  const [status, setStatus] = useState({ loading: true, error: null });
  const [currentSurah, setCurrentSurah] = useState("");
  const [surahList, setSurahList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [inputPage, setInputPage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [isReciterPickerOpen, setIsReciterPickerOpen] = useState(false);
  const audioPlayerRef = useRef(null);
  const { bookmarkedPages, removeBookmark } = useBookmarks();

  const currentAyahs = useMemo(
    () => pages?.[currentPage] || [],
    [pages, currentPage],
  );
  const totalPages = useMemo(() => Object.keys(pages || {}).length, [pages]);

  useEffect(() => {
    if (location.state?.randomPage && totalPages > 0) {
      setCurrentPage(1 + Math.floor(Math.random() * totalPages));
    }
    // Only re-run when the navigation itself changes (location.key is a
    // fresh value on every navigation, even to the same route) or once
    // totalPages first becomes available - not on every currentPage change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, totalPages]);

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
          results.push({ ...ayah, page });
        }
      });
    });
    setSearchResults(results);
  }, [searchQuery, pages]);

  const handleSurahChange = (e) => {
    const selectedSurah = e.target.value;
    const surahPage = Object.keys(pages).find(
      (page) => pages[page][0].surahName === selectedSurah,
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

  const handlePageInputChange = (e) => setInputPage(e.target.value);

  const handleGoToPage = () => {
    const page = parseInt(inputPage, 10);
    if (page && pages[page]) {
      setCurrentPage(page);
      setInputPage("");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Effects
  // Fetch Quran data on mount
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
              allPages[ayah.page].push({
                ...ayah,
                surahName: surah.name,
                surahNumber: surah.number,
              });
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

  // Update current surah when ayahs change
  useEffect(() => {
    if (currentAyahs.length > 0) {
      setCurrentSurah(currentAyahs[0].surahName);
    }
  }, [currentAyahs]);

  const reciterAudio = useReciterAudio(pages);

  useEffect(() => {
    if (reciterAudio.audioSrc && audioPlayerRef.current?.audio?.current) {
      const playPromise = audioPlayerRef.current.audio.current.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {
          // Autoplay can be blocked by the browser before any user
          // gesture has happened in this session - the visible play
          // button in the player still lets the user start it manually.
        });
      }
    }
  }, [reciterAudio.audioSrc]);

  // Debounced search effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      debouncedSearch();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [debouncedSearch]);

  // Render
  if (status.loading) return <Spinner />;
  if (status.error) return <p>{status.error}</p>;

  return (
    <div {...swipeHandlers} className="quran-container">
      {/* Sidebar Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? "إخفاء" : "السور"} {/* Simplified labels */}
      </button>

      {/* Sidebar */}
      {pages && (
        <div className={`quran-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
          <ul>
            {surahList.map((surah, index) => {
              const pageNumber = Object.keys(pages).find(
                (page) => pages[page][0]?.surahName === surah,
              );
              return (
                <li
                  key={index}
                  onClick={() => {
                    handleSurahChange({ target: { value: surah } });
                    setIsSidebarOpen(false); // Close sidebar after selection
                  }}
                >
                  {surah} ({pageNumber ? arabicNum(pageNumber) : "?"})
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="quran-main-content">
        {/* Combined Search, Surah, and Page Navigation */}
        <div className="search-surah-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="البحث في الآيات"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select onChange={handleSurahChange} className="surah-dropdown">
            <option value="">اختر سورة</option>
            {surahList.map((surah, index) => (
              <option key={index} value={surah}>
                {surah}
              </option>
            ))}
          </select>
          <div className="page-input-container">
            <input
              type="number"
              placeholder="أدخل رقم الصفحة"
              value={inputPage}
              onChange={handlePageInputChange}
            />
            <button onClick={handleGoToPage} disabled={!inputPage}>
              اذهب
            </button>
          </div>
        </div>

        {/* Audio Player */}
        <div className="audio-controls-row">
          <button
            className="play-surah-button"
            onClick={() =>
              currentAyahs[0] &&
              reciterAudio.playSurah(currentAyahs[0].surahNumber)
            }
            disabled={!currentAyahs[0]}
          >
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M5 3.5v9l8-4.5Z" fill="currentColor" />
            </svg>
            Play surah
          </button>
          <button
            className="reciter-pill"
            onClick={() => setIsReciterPickerOpen(true)}
          >
            <span className="reciter-pill-mark">
              <svg viewBox="0 0 22 22" aria-hidden="true">
                <path d="M11 1 13.2 5 18 3.4 16.6 8.2 21 11 16.6 13.8 18 18.6 13.2 17 11 21 8.8 17 4 18.6 5.4 13.8 1 11 5.4 8.2 4 3.4 8.8 5Z" />
              </svg>
            </span>
            {reciterAudio.reciter.name}
          </button>
        </div>

        {reciterAudio.audioSrc && (
          <AudioPlayer
            ref={audioPlayerRef}
            autoPlay
            src={reciterAudio.audioSrc}
            onPlayError={() => console.log("Playback failed")}
            onEnded={() => {
              const moved = reciterAudio.advance();
              if (!moved) reciterAudio.stop();
            }}
            header={
              reciterAudio.currentAyah
                ? `${reciterAudio.currentAyah.surahName} · Ayah ${arabicNum(
                    reciterAudio.currentAyah.numberInSurah,
                  )} · ${reciterAudio.reciter.name}`
                : ""
            }
          />
        )}

        <ReciterPicker
          isOpen={isReciterPickerOpen}
          onClose={() => setIsReciterPickerOpen(false)}
          reciters={reciterAudio.reciters}
          selectedId={reciterAudio.reciter.id}
          onSelect={(id) => {
            reciterAudio.setReciterId(id);
            setIsReciterPickerOpen(false);
          }}
        />

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>نتائج البحث:</h3>
            {searchResults.map((result, index) => (
              <div key={index} className="search-result-item">
                <p>
                  {result.surahName} (الصفحة {arabicNum(result.page)}):{" "}
                  {result.text}
                  <span className="ayah-number">
                    ({arabicNum(result.numberInSurah)})
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Ayah Display */}
        {currentAyahs.length > 0 && (
          <>
            <div className="quran-page-frame cut-corner">
              {currentAyahs.map((ayah, index) => {
                const isNewSurah =
                  index === 0 ||
                  ayah.surahName !== currentAyahs[index - 1].surahName;
                return (
                  <span key={ayah.number}>
                    {isNewSurah && (
                      <span className="surah-divider">
                        <svg viewBox="0 0 22 22" aria-hidden="true">
                          <path d="M11 1 13.2 5 18 3.4 16.6 8.2 21 11 16.6 13.8 18 18.6 13.2 17 11 21 8.8 17 4 18.6 5.4 13.8 1 11 5.4 8.2 4 3.4 8.8 5Z" />
                        </svg>
                        <span className="surah-divider-name">
                          {ayah.surahName}
                        </span>
                        <svg viewBox="0 0 22 22" aria-hidden="true">
                          <path d="M11 1 13.2 5 18 3.4 16.6 8.2 21 11 16.6 13.8 18 18.6 13.2 17 11 21 8.8 17 4 18.6 5.4 13.8 1 11 5.4 8.2 4 3.4 8.8 5Z" />
                        </svg>
                      </span>
                    )}
                    <span
                      className={`ayah-text${
                        reciterAudio.currentAyah?.number === ayah.number
                          ? " ayah-playing"
                          : ""
                      }${
                        selectedAyah?.number === ayah.number
                          ? " ayah-selected"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedAyah(
                          selectedAyah?.number === ayah.number ? null : ayah,
                        )
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedAyah(
                            selectedAyah?.number === ayah.number ? null : ayah,
                          );
                        }
                      }}
                    >
                      {ayah.text}
                      <span className="ayah-number">
                        {arabicNum(ayah.numberInSurah)}
                      </span>
                    </span>
                    {selectedAyah?.number === ayah.number && (
                      <span className="ayah-action-bar">
                        <button
                          onClick={() => {
                            reciterAudio.playAyah(ayah);
                            setSelectedAyah(null);
                          }}
                        >
                          <svg viewBox="0 0 16 16" fill="none">
                            <path d="M5 3.5v9l8-4.5Z" fill="currentColor" />
                          </svg>
                          Play this ayah
                        </button>
                        <button
                          onClick={() => {
                            reciterAudio.playSurah(ayah.surahNumber, ayah);
                            setSelectedAyah(null);
                          }}
                        >
                          <svg viewBox="0 0 16 16" fill="none">
                            <path
                              d="M4 3v10M8 3v10M12 3v10"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                            />
                          </svg>
                          Play from here
                        </button>
                      </span>
                    )}{" "}
                  </span>
                );
              })}
            </div>
            <p className="quran-page-footer">
              {currentSurah} &middot; Page {arabicNum(currentPage)}
            </p>
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

        {/* Bookmarked Pages */}
        {bookmarkedPages.length > 0 && (
          <div className="bookmarked-pages">
            <h4>الصفحات المحفوظة:</h4>
            {bookmarkedPages.map((page) => (
              <div key={page} className="bookmarked-item">
                <span onClick={() => setCurrentPage(page)}>
                  الصفحة {arabicNum(page)}
                </span>
                <button onClick={() => removeBookmark(page)}>إزالة</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Quran;
