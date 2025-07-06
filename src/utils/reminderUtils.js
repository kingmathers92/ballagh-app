export const scheduleReminders = (nextEvent, addNotification) => {
  const showBrowserNotification = (message) => {
    if (!("Notification" in window)) {
      console.warn("Browser does not support notifications");
      addNotification(
        "Your browser does not support system notifications",
        true
      );
      return;
    }

    if (Notification.permission === "granted") {
      new Notification(message, {
        body: "Stay prepared for your Ramadan schedule!",
        icon: "/images/okba.jpg",
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(message, {
            body: "Stay prepared for your Ramadan schedule!",
            icon: "/images/okba.jpg",
          });
        } else {
          addNotification(
            "System notifications are disabled. Using in-app notifications.",
            true
          );
        }
      });
    } else {
      addNotification(
        "System notifications are disabled. Using in-app notifications.",
        true
      );
    }
  };

  if (nextEvent.name === "Suhoor" && nextEvent.time > new Date()) {
    const timeUntilSuhoor = nextEvent.time - new Date();
    if (timeUntilSuhoor > 15 * 60 * 1000) {
      setTimeout(() => {
        addNotification("Suhoor ends at Fajr in 15 minutes!");
        showBrowserNotification("Suhoor ends at Fajr in 15 minutes!");
      }, timeUntilSuhoor - 15 * 60 * 1000);
    }
  } else if (nextEvent.name === "Iftar" && nextEvent.time > new Date()) {
    setTimeout(() => {
      addNotification("Time for Iftar is approaching!");
      showBrowserNotification("Time for Iftar is approaching!");
    }, nextEvent.time - new Date() - 5 * 60 * 1000);
  }
};
