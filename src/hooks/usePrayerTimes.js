import { useState, useEffect } from "react";
import {
  calculatePrayerTimes,
  determineCurrentNextPrayer,
  startCountdown,
  determineRamadanTimes,
  startRamadanCountdown,
} from "../utils/prayerUtils.js";

export const usePrayerTimes = (
  coords,
  ramadanStart,
  addNotification,
  notificationPermission,
  calculationMethod,
  timeZone,
  prayerReminders,
  language
) => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [nextPrayerCountdown, setNextPrayerCountdown] = useState("0h 0m 0s");
  const [ramadanTimes, setRamadanTimes] = useState(null);
  const [nextEventCountdown, setNextEventCountdown] = useState("0h 0m 0s");
  const [loading, setLoading] = useState(true);
  const [prayerError, setPrayerError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    let prayerInterval, ramadanInterval;
    const updatePrayerTimes = () => {
      if (!coords) {
        setPrayerError("No coordinates provided");
        setLoading(false);
        return;
      }

      try {
        const rawTimes = calculatePrayerTimes(coords, calculationMethod);
        setPrayerTimes(rawTimes);

        const { currentPrayer, nextPrayer } =
          determineCurrentNextPrayer(rawTimes);
        setCurrentPrayer(currentPrayer);

        prayerInterval = startCountdown(
          nextPrayer,
          setNextPrayerCountdown,
          timeZone
        );

        const ramadanData = determineRamadanTimes(rawTimes, ramadanStart);
        setRamadanTimes(ramadanData);

        ramadanInterval = startRamadanCountdown(
          ramadanData.nextEvent,
          setNextEventCountdown,
          timeZone
        );

        // if (notificationPermission !== "denied") {
        //   scheduleReminders(
        //     rawTimes,
        //     ramadanData.nextEvent,
        //     addNotification,
        //     prayerReminders,
        //     notificationPermission,
        //     new Date(),
        //     language,
        //     timeZone
        //   );
        // }

        setPrayerError(null);
        setLoading(false);
      } catch (error) {
        setPrayerError(error.message);
        setLoading(false);
      }
    };

    updatePrayerTimes();
    const interval = setInterval(updatePrayerTimes, 60 * 1000);
    return () => {
      clearInterval(interval);
      if (prayerInterval) prayerInterval();
      if (ramadanInterval) ramadanInterval();
    };
  }, [
    coords,
    calculationMethod,
    timeZone,
    prayerReminders,
    notificationPermission,
    language,
    ramadanStart,
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
