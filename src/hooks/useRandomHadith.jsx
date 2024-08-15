import { useState, useEffect } from "react";
import axios from "axios";

const useRandomHadith = (apiVersion = "1") => {
  const [hadith, setHadith] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [arabicEditions, setArabicEditions] = useState([]);

  const fetchArabicEditions = async () => {
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
    }
  };

  const fetchRandomHadith = async () => {
    if (arabicEditions.length === 0) return;

    setIsLoading(true);
    const randomEdition =
      arabicEditions[Math.floor(Math.random() * arabicEditions.length)];

    try {
      const editionResponse = await axios.get(randomEdition.link);
      const hadiths = editionResponse.data.hadiths;
      const randomHadithNumber =
        Object.keys(hadiths)[
          Math.floor(Math.random() * Object.keys(hadiths).length)
        ];
      const selectedHadith = hadiths[randomHadithNumber];

      setHadith({
        text: selectedHadith.text,
        number: randomHadithNumber,
        collection: randomEdition.book,
        edition: randomEdition.name,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      // Fallback to minified version if non-minified version fails
      try {
        const fallbackResponse = await axios.get(
          randomEdition.link.replace(".json", ".min.json")
        );
        const hadiths = fallbackResponse.data.hadiths;
        const randomHadithNumber =
          Object.keys(hadiths)[
            Math.floor(Math.random() * Object.keys(hadiths).length)
          ];
        const selectedHadith = hadiths[randomHadithNumber];

        setHadith({
          text: selectedHadith.text,
          number: randomHadithNumber,
          collection: randomEdition.book,
          edition: randomEdition.name,
        });
      } catch (fallbackError) {
        console.error("Error fetching data (fallback):", fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArabicEditions();
  }, []);

  useEffect(() => {
    if (arabicEditions.length > 0) {
      fetchRandomHadith();
    }
  }, [arabicEditions]);

  return { hadith, isLoading, fetchRandomHadith };
};

export default useRandomHadith;
