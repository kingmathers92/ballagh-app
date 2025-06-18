import { useEffect, useState } from "react";
import {
  calculatePrayerTimes,
  determineCurrentNextPrayer,
  startCountdown,
  determineRamadanTimes,
  startRamadanCountdown,
} from "../utils/prayerUtils";
import { scheduleReminders } from "../utils/reminderUtils";

export const usePrayerTimes = (coords, ramadanStart) => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [nextPrayerCountdown, setNextPrayerCountdown] = useState(null);
  const [ramadanTimes, setRamadanTimes] = useState(null);
  const [nextEventCountdown, setNextEventCountdown] = useState(null);

  useEffect(() => {
    if (!coords) return;

    const updateTimes = () => {
      const times = calculatePrayerTimes(coords);
      setPrayerTimes({
        fajr: times.fajr.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sunrise: times.sunrise.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        dhuhr: times.dhuhr.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        asr: times.asr.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        maghrib: times.maghrib.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isha: times.isha.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
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
      console.log("Raw times with dates:", rawTimes);

      const { currentPrayer, nextPrayer } =
        determineCurrentNextPrayer(rawTimes);
      setCurrentPrayer(currentPrayer);
      const prayerCleanup = startCountdown(
        nextPrayer,
        setNextPrayerCountdown,
        updateTimes
      );

      const ramadanData = determineRamadanTimes(rawTimes, ramadanStart);
      setRamadanTimes(ramadanData);
      const eventCleanup = startRamadanCountdown(
        ramadanData.nextEvent,
        setNextEventCountdown,
        updateTimes
      );

      scheduleReminders(ramadanData.nextEvent, updateTimes);

      return () => {
        prayerCleanup && prayerCleanup();
        eventCleanup && eventCleanup();
      };
    };

    const cleanup = updateTimes();
    return () => cleanup && cleanup();
  }, [coords, ramadanStart]);

  return {
    prayerTimes,
    currentPrayer,
    nextPrayerCountdown,
    ramadanTimes,
    nextEventCountdown,
  };
};
