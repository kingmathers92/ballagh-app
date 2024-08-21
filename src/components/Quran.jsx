import { useState, useEffect } from "react";
import axios from "axios";

function Quran() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuran = async () => {
      try {
        const response = await axios.get(
          "https://api.alquran.cloud/v1/quran/en.asad"
        );
        setChapters(response.data.data.surahs);
      } finally {
        setLoading(false);
      }
    };

    fetchQuran();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="quran-container">
      {chapters.map((chapter) => (
        <div key={chapter.number} className="chapter">
          <h3>{chapter.englishName}</h3>
          {chapter.ayahs.map((ayah) => (
            <p key={ayah.number} className="ayah">
              {ayah.text}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Quran;
