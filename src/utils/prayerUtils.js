import { CalculationMethod, PrayerTimes } from "adhan";

/**
 * Calculates prayer times for a given location and returns raw Date objects.
 * @param {Coordinates} coords - The geographic coordinates (latitude, longitude).
 * @param {string} calculationMethod - The calculation method (e.g., "UmmAlQura", "MuslimWorldLeague", "Egyptian").
 * @param {Date} customTime - Optional custom time for testing.
 * @returns {Object} Raw Date objects for each prayer time.
 */
export const calculatePrayerTimes = (
  coords,
  calculationMethod,
  customTime = new Date()
) => {
  try {
    if (
      !coords ||
      typeof coords.latitude !== "number" ||
      typeof coords.longitude !== "number"
    ) {
      throw new Error(
        "Invalid coordinates: must be an adhan Coordinates object"
      );
    }
    const date = new Date(customTime);
    const params = (() => {
      switch (calculationMethod) {
        case "UmmAlQura":
          return CalculationMethod.UmmAlQura();
        case "Egyptian":
          return CalculationMethod.Egyptian();
        default:
          return CalculationMethod.MuslimWorldLeague();
      }
    })();
    const times = new PrayerTimes(coords, date, params);

    return {
      fajr: new Date(times.fajr),
      sunrise: new Date(times.sunrise),
      dhuhr: new Date(times.dhuhr),
      asr: new Date(times.asr),
      maghrib: new Date(times.maghrib),
      isha: new Date(times.isha),
      location: coords, // Include location for tomorrow's calculations
    };
  } catch (error) {
    console.error("Error calculating prayer times:", error);
    throw error;
  }
};

/**
 * Determines the current and next prayer based on the current time and prayer times.
 * @param {Object} rawTimes - Raw Date objects for each prayer time, including a location property.
 * @param {Date} currentTime - Current time or custom time for testing.
 * @returns {Object} Object containing currentPrayer and nextPrayer.
 */
export const determineCurrentNextPrayer = (
  rawTimes,
  currentTime = new Date()
) => {
  try {
    const now = new Date(currentTime);
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
      const tomorrow = new Date(currentTime);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const params = CalculationMethod.MuslimWorldLeague();
      const tomorrowTimes = new PrayerTimes(
        rawTimes.location,
        tomorrow,
        params
      );
      nextPrayer = { name: "fajr", time: new Date(tomorrowTimes.fajr) };
    } else if (!current) {
      current = "isha";
    }

    return { currentPrayer: current, nextPrayer };
  } catch (error) {
    console.error("Error determining current/next prayer:", error);
    throw error;
  }
};

/**
 * Updates and returns the countdown to the next prayer.
 * @param {Object} nextPrayer - The next prayer object with name and time.
 * @param {Function} setNextPrayerCountdown - State setter for the countdown.
 * @param {string} timeZone - The time zone.
 * @returns {Function} Cleanup function to clear the interval.
 */
