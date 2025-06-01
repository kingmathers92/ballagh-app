import axios from "axios";

// base URL from environment variable with fallback
const API_BASE_URL =
  import.meta.env.VITE_QURAN_API_URL || "http://api.alquran.cloud/v1";

/**
 * Fetches the entire Quran in Uthmani script.
 * @returns {Promise<Array<Object>|null>} array of Surahs or null if the fetch fails.
 * @throws {Error} If the API request fails.
 */
export const fetchQuranData = async () => {
  try {
    // Check if data is cached in IndexedDB
    const cachedData = await getCachedQuranData();
    if (cachedData) {
      return cachedData;
    }

    // Configure Axios with timeout and retries
    const instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    const response = await withRetry(() =>
      instance.get("/quran/quran-uthmani")
    );

    const surahs = response.data?.data?.surahs || null;
    if (!surahs) {
      throw new Error("No Surah data found in API response");
    }

    // Cache the data for offline use
    await cacheQuranData(surahs);
    return surahs;
  } catch (error) {
    const message = handleApiError(error, "fetching Quran data");
    throw new Error(message);
  }
};

/**
 * Fetches audio for a specific Surah by Sheikh Mishary Alafasy.
 * @param {number} surahNumber - The Surah number (1-114).
 * @returns {Promise<string>} URL of the audio file for the first Ayah.
 * @throws {Error} If the API request fails or Surah number is invalid.
 */
export const fetchSurahAudio = async (surahNumber) => {
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    throw new Error("Invalid Surah number. Must be between 1 and 114.");
  }

  try {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 5000,
    });

    const response = await withRetry(() =>
      instance.get(`/surah/${surahNumber}/ar.alafasy`)
    );

    const audioUrl = response.data?.data?.ayahs?.[0]?.audio;
    if (!audioUrl) {
      throw new Error(`No audio found for Surah ${surahNumber}`);
    }

    return audioUrl;
  } catch (error) {
    const message = handleApiError(error, "fetching Surah audio");
    throw new Error(message);
  }
};

// Helper function to handle API errors with detailed messages
const handleApiError = (error, operation) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;
      if (status === 429) {
        return `Rate limit exceeded while ${operation}. Please try again later.`;
      }
      return `Failed to ${operation}: Server error (${status}) - ${
        error.response.data?.message || "Unknown error"
      }`;
    } else if (error.request) {
      return `Failed to ${operation}: Network error. Please check your internet connection.`;
    }
  }
  return `Failed to ${operation}: ${error.message}`;
};

// Retry logic for API calls
const withRetry = async (fn, retries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }
};

// IndexedDB caching for Quran data
const dbPromise =
  typeof window !== "undefined" && typeof window.indexedDB !== "undefined"
    ? import("idb").then(({ openDB }) =>
        openDB("quranDB", 1, {
          upgrade(db) {
            db.createObjectStore("quranData", { keyPath: "id" });
          },
        })
      )
    : Promise.resolve(null);

const cacheQuranData = async (surahs) => {
  const db = await dbPromise;
  if (!db) return;
  const tx = db.transaction("quranData", "readwrite");
  await tx.store.put({ id: "quran-uthmani", surahs });
  await tx.done;
};

const getCachedQuranData = async () => {
  const db = await dbPromise;
  if (!db) return null;
  const data = await db.get("quranData", "quran-uthmani");
  return data?.surahs || null;
};
