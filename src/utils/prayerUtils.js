import { CalculationMethod, PrayerTimes } from "adhan";

/**
 * Calculates prayer times for a given location and returns formatted times.
 * @param {Coordinates} coords - The geographic coordinates (latitude, longitude).
 * @returns {Object} Formatted prayer times (fajr, sunrise, dhuhr, asr, maghrib, isha).
 */
export const calculatePrayerTimes = (coords) => {
  const date = new Date();
  const params = CalculationMethod.MuslimWorldLeague();
  const times = new PrayerTimes(coords, date, params);

  return {
    fajr: new Date(times.fajr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    sunrise: new Date(times.sunrise).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    dhuhr: new Date(times.dhuhr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    asr: new Date(times.asr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    maghrib: new Date(times.maghrib).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isha: new Date(times.isha).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

/**
 * Determines the current and next prayer based on the current time and prayer times.
 * @param {Object} rawTimes - Raw Date objects for each prayer time, including a location property.
 * @returns {Object} Object containing currentPrayer and nextPrayer.
 */
export const determineCurrentNextPrayer = (rawTimes) => {
  const now = new Date();
  let current = null;
  let nextPrayer = null;
  const prayerOrder = [
    { name: "fajr", time: rawTimes.fajr },
    { name: "sunrise", time: rawTimes.sunrise },
    { name: "dhuhr", time: rawTimes.dhuhr },
    { name: "asr", time: rawTimes.asr },
    { name: "maghrib", time: rawTimes.maghrib },
    { name: "isha", time: rawTimes.isha },
  ];

  for (let i = 0; i < prayerOrder.length; i++) {
    if (now < prayerOrder[i].time) {
      nextPrayer = prayerOrder[i];
      if (i > 0) {
        current = prayerOrder[i - 1].name;
      }
      break;
    }
  }

  if (!nextPrayer) {
    current = "isha";
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const params = CalculationMethod.MuslimWorldLeague();
    const tomorrowTimes = new PrayerTimes(rawTimes.location, tomorrow, params);
    nextPrayer = { name: "fajr", time: new Date(tomorrowTimes.fajr) };
  } else if (!current) {
    current = "isha"; // Before Fajr, consider Isha as current
  }

  return { currentPrayer: current, nextPrayer };
};

/**
 * Updates and returns the countdown to the next prayer.
 * @param {Object} nextPrayer - The next prayer object with name and time.
 * @param {Function} setNextPrayerCountdown - State setter for the countdown.
 * @param {Function} recalculateCallback - Callback to recalculate prayer times.
 * @returns {Function} Cleanup function to clear the interval.
 */
export const startCountdown = (
  nextPrayer,
  setNextPrayerCountdown,
  recalculateCallback
) => {
  const updateCountdown = () => {
    const now = new Date();
    const diff = nextPrayer.time - now;
    if (diff <= 0) {
      recalculateCallback(); // Recalculating if next prayer has passed
      return;
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    setNextPrayerCountdown(`${hours}h ${minutes}m ${seconds}s`);
  };

  updateCountdown();
  const interval = setInterval(updateCountdown, 1000);
  return () => clearInterval(interval);
};
