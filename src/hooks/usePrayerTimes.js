import { useState, useEffect } from "react";
import {
  calculatePrayerTimes,
  determineCurrentNextPrayer,
  startCountdown,
  determineRamadanTimes,
  startRamadanCountdown,
} from "../utils/prayerUtils";
import { scheduleReminders } from "../utils/reminderUtils";
import translations from "../utils/translations";

export const usePrayerTimes = (
  coords,
  ramadanStart,
  addNotification,
  notificationPermission,
  calculationMethod,
  timeZone,
  prayerReminders,
  language,
  customTime = null,
  triggerPrayer = ""
) => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [nextPrayerCountdown, setNextPrayerCountdown] = useState("");
  const [ramadanTimes, setRamadanTimes] = useState(null);
  const [nextEventCountdown, setNextEventCountdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [prayerError, setPrayerError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);
    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (!coords) {
      setLoading(false);
      setPrayerError(translations[language].noLocation);
      return;
    }

    setLoading(true);
    try {
      const currentTime = customTime || new Date();
      const rawTimes = calculatePrayerTimes(
        coords,
        calculationMethod,
        currentTime
      );
      setPrayerTimes(rawTimes);

      const { currentPrayer, nextPrayer } = determineCurrentNextPrayer(
        rawTimes,
        currentTime
      );
      setCurrentPrayer(currentPrayer);

      const prayerCleanup = startCountdown(
        nextPrayer,
        setNextPrayerCountdown,
        timeZone
      );
      const ramadanData = determineRamadanTimes(
        rawTimes,
        ramadanStart,
        currentTime
      );
      setRamadanTimes(ramadanData);

      const eventCleanup = startRamadanCountdown(
        ramadanData.nextEvent,
        setNextEventCountdown,
        timeZone
      );

      if (triggerPrayer && prayerReminders[triggerPrayer]) {
        addNotification(
          translations[language].testNotification.replace(
            "{prayer}",
            translations[language].prayers[triggerPrayer]
          ),
          false
        );
      } else if (notificationPermission !== "denied" && !triggerPrayer) {
        scheduleReminders(
          rawTimes,
          ramadanData.nextEvent,
          addNotification,
          prayerReminders,
          notificationPermission,
          currentTime,
          language,
          timeZone
        );
      }

      setLoading(false);
      setPrayerError(null);

      return () => {
        prayerCleanup && prayerCleanup();
        eventCleanup && eventCleanup();
      };
    } catch (error) {
      setPrayerError(
        translations[language].errorCalculatingPrayerTimes +
          ": " +
          error.message
      );
      setLoading(false);
    }
  }, [
    coords,
    ramadanStart,
    addNotification,
    notificationPermission,
    calculationMethod,
    timeZone,
    prayerReminders,
    language,
    customTime,
    triggerPrayer,
  ]);

  return {
    prayerTimes,
    currentPrayer,
    nextPrayerCountdown,
    ramadanTimes,
    nextEventCountdown,
    loading,
    prayerError,
    isOffline,
  };
};
