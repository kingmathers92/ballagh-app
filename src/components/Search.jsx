import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editions, setEditions] = useState([]);
  const [selectedEdition, setSelectedEdition] = useState("all");

  useEffect(() => {
    const fetchEditions = async () => {
      if (!query.trim()) {
        setError("Please enter a search term.");
        return;
      }

      setLoading(true);
      setError(null);
      setResults([]);

      try {
        const response = await axios.get(
          `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions.json`
        );
        console.log("Editions API response:", response.data);
        const editionList = [];
        Object.values(response.data).forEach((book) => {
          book.collection.forEach((edition) => {
            editionList.push({
              ...edition,
              link: edition.link.replace(".min.json", ".json"),
            });
          });
        });
        console.log("Processed edition list:", editionList);
        setEditions(editionList);
      } catch (error) {
        console.error("Error fetching editions:", error);
      }
    };

    fetchEditions();
  }, []);

  const searchHadith = async () => {
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      let allResults = [];
      if (selectedEdition === "all") {
        const editionRequests = editions.map((edition) =>
          axios.get(edition.link)
        );
        const responses = await Promise.all(editionRequests);
        console.log("Hadith API responses for all editions:", responses);

        responses.forEach((response, index) => {
          const hadiths = response.data.hadiths;
          const filteredHadiths = Object.values(hadiths).filter((hadith) =>
            hadith.text.toLowerCase().includes(query.toLowerCase())
          );
          const formattedResults = filteredHadiths.map((hadith) => ({
            text: hadith.text,
            collection: editions[index].book,
            edition: editions[index].name,
            grades: hadith.grades || [], // Default to an empty array if undefined
            number: hadith.number || "Unknown", // Default to "Unknown" if number is not defined
          }));
          allResults = [...allResults, ...formattedResults];
        });
      } else {
        const edition = editions.find(
          (edition) => edition.name === selectedEdition
        );
        if (edition) {
          const response = await axios.get(edition.link);
          const hadiths = response.data.hadiths;
          const filteredHadiths = Object.values(hadiths).filter((hadith) =>
            hadith.text.toLowerCase().includes(query.toLowerCase())
          );
          const formattedResults = filteredHadiths.map((hadith) => ({
            text: hadith.text,
            collection: edition.book,
            edition: edition.name,
            grades: hadith.grades || [], // Default to an empty array if undefined
            number: hadith.number || "Unknown", // Default to "Unknown" if number is not defined
          }));
          allResults = [...allResults, ...formattedResults];
        }
      }
      setResults(allResults);
      console.log("Search results after searching Hadith:", allResults);
    } catch (error) {
      console.error("Error fetching Hadiths:", error);
      setError(
        "An error occurred while fetching Hadiths. Please try again later."
      );
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2 className="title">Search Hadith</h2>
      <div className="filters">
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
      </div>
      <input
        className="input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter search term"
        disabled={!selectedEdition}
      />
      <button
        className="button"
        onClick={searchHadith}
        disabled={!selectedEdition}
      >
        {loading ? <Spinner /> : "Search"}
      </button>
      {error && <p className="error">{error}</p>}

      {results.map((result, index) => (
        <div key={index} className="hadith-container">
          <p className="hadith-text">{result.text}</p>
          <p className="hadith-source">
            Collection: {result.collection}, Edition: {result.edition}, Hadith
            Number: {result.number || "Unknown"}
          </p>
          <p className="hadith-grades">
            Grades:{" "}
            {result.grades && result.grades.length > 0
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
    </div>
  );
}

export default Search;
