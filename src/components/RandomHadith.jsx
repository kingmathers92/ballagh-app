import useRandomHadith from "../hooks/useRandomHadith";
import "./RandomHadith.css";

function RandomHadith() {
  const { hadith, isLoading, fetchRandomHadith } = useRandomHadith();

  return (
    <div className="container">
      <h2 className="title">Random Hadith</h2>
      {isLoading || !hadith ? (
        <p>Loading...</p>
      ) : (
        <div className="hadith-container">
          <p className="hadith-text rtl">{hadith.text}</p>
          <p className="hadith-source">
            Collection: {hadith.collection}, Edition: {hadith.edition}, Hadith
            Number: {hadith.number}
          </p>
        </div>
      )}
      <button
        className="button"
        onClick={fetchRandomHadith}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          "Get Another Random Hadith"
        )}
      </button>
    </div>
  );
}

export default RandomHadith;
