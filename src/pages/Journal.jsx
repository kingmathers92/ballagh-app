import { useState, useEffect } from "react";

import "../styles/Journal.css";

const ReflectionJournal = () => {
  const [reflection, setReflection] = useState("");
  const [journalEntries, setJournalEntries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const maxLength = 500;

  // Categories for dropdown (added "All" option)
  const categories = [
    "All",
    "Reflection",
    "Gratitude",
    "Goal",
    "Lesson Learned",
    "Other",
  ];

  // Filter entries based on search term and category
  const filteredEntries = journalEntries.filter((entry) => {
    const matchesText = entry.text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || entry.category === selectedCategory;
    return matchesText && matchesCategory;
  });

  useEffect(() => {
    try {
      const storedEntries = JSON.parse(localStorage.getItem("journalEntries"));
      if (storedEntries) {
        // Migrate entries saved before entries had stable ids.
        const withIds = storedEntries.map((entry) =>
          entry.id ? entry : { ...entry, id: crypto.randomUUID() },
        );
        setJournalEntries(withIds);
      }
    } catch {
      // Corrupted localStorage data - start fresh rather than crash the page.
      setJournalEntries([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(journalEntries));
  }, [journalEntries]);

  const handleAddEntry = () => {
    if (reflection.trim()) {
      const newEntry = {
        id: crypto.randomUUID(),
        text: reflection,
        category: selectedCategory === "All" ? "Reflection" : selectedCategory, // Fallback category
        timestamp: new Date().toLocaleString(),
      };
      setJournalEntries([...journalEntries, newEntry]);
      setReflection("");
    }
  };

  const handleDeleteEntry = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setJournalEntries(journalEntries.filter((entry) => entry.id !== id));
    }
  };

  return (
    <div className="reflection-journal">
      <h2>Reflection & Gratitude Journal</h2>

      <input
        type="text"
        placeholder="Search entries..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="journal-input-container">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-dropdown"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Write your reflection or gratitude here..."
          maxLength={maxLength}
        />
        <div className="char-counter">
          {maxLength - reflection.length} characters remaining
        </div>
      </div>

      <button onClick={handleAddEntry} disabled={!reflection.trim()}>
        Add Entry
      </button>

      <ul className="journal-entries">
        {filteredEntries.map((entry) => (
          <li key={entry.id} className="journal-entry">
            <span className="entry-category">{entry.category}</span>
            <p>{entry.text}</p>
            <small>{entry.timestamp}</small>
            <button
              className="delete-button"
              onClick={() => handleDeleteEntry(entry.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReflectionJournal;
