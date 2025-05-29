import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useRandomHadith = (apiVersion = "1") => {
  const [hadith, setHadith] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [arabicEditions, setArabicEditions] = useState([]);

  const fetchArabicEditions = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@${apiVersion}/editions.json`
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

  const handleHadithFetch = (hadiths, randomHadithNumber, randomEdition) => {
    const selectedHadith = hadiths[randomHadithNumber];

    const deduplicatedGrades = selectedHadith.grades?.filter(
      (grade, index, self) =>
        index ===
        self.findIndex(
          (g) =>
            g.grade === grade.grade &&
            (g.scholar || "Unknown") === (grade.scholar || "Unknown")
        )
    );

    setHadith({
      text: selectedHadith.text,
      number: randomHadithNumber,
      collection: randomEdition.book,
      edition: randomEdition.name,
      grades: deduplicatedGrades || [],
    });
  };

  const fetchRandomHadith = useCallback(async () => {
    if (arabicEditions.length === 0) return;

    setIsLoading(true);
    setError(null);
    const randomEdition =
      arabicEditions[Math.floor(Math.random() * arabicEditions.length)];

    try {
      const editionResponse = await axios.get(randomEdition.link);
      const hadiths = editionResponse.data.hadiths;
      const randomHadithNumber =
        Object.keys(hadiths)[
          Math.floor(Math.random() * Object.keys(hadiths).length)
        ];
      handleHadithFetch(hadiths, randomHadithNumber, randomEdition);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load random hadith. Please try again.");
      try {
        const fallbackResponse = await axios.get(
          randomEdition.link.replace(".json", ".min.json")
        );
        const hadiths = fallbackResponse.data.hadiths;
        const randomHadithNumber =
          Object.keys(hadiths)[
            Math.floor(Math.random() * Object.keys(hadiths).length)
          ];
        handleHadithFetch(hadiths, randomHadithNumber, randomEdition);
      } catch (fallbackError) {
        console.error("Error fetching data (fallback):", fallbackError);
        setError(
          "Failed to load random hadith after fallback. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [arabicEditions]);

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
