import { CalculationMethod, PrayerTimes } from "adhan";

/**
 * Calculates prayer times for a given location and returns raw Date objects.
 * @param {Coordinates} coords - The geographic coordinates (latitude, longitude).
 * @returns {Object} Raw Date objects for each prayer time.
 */
export const calculatePrayerTimes = (coords) => {
  const date = new Date();
  const params = CalculationMethod.MuslimWorldLeague();
  const times = new PrayerTimes(coords, date, params);

  return {
    fajr: new Date(times.fajr),
    sunrise: new Date(times.sunrise),
    dhuhr: new Date(times.dhuhr),
    asr: new Date(times.asr),
    maghrib: new Date(times.maghrib),
    isha: new Date(times.isha),
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
 * @returns {Function} Cleanup function to clear the interval.
 */
export const startCountdown = (nextPrayer, setNextPrayerCountdown) => {
  const updateCountdown = () => {
    const now = new Date();
    const diff = nextPrayer.time - now;
    if (diff <= 0) {
      setNextPrayerCountdown("0h 0m 0s"); // Reset countdown when time is up
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

/**
 * Determines Ramadan-specific times (Suhoor and Iftar) and current/next event.
 * @param {Object} rawTimes - Raw Date objects for each prayer time.
 * @param {Date} ramadanStart - Start date of Ramadan.
 * @returns {Object} Object containing current event, next event, and Ramadan day.
 */
export const determineRamadanTimes = (rawTimes, ramadanStart) => {
  const now = new Date();
  const suhoor = new Date(rawTimes.fajr); // Suhoor ends at Fajr
  const iftar = new Date(rawTimes.maghrib);

  let currentEvent = null;
  let nextEvent = null;
  const diffToSuhoor = suhoor - now;
  const diffToIftar = iftar - now;

  if (diffToSuhoor > 0 && diffToSuhoor < 24 * 60 * 60 * 1000) {
    currentEvent = "Fasting";
    nextEvent = { name: "Suhoor", time: suhoor };
  } else if (diffToIftar > 0 && diffToIftar < 24 * 60 * 60 * 1000) {
    currentEvent = "Fasting";
    nextEvent = { name: "Iftar", time: iftar };
  } else if (now > iftar && now < suhoor) {
    currentEvent = "Post-Iftar";
    nextEvent = { name: "Suhoor", time: suhoor };
  } else {
    currentEvent = "Pre-Suhoor";
    nextEvent = { name: "Suhoor", time: suhoor };
  }

  // Calculate Ramadan day (simplified, assumes 30 days)
  const oneDay = 24 * 60 * 60 * 1000;
  const ramadanEnd = new Date(ramadanStart);
  ramadanEnd.setDate(ramadanStart.getDate() + 29); // 30 days total
  let ramadanDay = null;
  if (now >= ramadanStart && now <= ramadanEnd) {
    const daysSinceStart = Math.floor((now - ramadanStart) / oneDay) + 1;
    ramadanDay = daysSinceStart;
  }

  return { currentEvent, nextEvent, ramadanDay, suhoor, iftar };
};

/**
 * Updates and returns the countdown to the next Ramadan event.
 * @param {Object} nextEvent - The next event object with name and time.
 * @param {Function} setNextEventCountdown - State setter for the countdown.
 * @returns {Function} Cleanup function to clear the interval.
 */
export const startRamadanCountdown = (nextEvent, setNextEventCountdown) => {
  const updateCountdown = () => {
    const now = new Date();
    const diff = nextEvent.time - now;
    if (diff <= 0) {
      setNextEventCountdown("0h 0m 0s"); // Reset countdown when time is up
      return;
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    setNextEventCountdown(`${hours}h ${minutes}m ${seconds}s`);
  };

  updateCountdown();
  const interval = setInterval(updateCountdown, 1000);
  return () => clearInterval(interval);
};

export const addNotification = (
  setNotifications,
  message,
  isPermissionMessage = false
) => {
  setNotifications((prev) => [
    ...prev,
    { id: Date.now(), message, isPermissionMessage },
  ]);
};

export const removeNotification = (setNotifications, id) => {
  setNotifications((prev) => prev.filter((notif) => notif.id !== id));
};

export const dismissAllNotifications = (setNotifications) => {
  setNotifications([]);
};

export const requestNotificationPermission = (
  setNotificationPermission,
  addNotification,
  translations,
  language
) => {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission().then((permission) => {
      setNotificationPermission(permission);
      if (permission === "granted") {
        addNotification(translations[language].enableNotifications + "!", true);
      } else {
        addNotification(
          translations[language].enableNotifications +
            " disabled. Using in-app notifications.",
          true
        );
      }
    });
  }
};

export const togglePrayerReminder = (setPrayerReminders, prayer) => {
  setPrayerReminders((prev) => ({
    ...prev,
    [prayer]: !prev[prayer],
  }));
};

export const exportPrayerTimes = (
  prayerTimes,
  ramadanTimes,
  calculationMethod,
  timeZone,
  language,
  addNotification,
  translations
) => {
  if (!prayerTimes) return;
  const data = {
    prayerTimes: {
      fajr: prayerTimes.fajr,
      sunrise: prayerTimes.sunrise,
      dhuhr: prayerTimes.dhuhr,
      asr: prayerTimes.asr,
      maghrib: prayerTimes.maghrib,
      isha: prayerTimes.isha,
    },
    ramadanTimes: ramadanTimes
      ? {
          ramadanDay: ramadanTimes.ramadanDay,
          suhoor: ramadanTimes.suhoor.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone,
          }),
          iftar: ramadanTimes.iftar.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone,
          }),
          currentEvent: ramadanTimes.currentEvent,
        }
      : null,
    calculationMethod,
    timeZone,
    language,
    date: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `prayer-times-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  addNotification(translations[language].exportSuccess, false);
};
