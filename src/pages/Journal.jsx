import { useState, useEffect } from "react";

import "../styles/Journal.css";

const ReflectionJournal = () => {
  const [reflection, setReflection] = useState("");
  const [journalEntries, setJournalEntries] = useState([]);

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem("journalEntries"));
    if (storedEntries) {
      setJournalEntries(storedEntries);
    }
  }, []);

  const handleAddEntry = () => {
    if (reflection.trim()) {
      const newEntries = [...journalEntries, reflection];
      setJournalEntries(newEntries);
      localStorage.setItem("journalEntries", JSON.stringify(newEntries));
      setReflection("");
    }
  };

  const handleDeleteEntry = (index) => {
    const updatedEntries = journalEntries.filter((_, i) => i !== index);
    setJournalEntries(updatedEntries);
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
  };

  return (
    <div className="reflection-journal">
      <h2>Reflection & Gratitude Journal</h2>
      <textarea
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        placeholder="Write your reflection or gratitude here..."
      />
      <button onClick={handleAddEntry}>Add Entry</button>
      <ul>
        {journalEntries.map((entry, index) => (
          <li key={index}>
            {entry}
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
