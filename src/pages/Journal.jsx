import { useState, useEffect } from "react";

import "../styles/Journal.css";

const ReflectionJournal = () => {
  const [reflection, setReflection] = useState("");
  const [journalEntries, setJournalEntries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Reflection");
  const maxLength = 500;

  // Categories for dropdown
  const categories = [
    "Reflection",
    "Gratitude",
    "Goal",
    "Lesson Learned",
    "Other",
  ];

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem("journalEntries"));
    if (storedEntries) {
      setJournalEntries(storedEntries);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(journalEntries));
  }, [journalEntries]);

  const handleAddEntry = () => {
    if (reflection.trim()) {
      const newEntry = {
        text: reflection,
        category: selectedCategory,
        timestamp: new Date().toLocaleString(),
      };
      const newEntries = [...journalEntries, newEntry];
      setJournalEntries(newEntries);
      setReflection("");
    }
  };

  const handleDeleteEntry = (index) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      const updatedEntries = journalEntries.filter((_, i) => i !== index);
      setJournalEntries(updatedEntries);
    }
  };

  return (
    <div className="reflection-journal">
      <h2>Reflection & Gratitude Journal</h2>
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
        {journalEntries.map((entry, index) => (
          <li key={index} className="journal-entry">
            <span className="entry-category">{entry.category}</span>
            <p>{entry.text}</p>
            <small>{entry.timestamp}</small>
            <button
              className="delete-button"
              onClick={() => handleDeleteEntry(index)}
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
