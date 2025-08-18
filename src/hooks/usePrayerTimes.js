import { useEffect, useState } from "react";
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
  const [nextPrayerCountdown, setNextPrayerCountdown] = useState(null);
  const [ramadanTimes, setRamadanTimes] = useState(null);
  const [nextEventCountdown, setNextEventCountdown] = useState(null);
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
    if (!coords || !addNotification) {
      setLoading(false);
      setPrayerError("Location or notification function missing");
      return;
    }

    const updateTimes = async () => {
      setLoading(true);
      try {
        const currentTime = customTime || new Date();
        const times = calculatePrayerTimes(
          coords,
          calculationMethod,
          timeZone,
          currentTime
        );

        setPrayerTimes({
          fajr: times.fajr.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone,
          }),
          sunrise: times.sunrise.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone,
          }),
          dhuhr: times.dhuhr.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone,
          }),
          asr: times.asr.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone,
          }),
          maghrib: times.maghrib.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone,
          }),
          isha: times.isha.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone,
          }),
        });

        const rawTimes = {
          fajr: times.fajr,
          sunrise: times.sunrise,
          dhuhr: times.dhuhr,
          asr: times.asr,
          maghrib: times.maghrib,
          isha: times.isha,
          location: coords,
        };

        const { currentPrayer, nextPrayer } = determineCurrentNextPrayer(
          rawTimes,
          currentTime
        );
        setCurrentPrayer(currentPrayer);

        let prayerCleanup = null;
        if (!triggerPrayer) {
          prayerCleanup = startCountdown(
            nextPrayer,
            setNextPrayerCountdown,
            timeZone
          );
        }

        const ramadanData = determineRamadanTimes(
          rawTimes,
          ramadanStart,
          currentTime
        );
        setRamadanTimes(ramadanData);

        let eventCleanup = null;
        if (!triggerPrayer) {
          eventCleanup = startRamadanCountdown(
            ramadanData.nextEvent,
            setNextEventCountdown,
            timeZone
          );
        }

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
            translations
          );
        }

        setPrayerError(null);
        setLoading(false);

        return () => {
          prayerCleanup && prayerCleanup();
          eventCleanup && eventCleanup();
        };
      } catch (error) {
        setPrayerError("Failed to calculate prayer times: " + error.message);
        setLoading(false);
      }
    };

    updateTimes();
    return () => {};
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