export const startCountdown = (
  nextPrayer,
  setNextPrayerCountdown,
  timeZone
) => {
  if (!nextPrayer || !nextPrayer.time) {
    setNextPrayerCountdown("0h 0m 0s");
    return () => {};
  }

  const updateCountdown = () => {
    const now = new Date();
    const diff = nextPrayer.time - now;
    if (diff <= 0) {
      setNextPrayerCountdown("0h 0m 0s");
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
 * @param {Date} currentTime - Current time or custom time for testing.
 * @returns {Object} Object containing current event, next event, and Ramadan day.
 */
export const determineRamadanTimes = (
  rawTimes,
  ramadanStart,
  currentTime = new Date()
) => {
  try {
    const now = new Date(currentTime);
    const suhoor = new Date(rawTimes.fajr);
    const iftar = new Date(rawTimes.maghrib);

    const oneDay = 24 * 60 * 60 * 1000;
    const ramadanEnd = new Date(ramadanStart);
    ramadanEnd.setDate(ramadanStart.getDate() + 29);
    let ramadanDay = null;
    if (now >= ramadanStart && now <= ramadanEnd) {
      ramadanDay = Math.floor((now - ramadanStart) / oneDay) + 1;
    } else {
      return {
        ramadanDay: null,
        suhoor: null,
        iftar: null,
        currentEvent: "Not Ramadan",
        nextEvent: null,
      };
    }

    let currentEvent = null;
    let nextEvent = null;
    const diffToSuhoor = suhoor - now;
    const diffToIftar = iftar - now;

    if (diffToSuhoor > 0 && diffToSuhoor < oneDay) {
      currentEvent = "Fasting";
      nextEvent = { name: "Suhoor", time: suhoor };
    } else if (diffToIftar > 0 && diffToIftar < oneDay) {
      currentEvent = "Fasting";
      nextEvent = { name: "Iftar", time: iftar };
    } else if (now >= iftar && now < suhoor) {
      currentEvent = "Post-Iftar";
      nextEvent = { name: "Suhoor", time: suhoor };
    } else {
      currentEvent = "Pre-Suhoor";
      nextEvent = { name: "Suhoor", time: suhoor };
    }

    return { currentEvent, nextEvent, ramadanDay, suhoor, iftar };
  } catch (error) {
    console.error("Error determining Ramadan times:", error);
    throw error;
  }
};

/**
 * Updates and returns the countdown to the next Ramadan event.
 * @param {Object} nextEvent - The next event object with name and time.
 * @param {Function} setNextEventCountdown - State setter for the countdown.
 * @param {string} timeZone - The time zone.
 * @returns {Function} Cleanup function to clear the interval.
 */
export const startRamadanCountdown = (
  nextEvent,
  setNextEventCountdown,
  timeZone
) => {
  if (!nextEvent || !nextEvent.time) {
    setNextEventCountdown("0h 0m 0s");
    return () => {};
  }

  const updateCountdown = () => {
    const now = new Date();
    const diff = nextEvent.time - now;
    if (diff <= 0) {
      setNextEventCountdown("0h 0m 0s");
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

/**
 * Adds a notification to the state.
 * @param {Function} setNotifications - State setter for notifications.
 * @param {string} message - Notification message.
 * @param {boolean} isPermissionMessage - Whether it's a permission-related notification.
 */
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

/**
 * Removes a notification by ID.
 * @param {Function} setNotifications - State setter for notifications.
 * @param {number} id - Notification ID.
 */
export const removeNotification = (setNotifications, id) => {
  setNotifications((prev) => prev.filter((notif) => notif.id !== id));
};

/**
 * Dismisses all notifications.
 * @param {Function} setNotifications - State setter for notifications.
 */
export const dismissAllNotifications = (setNotifications) => {
  setNotifications([]);
};

/**
 * Requests notification permission.
 * @param {Function} setNotificationPermission - State setter for permission.
 * @param {Function} addNotification - Function to add notifications.
 * @param {Object} translations - Translation object.
 * @param {string} language - Current language.
 */
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

/**
 * Toggles a prayer reminder.
 * @param {Function} setPrayerReminders - State setter for prayer reminders.
 * @param {string} prayer - Prayer name (e.g., "fajr").
 */
export const togglePrayerReminder = (setPrayerReminders, prayer) => {
  setPrayerReminders((prev) => ({
    ...prev,
    [prayer]: !prev[prayer],
  }));
};

/**
 * Exports prayer times to a JSON file.
 * @param {Object} prayerTimes - Formatted prayer times.
 * @param {Object} ramadanTimes - Ramadan times data.
 * @param {string} calculationMethod - Calculation method.
 * @param {string} timeZone - Time zone.
 * @param {string} language - Language.
 * @param {Function} addNotification - Function to add notifications.
 * @param {Object} translations - Translation object.
 */
export const exportPrayerTimes = (
  prayerTimes,
  ramadanTimes,
  calculationMethod,
  timeZone,
  language,
  addNotification,
  translations
) => {
  if (!prayerTimes) {
    addNotification(translations[language].noPrayerTimes, true);
    return;
  }
  const data = {
    prayerTimes: {
      fajr: prayerTimes.fajr.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
      }),
      sunrise: prayerTimes.sunrise.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
      }),
      dhuhr: prayerTimes.dhuhr.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
      }),
      asr: prayerTimes.asr.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
      }),
      maghrib: prayerTimes.maghrib.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
      }),
      isha: prayerTimes.isha.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
      }),
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
