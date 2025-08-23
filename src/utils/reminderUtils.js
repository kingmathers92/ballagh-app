import translations from "./translations";

export const scheduleReminders = (
  prayerTimes,
  nextEvent,
  addNotification,
  prayerReminders,
  notificationPermission,
  currentTime,
  language,
  timeZone
) => {
  if (!prayerTimes) return;

  const now = new Date(currentTime);

  Object.entries(prayerTimes).forEach(([name, time]) => {
    if (prayerReminders[name]) {
      const reminderTime = new Date(time.getTime() - 5 * 60 * 1000); // 5 min before
      if (reminderTime > now) {
        setTimeout(() => {
          if (notificationPermission === "granted") {
            new Notification(`Reminder: ${name} prayer is in 5 minutes`);
          }
          addNotification(`Reminder: ${name} prayer is in 5 minutes`);
        }, reminderTime - now);
      }
    }
  });

  if (nextEvent?.time) {
    const reminderTime = new Date(nextEvent.time.getTime() - 10 * 60 * 1000); // 10 min before
    if (reminderTime > now) {
      setTimeout(() => {
        if (notificationPermission === "granted") {
          new Notification(`Reminder: ${nextEvent.name} in 10 minutes`);
        }
        addNotification(`Reminder: ${nextEvent.name} in 10 minutes`);
      }, reminderTime - now);
    }
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
