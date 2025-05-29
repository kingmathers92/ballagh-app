import useRandomHadith from "../hooks/useRandomHadith";
import Spinner from "../components/Spinner";
import ShareButton from "../components/ShareButton";
import ShareImageBox from "../components/ShareImageBox";
import { FaRandom } from "react-icons/fa";

import "../styles/RandomHadith.css";

function RandomHadith() {
  const { hadith, isLoading, error, arabicEditions, fetchRandomHadith } =
    useRandomHadith();

  return (
    <div className="container">
      <h2 className="title">Random Hadith</h2>
      <p className="subtitle">Explore Hadiths Alongside the Quran</p>
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
        <div id="hadith-text" className="hadith-container">
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
                  {grade.scholar ? ` (${grade.scholar})` : ""}
                  {index < hadith.grades.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          ) : (
            <p className="hadith-grades">Grades: Not available</p>
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
