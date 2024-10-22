import axios from "axios";

export const fetchQuranData = async () => {
  try {
    const response = await axios.get(
      "http://api.alquran.cloud/v1/quran/quran-uthmani"
    );
    return response.data?.data?.surahs || null;
  } catch (error) {
    throw new Error("Error fetching Quran data");
  }
};

export const fetchSurahAudio = async (surahNumber) => {
  try {
    const response = await axios.get(
      `http://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`
    );
    return response.data?.data?.ayahs[0]?.audio || "";
  } catch (error) {
    throw new Error("Error fetching surah audio");
  }
};
