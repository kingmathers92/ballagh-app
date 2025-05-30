import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import Pagination from "../components/Pagination";

import "../styles/Search.css";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editions, setEditions] = useState([]);
  const [selectedEdition, setSelectedEdition] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingEditions, setLoadingEditions] = useState(false);
  const resultsPerPage = 5;

  const fetchHadithData = async (editionLink) => {
    const response = await axios.get(editionLink);
    return response.data.hadiths;
  };

  const formatHadithResults = (hadiths, edition) =>
    Object.values(hadiths).map((hadith) => ({
      text: hadith.text,
      collection: edition.book,
      edition: edition.name,
      grades: hadith.grades || [],
      number: hadith.number || "Unknown",
    }));

  useEffect(() => {
    const fetchEditions = async () => {
      setLoadingEditions(true);
      try {
        const response = await axios.get(
          `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions.json`
        );
        const editionList = [];
        Object.values(response.data).forEach((book) => {
          book.collection.forEach((edition) => {
            editionList.push({
              ...edition,
              link: edition.link.replace(".min.json", ".json"),
            });
          });
        });
        setEditions(editionList);
      } catch (error) {
        console.error("Error fetching editions:", error);
      } finally {
        setLoadingEditions(false);
      }
    };

    fetchEditions();
  }, []);

  const searchHadith = async () => {
    if (!query.trim()) {
      setError("Please enter a search term.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      let allResults = [];
      if (selectedEdition === "all") {
        const editionRequests = editions.map((edition) =>
          axios.get(edition.link)
        );
        const responses = await Promise.allSettled(editionRequests);

        responses.forEach((response, index) => {
          if (response.status === "fulfilled") {
            const hadiths = response.value.data.hadiths;
            const formattedResults = formatHadithResults(
              hadiths,
              editions[index]
            );
            const filteredResults = formattedResults.filter((result) =>
              result.text.toLowerCase().includes(query.toLowerCase())
            );
            allResults = [...allResults, ...filteredResults];
          }
        });
      } else {
        const edition = editions.find(
          (edition) => edition.name === selectedEdition
        );
        if (edition) {
          const hadiths = await fetchHadithData(edition.link);
          const formattedResults = formatHadithResults(hadiths, edition);
          const filteredResults = formattedResults.filter((result) =>
            result.text.toLowerCase().includes(query.toLowerCase())
          );
          allResults = [...filteredResults];
        }
      }
      setResults(allResults);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching Hadiths:", error);
      setError(
        "An error occurred while fetching Hadiths. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading && query.trim() && selectedEdition) {
      searchHadith();
    }
  };

  // Calculating results for the current page
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  const nextPage = () => {
    if (currentPage < Math.ceil(results.length / resultsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Search Hadith</h2>
      <div className="filters">
        {loadingEditions ? (
          <div className="spinner-container">
            <Spinner />
          </div>
        ) : (
          <select
            className="input"
            value={selectedEdition}
            onChange={(e) => setSelectedEdition(e.target.value)}
          >
            <option value="all">All Editions</option>
            {editions.map((edition, index) => (
              <option key={index} value={edition.name}>
                {edition.name} ({edition.book})
              </option>
            ))}
          </select>
        )}
      </div>
      <input
        className="input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter search term"
        disabled={!selectedEdition}
      />
      <button
        className="button"
        onClick={searchHadith}
        disabled={loading || !query.trim() || !selectedEdition}
      >
        {loading ? <Spinner /> : "Search"}
      </button>

      {error && <p className="error">{error}</p>}

      {currentResults.map((result, index) => (
        <div key={index} className="hadith-container">
          <p className="hadith-text">{result.text}</p>
          <p className="hadith-source">
            Collection: {result.collection}, Edition: {result.edition}, Hadith
            Number: {result.number || "Unknown"}
          </p>
          <p className="hadith-grades">
            Grades:{" "}
            {result.grades?.length > 0
              ? result.grades.map((grade, i) => (
                  <span key={i}>
                    {grade.name} ({grade.grade})
                    {i < result.grades.length - 1 ? ", " : ""}
                  </span>
                ))
              : "Unknown"}
          </p>
        </div>
      ))}

      <Pagination
        onPrev={prevPage}
        onNext={nextPage}
        isPrevDisabled={currentPage === 1}
        isNextDisabled={
          currentPage >= Math.ceil(results.length / resultsPerPage)
        }
      />
    </div>
  );
}

export default Search;
