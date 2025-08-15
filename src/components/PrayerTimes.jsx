import { useState } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { usePrayerTimes } from "../hooks/usePrayerTimes";
import Notification from "../components/Notification";

import "../styles/PrayerTimes.css";

function PrayerTimesView() {
  const { location, error } = useGeolocation();
  const ramadanStart = new Date("2025-03-01");
  const [notifications, setNotifications] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState(
    "Notification" in window ? Notification.permission : "denied"
  );

  const addNotification = (message, isPermissionMessage = false) => {
    setNotifications((prev) => [
      ...prev,
      { id: Date.now(), message, isPermissionMessage },
    ]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const dismissAllNotifications = () => {
    setNotifications([]);
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
        if (permission === "granted") {
          addNotification("System notifications enabled!", true);
        } else {
          addNotification(
            "System notifications are disabled. Using in-app notifications.",
            true
          );
        }
      });
    }
  };

  const {
    prayerTimes,
    currentPrayer,
    nextPrayerCountdown,
    ramadanTimes,
    nextEventCountdown,
    loading,
    prayerError,
  } = usePrayerTimes(
    location,
    ramadanStart,
    addNotification,
    notificationPermission
  );

  return (
    <div className="container">
      <h2 className="title">Prayer & Ramadan Times</h2>
      {loading && <div className="loading">Loading prayer times...</div>}
      {error && <div className="error">{error}</div>}
      {prayerError && <div className="error">{prayerError}</div>}
      {notificationPermission === "default" && (
        <button
          className="button"
          onClick={requestNotificationPermission}
          style={{ marginBottom: "15px" }}
          aria-label="Enable system notifications"
        >
          Enable Notifications
        </button>
      )}
      {notifications.length > 1 && (
        <button
          className="button"
          onClick={dismissAllNotifications}
          style={{ marginBottom: "15px" }}
          aria-label="Dismiss all notifications"
        >
          Dismiss All Notifications
        </button>
      )}
      {location && (
        <p className="description">
          Location: Lat {location.latitude.toFixed(4)}, Lon{" "}
          {location.longitude.toFixed(4)}
        </p>
      )}
      {nextPrayerCountdown && (
        <p className="countdown">
          Time until next prayer: {nextPrayerCountdown}
        </p>
      )}
      {prayerTimes && (
        <div
          className="prayer-times"
          role="region"
          aria-label="Daily prayer times"
        >
          <p className={currentPrayer === "fajr" ? "current-prayer" : ""}>
            <span>Fajr</span> <span>{prayerTimes.fajr}</span>
          </p>
          <p className={currentPrayer === "sunrise" ? "current-prayer" : ""}>
            <span>Sunrise</span> <span>{prayerTimes.sunrise}</span>
          </p>
          <p className={currentPrayer === "dhuhr" ? "current-prayer" : ""}>
            <span>Dhuhr</span> <span>{prayerTimes.dhuhr}</span>
          </p>
          <p className={currentPrayer === "asr" ? "current-prayer" : ""}>
            <span>Asr</span> <span>{prayerTimes.asr}</span>
          </p>
          <p className={currentPrayer === "maghrib" ? "current-prayer" : ""}>
            <span>Maghrib</span> <span>{prayerTimes.maghrib}</span>
          </p>
          <p className={currentPrayer === "isha" ? "current-prayer" : ""}>
            <span>Isha</span> <span>{prayerTimes.isha}</span>
          </p>
        </div>
      )}
      {ramadanTimes && (
        <div className="ramadan-times" role="region" aria-label="Ramadan times">
          <h3>Ramadan Companion</h3>
          {ramadanTimes.ramadanDay ? (
            <p>Day {ramadanTimes.ramadanDay} of Ramadan</p>
          ) : (
            <p>Ramadan not active (starts March 1, 2025)</p>
          )}
          <p>
            Suhoor:{" "}
            {ramadanTimes.suhoor.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>
            Iftar:{" "}
            {ramadanTimes.iftar.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="countdown">
            Time until next event: {nextEventCountdown || "Calculating..."}
          </p>
          <p>Current State: {ramadanTimes.currentEvent}</p>
        </div>
      )}
      {notifications.map((notif, index) => (
        <Notification
          key={notif.id}
          message={notif.message}
          onClose={() => removeNotification(notif.id)}
          isPermissionMessage={notif.isPermissionMessage}
          style={{ top: `${20 + index * 60}px` }}
          aria-live={notif.isPermissionMessage ? "polite" : "assertive"}
        />
      ))}
    </div>
  );
}

export default PrayerTimesView;
