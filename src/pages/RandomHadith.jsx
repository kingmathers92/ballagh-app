import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import useRandomHadith from "../hooks/useRandomHadith";
import Spinner from "../components/Spinner";
import ShareButton from "../components/ShareButton";
import ShareImageBox from "../components/ShareImageBox";
import { FaRandom } from "react-icons/fa";

import "../styles/RandomHadith.css";

function RandomHadith() {
  const { hadith, isLoading, error, arabicEditions, fetchRandomHadith } =
    useRandomHadith();
  const location = useLocation();
  const consumedFreshFetch = useRef(false);

  useEffect(() => {
    if (
      location.state?.freshFetch &&
      !consumedFreshFetch.current &&
      arabicEditions?.length > 0
    ) {
      consumedFreshFetch.current = true;
      fetchRandomHadith();
    }
  }, [location.state, arabicEditions, fetchRandomHadith]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => !isLoading && fetchRandomHadith(),
    onSwipedRight: () => !isLoading && fetchRandomHadith(),
    trackMouse: false,
    preventScrollOnSwipe: false,
  });

  return (
    <div className="container">
      <h2 className="title">Random Hadith</h2>
      <p className="subtitle">Explore Hadiths Alongside the Quran</p>
      <p className="swipe-hint">Swipe the card for a new one</p>
      {arabicEditions?.length === 0 && !error && (
        <p className="loading-placeholder">Fetching a Hadith for You…</p>
      )}

      {error && (
        <div className="error-container">
          <p className="error">{error}</p>
          <button
            className="button retry-button"
            onClick={fetchRandomHadith}
            disabled={isLoading}
            aria-label="Retry fetching random hadith"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && hadith && (
        <div id="hadith-text" className="hadith-container" {...swipeHandlers}>
          <p className="hadith-text rtl">{hadith.text}</p>
          <p className="hadith-source">
            Collection: {hadith.collection}, Edition: {hadith.edition}, Hadith
            Number: {hadith.number}
          </p>
          {hadith.grades && hadith.grades.length > 0 ? (
            <p className="hadith-grades">
              Grades:{" "}
              {hadith.grades.map((grade, index) => (
                <span key={index}>
                  {grade.grade}
                  {grade.name ? ` (${grade.name})` : ""}
                  {index < hadith.grades.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          ) : (
            <p className="hadith-authenticity-note" role="note">
              Authenticity not established by the available sources for this
              narration - grading data wasn&apos;t provided.
            </p>
          )}
          {hadith.authenticity === "weak" && (
            <p className="hadith-authenticity-warning" role="alert">
              Note: available gradings for this narration lean weak. Please
              verify before relying on or sharing it.
            </p>
          )}

          <div className="share-buttons">
            <ShareButton textToCopy={hadith.text} />
            <ShareImageBox textToShare={hadith.text} />
          </div>
        </div>
      )}

      {isLoading && !error && (
        <div className="hadith-container skeleton">
          <div className="skeleton-text"></div>
          <div className="skeleton-source"></div>
          <div className="skeleton-buttons"></div>
        </div>
      )}

      <div className="button-wrapper">
        <button
          className="button"
          onClick={fetchRandomHadith}
          disabled={isLoading}
          aria-label={
            isLoading ? "Loading new hadith" : "Get another random hadith"
          }
          aria-busy={isLoading}
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <FaRandom className="button-icon" /> Get Another Random Hadith
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default RandomHadith;
