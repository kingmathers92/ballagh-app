export const scheduleReminders = (nextEvent, addNotification) => {
  const playSound = () => {
    const audio = new Audio("/sounds/notification.mp3");
    audio.play().catch((err) => console.warn("Audio playback failed:", err));
  };

  const vibrate = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  const showBrowserNotification = (message) => {
    if (!("Notification" in window)) {
      console.warn("Browser does not support notifications");
      addNotification(
        "Your browser does not support system notifications",
        true
      );
      playSound();
      vibrate();
      return;
    }

    if (
      Notification.permission === "granted" &&
      document.visibilityState !== "visible"
    ) {
      new Notification(message, {
        body: `Event: ${nextEvent.name} at ${nextEvent.time.toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )}`,
        icon: "/images/notification-icon.png",
      });
      playSound();
      vibrate();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (
          permission === "granted" &&
          document.visibilityState !== "visible"
        ) {
          new Notification(message, {
            body: `Event: ${
              nextEvent.name
            } at ${nextEvent.time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`,
            icon: "/images/notification-icon.png",
          });
          playSound();
          vibrate();
        } else {
          addNotification(
            "System notifications are disabled. Using in-app notifications.",
            true
          );
          playSound();
          vibrate();
        }
      });
    } else {
      addNotification(
        "System notifications are disabled. Using in-app notifications.",
        true
      );
      playSound();
      vibrate();
    }
  };

  if (nextEvent.name === "Suhoor" && nextEvent.time > new Date()) {
    const timeUntilSuhoor = nextEvent.time - new Date();
    if (timeUntilSuhoor > 15 * 60 * 1000) {
      setTimeout(() => {
        addNotification("Suhoor ends at Fajr in 15 minutes!");
        showBrowserNotification("Suhoor ends at Fajr in 15 minutes!");
        playSound();
        vibrate();
      }, timeUntilSuhoor - 15 * 60 * 1000);
    }
  } else if (nextEvent.name === "Iftar" && nextEvent.time > new Date()) {
    setTimeout(() => {
      addNotification("Time for Iftar is approaching!");
      showBrowserNotification("Time for Iftar is approaching!");
      playSound();
      vibrate();
    }, nextEvent.time - new Date() - 5 * 60 * 1000);
  }
};
