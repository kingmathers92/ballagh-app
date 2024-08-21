import { useState, useEffect } from "react";
import { quran } from "@quranjs/api";
import { useSwipeable } from "react-swipeable";

function QuranDisplay() {
  const [chapters, setChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuranData = async () => {
      try {
        const response = await quran.v4.chapters.findAll();
        if (response && response.chapters) {
          setChapters(response.chapters);
        } else {
          setError("No chapters found in the response.");
        }
      } catch (error) {
        setError("Error fetching Quran data");
      } finally {
        setLoading(false);
      }
    };

    fetchQuranData();
  }, []);

  const handleNextChapter = () => {
    setCurrentChapterIndex((prevIndex) =>
      prevIndex < chapters.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePrevChapter = () => {
    setCurrentChapterIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextChapter,
    onSwipedRight: handlePrevChapter,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Ensure `chapters` has been loaded and is not empty before accessing it
  if (chapters.length === 0) return <p>No chapters available.</p>;

  const currentChapter = chapters[currentChapterIndex];

  return (
    <div {...swipeHandlers} className="quran-container">
      {currentChapter ? (
        <>
          <h3>{currentChapter.nameSimple}</h3>
          {currentChapter.ayahs?.map((ayah) => (
            <p key={ayah.id} className="ayah">
              {ayah.text}
            </p>
          ))}
          <div className="navigation-buttons">
            <button
              onClick={handlePrevChapter}
              disabled={currentChapterIndex === 0}
            >
              Previous
            </button>
            <button
              onClick={handleNextChapter}
              disabled={currentChapterIndex === chapters.length - 1}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No chapter data available.</p>
      )}
    </div>
  );
}

export default QuranDisplay;
