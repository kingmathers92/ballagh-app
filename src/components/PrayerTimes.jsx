import { useState, useEffect, memo, useMemo } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { usePrayerTimes } from "../hooks/usePrayerTimes";
import Notification from "../components/Notification";

import "../styles/PrayerTimes.css";

const MemoizedNotification = memo(Notification);

function PrayerTimesView() {
  const { location, error } = useGeolocation();
  const ramadanStart = new Date("2025-03-01");
  const [notifications, setNotifications] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState(() => {
    return "Notification" in window
      ? localStorage.getItem("notificationPermission") ||
          Notification.permission
      : "denied";
  });
  const [calculationMethod, setCalculationMethod] = useState("UmmAlQura");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [timeZone, setTimeZone] = useState(
    () =>
      localStorage.getItem("timeZone") ||
      Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [prayerReminders, setPrayerReminders] = useState(() => {
    const saved = localStorage.getItem("prayerReminders");
    return saved
      ? JSON.parse(saved)
      : {
          fajr: true,
          sunrise: false,
          dhuhr: true,
          asr: true,
          maghrib: true,
          isha: true,
        };
  });

  useEffect(() => {
    localStorage.setItem("notificationPermission", notificationPermission);
  }, [notificationPermission]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("timeZone", timeZone);
  }, [timeZone]);

  useEffect(() => {
    localStorage.setItem("prayerReminders", JSON.stringify(prayerReminders));
  }, [prayerReminders]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/serviceWorker.js").then(
        (registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        },
        (err) => {
          console.log("Service Worker registration failed:", err);
        }
      );
    }
  }, []);

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
    if ("Notification" in window && notificationPermission !== "granted") {
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

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const togglePrayerReminder = (prayer) => {
    setPrayerReminders((prev) => ({
      ...prev,
      [prayer]: !prev[prayer],
    }));
  };

  const {
    prayerTimes,
    currentPrayer,
    nextPrayerCountdown,
    ramadanTimes,
    nextEventCountdown,
    loading,
    prayerError,
    isOffline,
  } = usePrayerTimes(
    location,
    ramadanStart,
    addNotification,
    notificationPermission,
    calculationMethod,
    timeZone,
    prayerReminders
  );

  const renderPrayerTimes = useMemo(() => {
    if (!prayerTimes) return null;
    return (
      <div
        className="prayer-times"
        role="region"
        aria-label="Daily prayer times"
      >
        <p className={currentPrayer === "fajr" ? "current-prayer" : ""}>
          <span>Fajr</span> <span>{prayerTimes.fajr}</span>
          <span className="reminder-status">
            (Reminder: {prayerReminders.fajr ? "On" : "Off"})
          </span>
        </p>
        <p className={currentPrayer === "sunrise" ? "current-prayer" : ""}>
          <span>Sunrise</span> <span>{prayerTimes.sunrise}</span>
          <span className="reminder-status">
            (Reminder: {prayerReminders.sunrise ? "On" : "Off"})
          </span>
        </p>
        <p className={currentPrayer === "dhuhr" ? "current-prayer" : ""}>
          <span>Dhuhr</span> <span>{prayerTimes.dhuhr}</span>
          <span className="reminder-status">
            (Reminder: {prayerReminders.dhuhr ? "On" : "Off"})
          </span>
        </p>
        <p className={currentPrayer === "asr" ? "current-prayer" : ""}>
          <span>Asr</span> <span>{prayerTimes.asr}</span>
          <span className="reminder-status">
            (Reminder: {prayerReminders.asr ? "On" : "Off"})
          </span>
        </p>
        <p className={currentPrayer === "maghrib" ? "current-prayer" : ""}>
          <span>Maghrib</span> <span>{prayerTimes.maghrib}</span>
          <span className="reminder-status">
            (Reminder: {prayerReminders.maghrib ? "On" : "Off"})
          </span>
        </p>
        <p className={currentPrayer === "isha" ? "current-prayer" : ""}>
          <span>Isha</span> <span>{prayerTimes.isha}</span>
          <span className="reminder-status">
            (Reminder: {prayerReminders.isha ? "On" : "Off"})
          </span>
        </p>
      </div>
    );
  }, [prayerTimes, currentPrayer, prayerReminders]);

  return (
    <div className="container">
      <h2 className="title">Prayer & Ramadan Times</h2>
      <button
        className="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        style={{ marginBottom: "15px" }}
      >
        Toggle {theme === "light" ? "Dark" : "Light"} Mode
      </button>
      <select
        value={calculationMethod}
        onChange={(e) => setCalculationMethod(e.target.value)}
        className="calculation-method"
        aria-label="Select prayer time calculation method"
        style={{ marginBottom: "15px" }}
      >
        <option value="UmmAlQura">Umm Al-Qura</option>
        <option value="MuslimWorldLeague">Muslim World League</option>
        <option value="Egyptian">Egyptian</option>
      </select>
      <select
        value={timeZone}
        onChange={(e) => setTimeZone(e.target.value)}
        className="time-zone"
        aria-label="Select time zone"
        style={{ marginBottom: "15px" }}
      >
        <option value="America/New_York">America/New York</option>
        <option value="Europe/London">Europe/London</option>
        <option value="Asia/Dubai">Asia/Dubai</option>
        <option value="Asia/Riyadh">Asia/Riyadh</option>
        <option value="Asia/Karachi">Asia/Karachi</option>
      </select>
      <div className="reminders" role="region" aria-label="Prayer reminders">
        <h3>Prayer Reminders</h3>
        {["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"].map(
          (prayer) => (
            <label key={prayer} className="reminder-label">
              <input
                type="checkbox"
                checked={prayerReminders[prayer]}
                onChange={() => togglePrayerReminder(prayer)}
                aria-label={`Toggle reminder for ${prayer}`}
              />
              {prayer.charAt(0).toUpperCase() + prayer.slice(1)} Reminder
            </label>
          )
        )}
      </div>
      {loading && <div className="loading">Loading prayer times...</div>}
      {isOffline && (
        <div className="warning">Offline: Showing cached prayer times</div>
      )}
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
          {location.longitude.toFixed(4)} (Time Zone: {timeZone})
        </p>
      )}
      {nextPrayerCountdown && (
        <p className="countdown">
          Time until next prayer: {nextPrayerCountdown}
        </p>
      )}
      {renderPrayerTimes}
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
              timeZone,
            })}
          </p>
          <p>
            Iftar:{" "}
            {ramadanTimes.iftar.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              timeZone,
            })}
          </p>
          <p className="countdown">
            Time until next event: {nextEventCountdown || "Calculating..."}
          </p>
          <p>Current State: {ramadanTimes.currentEvent}</p>
        </div>
      )}
      {notifications.map((notif, index) => (
        <MemoizedNotification
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
