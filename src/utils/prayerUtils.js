import { CalculationMethod, PrayerTimes } from "adhan";

export const calculatePrayerTimes = (coords, calculationMethod) => {
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
    const date = new Date();
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
      location: coords,
    };
  } catch (error) {
    console.error("Error calculating prayer times:", error);
    throw error;
  }
};

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
          suhoor: ramadanTimes.suhoor?.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone,
          }),
          iftar: ramadanTimes.iftar?.toLocaleTimeString([], {
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
