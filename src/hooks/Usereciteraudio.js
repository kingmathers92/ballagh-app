import { useState, useCallback, useMemo } from "react";
import { usePersistedState } from "./usePersistedState";
import {
  RECITERS,
  DEFAULT_RECITER_ID,
  getReciterById,
  getAyahAudioUrl,
} from "../utils/reciters";

/**
 * Manages a playback queue of ayahs for a single <audio> element.
 * Both "play one ayah" and "play the whole surah" are the same mechanism -
 * a queue of one item, or a queue of every ayah in the surah in order.
 *
 * @param {Object} pages - all fetched Quran pages, keyed by page number
 */
export const useReciterAudio = (pages) => {
  const [reciterId, setReciterId] = usePersistedState(
    "reciterId",
    DEFAULT_RECITER_ID
  );
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);

  const reciter = getReciterById(reciterId);
  const currentAyah = queue[queueIndex] || null;

  const audioSrc = useMemo(() => {
    if (!currentAyah) return null;
    return getAyahAudioUrl(
      reciter.folder,
      currentAyah.surahNumber,
      currentAyah.numberInSurah
    );
  }, [currentAyah, reciter.folder]);

  const getSurahAyahs = useCallback(
    (surahNumber) => {
      const all = Object.values(pages || {}).flat();
      return all
        .filter((a) => a.surahNumber === surahNumber)
        .sort((a, b) => a.numberInSurah - b.numberInSurah);
    },
    [pages]
  );

  const playAyah = useCallback((ayah) => {
    setQueue([ayah]);
    setQueueIndex(0);
  }, []);

  const playSurah = useCallback(
    (surahNumber, startFromAyah = null) => {
      const ayahs = getSurahAyahs(surahNumber);
      const startIndex = startFromAyah
        ? Math.max(
            0,
            ayahs.findIndex((a) => a.number === startFromAyah.number)
          )
        : 0;
      setQueue(ayahs);
      setQueueIndex(startIndex);
    },
    [getSurahAyahs]
  );

  const advance = useCallback(() => {
    const canAdvance = queueIndex + 1 < queue.length;
    if (canAdvance) {
      setQueueIndex((i) => i + 1);
    }
    return canAdvance;
  }, [queue.length, queueIndex]);

  const hasNext = queueIndex + 1 < queue.length;

  const stop = useCallback(() => {
    setQueue([]);
    setQueueIndex(0);
  }, []);

  return {
    reciters: RECITERS,
    reciter,
    setReciterId,
    currentAyah,
    audioSrc,
    isActive: queue.length > 0,
    hasNext,
    playAyah,
    playSurah,
    advance,
    stop,
  };
};