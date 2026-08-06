import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const ACCEPTABLE_GRADE = /sahih|hasan/i;
const WEAK_GRADE = /da'?if|munkar|shadh|mawdu|fabricated/i;

const classifyAuthenticity = (grades) => {
  if (!grades || grades.length === 0) return "unverified";
  const hasAcceptable = grades.some((g) => ACCEPTABLE_GRADE.test(g.grade));
  if (hasAcceptable) return "graded";
  const allWeak = grades.every((g) => WEAK_GRADE.test(g.grade));
  return allWeak ? "weak" : "unverified";
};

const pickHadithNumber = (hadiths) => {
  const keys = Object.keys(hadiths);
  let candidate = keys[Math.floor(Math.random() * keys.length)];

  for (let attempt = 0; attempt < 5; attempt++) {
    const status = classifyAuthenticity(hadiths[candidate]?.grades);
    if (status !== "weak") break;
    candidate = keys[Math.floor(Math.random() * keys.length)];
  }
  return candidate;
};

const useRandomHadith = (apiVersion = "1") => {
  const [hadith, setHadith] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [arabicEditions, setArabicEditions] = useState([]);
  const editionCache = useRef(new Map());

  const fetchArabicEditions = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@${apiVersion}/editions.json`,
      );
      const arabicEditions = [];
      Object.values(response.data).forEach((book) => {
        book.collection.forEach((edition) => {
          if (edition.language === "Arabic") {
            arabicEditions.push({
              ...edition,
              link: edition.link.replace(".min.json", ".json"),
            });
          }
        });
      });
      setArabicEditions(arabicEditions);
    } catch (error) {
      console.error("Error fetching Data:", error);
      setError("Failed to load Arabic editions. Please try again.");
    }
  }, [apiVersion]);

  const handleHadithFetch = useCallback(
    (hadiths, randomHadithNumber, randomEdition) => {
      const selectedHadith = hadiths[randomHadithNumber];

      const deduplicatedGrades = selectedHadith.grades?.filter(
        (grade, index, self) =>
          index ===
          self.findIndex(
            (g) =>
              g.grade === grade.grade &&
              (g.name || "Unknown") === (grade.name || "Unknown"),
          ),
      );

      setHadith({
        text: selectedHadith.text,
        number: randomHadithNumber,
        collection: randomEdition.book,
        edition: randomEdition.name,
        grades: deduplicatedGrades || [],
        authenticity: classifyAuthenticity(deduplicatedGrades),
      });
    },
    [],
  );

  const fetchRandomHadith = useCallback(async () => {
    if (arabicEditions.length === 0) return;

    setIsLoading(true);
    setError(null);
    const randomEdition =
      arabicEditions[Math.floor(Math.random() * arabicEditions.length)];

    try {
      let hadiths = editionCache.current.get(randomEdition.link);
      if (!hadiths) {
        const editionResponse = await axios.get(randomEdition.link);
        hadiths = editionResponse.data.hadiths;
        editionCache.current.set(randomEdition.link, hadiths);
      }
      const randomHadithNumber = pickHadithNumber(hadiths);
      handleHadithFetch(hadiths, randomHadithNumber, randomEdition);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load random hadith. Please try again.");
      try {
        const fallbackResponse = await axios.get(
          randomEdition.link.replace(".json", ".min.json"),
        );
        const hadiths = fallbackResponse.data.hadiths;
        const randomHadithNumber = pickHadithNumber(hadiths);
        handleHadithFetch(hadiths, randomHadithNumber, randomEdition);
      } catch (fallbackError) {
        console.error("Error fetching data (fallback):", fallbackError);
        setError(
          "Failed to load random hadith after fallback. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [arabicEditions, handleHadithFetch]);

  useEffect(() => {
    fetchArabicEditions();
  }, [fetchArabicEditions]);

  useEffect(() => {
    if (arabicEditions.length > 0) {
      fetchRandomHadith();
    }
  }, [arabicEditions, fetchRandomHadith]);

  return {
    hadith,
    isLoading,
    error,
    arabicEditions: arabicEditions || [],
    fetchRandomHadith,
  };
};

export default useRandomHadith;
