import { useState, useEffect } from "react";
import {
  calculatePrayerTimes,
  determineCurrentNextPrayer,
  startCountdown,
  determineRamadanTimes,
  startRamadanCountdown,
} from "../utils/prayerUtils";

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

      // Add 15-minute pre-Suhoor reminder
      if (
        ramadanData.nextEvent.name === "Suhoor" &&
        ramadanData.nextEvent.time > new Date()
      ) {
        const timeUntilSuhoor = ramadanData.nextEvent.time - new Date();
        if (timeUntilSuhoor > 15 * 60 * 1000) {
          setTimeout(
            () => alert("Suhoor ends at Fajr in 15 minutes!"),
            timeUntilSuhoor - 15 * 60 * 1000
          );
        }
      } else if (
        ramadanData.nextEvent.name === "Iftar" &&
        ramadanData.nextEvent.time > new Date()
      ) {
        setTimeout(
          () => alert("Time for Iftar is approaching!"),
          ramadanData.nextEvent.time - new Date() - 5 * 60 * 1000
        );
      }

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
