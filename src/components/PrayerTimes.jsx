import { useState, useEffect, memo } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { usePrayerTimes } from "../hooks/usePrayerTimes";
import Notification from "../components/Notification.jsx";
import Settings from "../components/Settings.jsx";
import PrayerReminders from "../components/PrayerReminders.jsx";
import PrayerTimesDisplay from "../components/PrayerTimesDisplay.jsx";
import RamadanTimes from "../components/RamadanTimes.jsx";
import TimeModification from "../components/TimeModification.jsx";
import translations from "../utils/translations";
import {
  addNotification,
  removeNotification,
  dismissAllNotifications,
  requestNotificationPermission,
  exportPrayerTimes,
} from "../utils/prayerUtils";

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
  const [calculationMethod, setCalculationMethod] = useState(() => {
    return localStorage.getItem("calculationMethod") || "UmmAlQura";
  });
  const [timeZone, setTimeZone] = useState(() => {
    return (
      localStorage.getItem("timeZone") ||
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
  });
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
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const [useCustomTime, setUseCustomTime] = useState(() => {
    return localStorage.getItem("useCustomTime") === "true";
  });
  const [customTime, setCustomTime] = useState(() => {
    const saved = localStorage.getItem("customTime");
    return saved ? new Date(saved) : new Date();
  });
  const [triggerPrayer, setTriggerPrayer] = useState("");

  useEffect(() => {
    localStorage.setItem("notificationPermission", notificationPermission);
  }, [notificationPermission]);

  useEffect(() => {
    localStorage.setItem("calculationMethod", calculationMethod);
  }, [calculationMethod]);

  useEffect(() => {
    localStorage.setItem("timeZone", timeZone);
  }, [timeZone]);

  useEffect(() => {
    localStorage.setItem("prayerReminders", JSON.stringify(prayerReminders));
  }, [prayerReminders]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("useCustomTime", useCustomTime);
    localStorage.setItem("customTime", customTime.toISOString());
  }, [useCustomTime, customTime]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err);
        });
    }
  }, []);

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
    (message, isPermissionMessage) =>
      addNotification(setNotifications, message, isPermissionMessage),
    notificationPermission,
    calculationMethod,
    timeZone,
    prayerReminders,
    language,
    useCustomTime ? customTime : null,
    triggerPrayer
  );

  return (
    <div className="container">
      <h2 className="title">{translations[language].title}</h2>
      <Settings
        calculationMethod={calculationMethod}
        setCalculationMethod={setCalculationMethod}
        timeZone={timeZone}
        setTimeZone={setTimeZone}
        language={language}
        setLanguage={setLanguage}
        translations={translations}
      />
      <TimeModification
        useCustomTime={useCustomTime}
        setUseCustomTime={setUseCustomTime}
        customTime={customTime}
        setCustomTime={setCustomTime}
        triggerPrayer={triggerPrayer}
        setTriggerPrayer={setTriggerPrayer}
        prayerReminders={prayerReminders}
        language={language}
        translations={translations}
      />
      <button
        className="button"
        onClick={() =>
          exportPrayerTimes(
            prayerTimes,
            ramadanTimes,
            calculationMethod,
            timeZone,
            language,
            (message, isPermissionMessage) =>
              addNotification(setNotifications, message, isPermissionMessage),
            translations
          )
        }
        style={{ marginBottom: "15px" }}
        aria-label={translations[language].exportPrayerTimes}
      >
        {translations[language].exportPrayerTimes}
      </button>
      <PrayerReminders
        prayerReminders={prayerReminders}
        setPrayerReminders={setPrayerReminders}
        language={language}
        translations={translations}
      />
      {loading && (
        <div className="loading">{translations[language].loading}</div>
      )}
      {isOffline && (
        <div className="warning">{translations[language].offline}</div>
      )}
      {error && <div className="error">{error}</div>}
      {prayerError && <div className="error">{prayerError}</div>}
      {notificationPermission === "default" && (
        <button
          className="button"
          onClick={() =>
            requestNotificationPermission(
              setNotificationPermission,
              (message, isPermissionMessage) =>
                addNotification(setNotifications, message, isPermissionMessage),
              translations,
              language
            )
          }
          style={{ marginBottom: "15px" }}
          aria-label={translations[language].enableNotifications}
        >
          {translations[language].enableNotifications}
        </button>
      )}
      {notifications.length > 1 && (
        <button
          className="button"
          onClick={() => dismissAllNotifications(setNotifications)}
          style={{ marginBottom: "15px" }}
          aria-label={translations[language].dismissAllNotifications}
        >
          {translations[language].dismissAllNotifications}
        </button>
      )}
      {location && (
        <p className="description">
          {translations[language].location
            .replace("{lat}", location.latitude.toFixed(4))
            .replace("{lon}", location.longitude.toFixed(4))
            .replace("{tz}", timeZone)}
        </p>
      )}
      {nextPrayerCountdown && (
        <p className="countdown">
          {translations[language].timeUntilNextPrayer.replace(
            "{countdown}",
            nextPrayerCountdown
          )}
        </p>
      )}
      {nextEventCountdown && ramadanTimes && ramadanTimes.nextEvent && (
        <p className="countdown">
          {translations[language].timeUntilNextEvent
            .replace(
              "{event}",
              translations[language][ramadanTimes.nextEvent.name.toLowerCase()]
            )
            .replace("{countdown}", nextEventCountdown)}
        </p>
      )}
      <PrayerTimesDisplay
        prayerTimes={prayerTimes}
        currentPrayer={currentPrayer}
        prayerReminders={prayerReminders}
        language={language}
        translations={translations}
      />
      <RamadanTimes
        ramadanTimes={ramadanTimes}
        timeZone={timeZone}
        language={language}
        translations={translations}
      />
      {notifications.map((notif, index) => (
        <MemoizedNotification
          key={notif.id}
          message={notif.message}
          onClose={() => removeNotification(setNotifications, notif.id)}
          isPermissionMessage={notif.isPermissionMessage}
          style={{ top: `${20 + index * 60}px` }}
          aria-live={notif.isPermissionMessage ? "polite" : "assertive"}
        />
      ))}
    </div>
  );
}

export default PrayerTimesView;
