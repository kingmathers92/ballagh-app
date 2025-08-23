import translations from "./translations";

export const scheduleReminders = (
  prayerTimes,
  nextEvent,
  addNotification,
  prayerReminders,
  notificationPermission,
  currentTime = new Date(),
  language,
  timeZone
) => {
  const playSound = () => {
    const audio = new Audio("/sounds/notification.mp3");
    audio.play().catch((err) => console.warn("Audio playback failed:", err));
  };

  const vibrate = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  const showBrowserNotification = (message, eventName, eventTime, timeZone) => {
    if (!("Notification" in window)) {
      console.warn("Browser does not support notifications");
      addNotification(
        translations[language].enableNotifications + " not supported",
        true
      );
      playSound();
      vibrate();
      return;
    }

    if (
      notificationPermission === "granted" &&
      document.visibilityState !== "visible"
    ) {
      new Notification(message, {
        body: `Event: ${eventName} at ${eventTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          timeZone,
        })}`,
        icon: "/images/notification-icon.png",
      });
      playSound();
      vibrate();
    } else if (notificationPermission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (
          permission === "granted" &&
          document.visibilityState !== "visible"
        ) {
          new Notification(message, {
            body: `Event: ${eventName} at ${eventTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              timeZone,
            })}`,
            icon: "/images/notification-icon.png",
          });
          playSound();
          vibrate();
        } else {
          addNotification(
            translations[language].enableNotifications +
              " disabled. Using in-app notifications.",
            true
          );
          playSound();
          vibrate();
        }
      });
    } else {
      addNotification(
        translations[language].enableNotifications +
          " disabled. Using in-app notifications.",
        true
      );
      playSound();
      vibrate();
    }
  };

  const now = new Date(currentTime);
  const notificationWindow = 15 * 60 * 1000; // 15 minutes

  // Prayer notifications
  Object.keys(prayerReminders).forEach((prayer) => {
    if (prayerReminders[prayer] && prayerTimes[prayer]) {
      const prayerTime = new Date(prayerTimes[prayer]);
      const timeDiff = prayerTime - now;
      if (timeDiff > 0 && timeDiff <= notificationWindow) {
        const message =
          translations[language].prayers[prayer] + " in 15 minutes!";
        addNotification(message, false);
        showBrowserNotification(
          message,
          translations[language].prayers[prayer],
          prayerTime,
          timeZone
        );
      }
    }
  });

  // Ramadan notifications
  if (nextEvent && nextEvent.time > now) {
    const timeDiff = nextEvent.time - now;
    const message =
      nextEvent.name === "Suhoor"
        ? translations[language].suhoor.replace(
            "{time}",
            nextEvent.time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              timeZone,
            })
          ) + " in 15 minutes!"
        : translations[language].iftar.replace(
            "{time}",
            nextEvent.time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              timeZone,
            })
          ) + " in 5 minutes!";

    if (
      (nextEvent.name === "Suhoor" && timeDiff <= notificationWindow) ||
      (nextEvent.name === "Iftar" && timeDiff <= 5 * 60 * 1000)
    ) {
      addNotification(message, false);
      showBrowserNotification(
        message,
        translations[language][nextEvent.name.toLowerCase()],
        nextEvent.time,
        timeZone
      );
    }
  }
};
