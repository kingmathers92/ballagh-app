import { useState, useEffect, memo } from "react";
import { useGeolocation } from "../hooks/useGeolocation.js";
import { usePrayerTimes } from "../hooks/usePrayerTimes.js";
import Notification from "../components/Notification.jsx";
import Settings from "../components/Prayer/Settings.jsx";
import PrayerReminders from "../components/Prayer/PrayerReminders.jsx";
import PrayerTimesDisplay from "../components/Prayer/PrayerTimesDisplay.jsx";
import RamadanTimes from "../components/Prayer/RamadanTimes.jsx";
import translations from "../utils/translations.js";
import {
  addNotification,
  removeNotification,
  dismissAllNotifications,
  requestNotificationPermission,
  exportPrayerTimes,
} from "../utils/prayerUtils.js";

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
  const [activeTab, setActiveTab] = useState("prayer-times");
  const [openAccordions, setOpenAccordions] = useState(["prayer-times"]);

  const toggleAccordion = (section) => {
    setOpenAccordions((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

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
          addNotification(
            translations[language].serviceWorkerError ||
              "Failed to register service worker",
            true
          );
        });
    }
  }, [language]);

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
    language
  );

  const tabs = [
    {
      id: "prayer-times",
      label: translations[language].prayerTimes,
      icon: "🕋",
      content: (
        <div className="prayer-times-card">
          {nextPrayerCountdown && (
            <p className="countdown">
              {translations[language].timeUntilNextPrayer.replace(
                "{countdown}",
                nextPrayerCountdown
              )}
            </p>
          )}
          <PrayerTimesDisplay
            prayerTimes={prayerTimes}
            currentPrayer={currentPrayer}
            prayerReminders={prayerReminders}
            language={language}
            translations={translations}
            timeZone={timeZone}
          />
        </div>
      ),
    },
    {
      id: "ramadan-times",
      label: translations[language].ramadanCompanion,
      icon: "🌙",
      content: (
        <div className="ramadan-times-card">
          {nextEventCountdown && ramadanTimes && ramadanTimes.nextEvent && (
            <p className="countdown">
              {translations[language].timeUntilNextEvent
                .replace(
                  "{event}",
                  translations[language][
                    ramadanTimes.nextEvent.name.toLowerCase()
                  ]
                )
                .replace("{countdown}", nextEventCountdown)}
            </p>
          )}
          <RamadanTimes
            ramadanTimes={ramadanTimes}
            timeZone={timeZone}
            language={language}
            translations={translations}
          />
        </div>
      ),
    },
    {
      id: "reminders",
      label: translations[language].prayerReminders,
      icon: "🔔",
      content: (
        <div className="reminders-card">
          <PrayerReminders
            prayerReminders={prayerReminders}
            setPrayerReminders={setPrayerReminders}
            language={language}
            translations={translations}
          />
        </div>
      ),
    },
    {
      id: "settings",
      label: translations[language].settingsLabel,
      icon: "⚙️",
      content: (
        <div className="settings-card">
          <Settings
            calculationMethod={calculationMethod}
            setCalculationMethod={setCalculationMethod}
            timeZone={timeZone}
            setTimeZone={setTimeZone}
            language={language}
            setLanguage={setLanguage}
            translations={translations}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="prayer-view-container">
      <header className="hero-section">
        <h1 className="title">{translations[language].title}</h1>
      </header>
      <main className="main-content">
        {loading && (
          <div className="loading">{translations[language].loading}</div>
        )}
        {isOffline && (
          <div className="warning">{translations[language].offline}</div>
        )}
        {error && <div className="error">{error}</div>}
        {prayerError && <div className="error">{prayerError}</div>}
        {location && (
          <p className="description">
            {translations[language].location
              .replace("{lat}", location.latitude.toFixed(4))
              .replace("{lon}", location.longitude.toFixed(4))
              .replace("{tz}", timeZone)}
          </p>
        )}
        <div className="tab-container">
          <nav className="tab-nav" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
              >
                <span className="tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="tab-content">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                id={`panel-${tab.id}`}
                className={`tab-panel ${activeTab === tab.id ? "active" : ""}`}
                role="tabpanel"
                aria-labelledby={`tab-${tab.id}`}
                hidden={activeTab !== tab.id}
              >
                {tab.content}
              </div>
            ))}
          </div>
        </div>
        <div className="accordion-container">
          {tabs.map((tab) => (
            <div key={tab.id} className="accordion-item">
              <button
                className={`accordion-header ${
                  openAccordions.includes(tab.id) ? "active" : ""
                }`}
                onClick={() => toggleAccordion(tab.id)}
                aria-expanded={openAccordions.includes(tab.id)}
                aria-controls={`accordion-panel-${tab.id}`}
                id={`accordion-${tab.id}`}
              >
                <span className="accordion-icon">{tab.icon}</span>
                {tab.label}
                <span className="accordion-arrow">
                  {openAccordions.includes(tab.id) ? "▲" : "▼"}
                </span>
              </button>
              <div
                id={`accordion-panel-${tab.id}`}
                className={`accordion-content ${
                  openAccordions.includes(tab.id) ? "open" : ""
                }`}
                role="region"
                aria-labelledby={`accordion-${tab.id}`}
                hidden={!openAccordions.includes(tab.id)}
              >
                {tab.content}
              </div>
            </div>
          ))}
        </div>
        <div className="action-toolbar">
          {notificationPermission === "default" && (
            <button
              className="button enable-notifications"
              onClick={() =>
                requestNotificationPermission(
                  setNotificationPermission,
                  (message, isPermissionMessage) =>
                    addNotification(
                      setNotifications,
                      message,
                      isPermissionMessage
                    ),
                  translations,
                  language
                )
              }
              aria-label={translations[language].enableNotifications}
            >
              <span className="button-icon">🔔</span>
              {translations[language].enableNotifications}
            </button>
          )}
          {notifications.length > 1 && (
            <button
              className="button dismiss-notifications"
              onClick={() => dismissAllNotifications(setNotifications)}
              aria-label={translations[language].dismissAllNotifications}
            >
              <span className="button-icon">✖️</span>
              {translations[language].dismissAllNotifications}
            </button>
          )}
          <button
            className="export-button button"
            onClick={() =>
              exportPrayerTimes(
                prayerTimes,
                ramadanTimes,
                calculationMethod,
                timeZone,
                language,
                (message, isPermissionMessage) =>
                  addNotification(
                    setNotifications,
                    message,
                    isPermissionMessage
                  ),
                translations
              )
            }
            aria-label={translations[language].exportPrayerTimes}
          >
            <span className="button-icon">📥</span>
            {translations[language].exportPrayerTimes}
          </button>
        </div>
      </main>
      <div className="notification-stack">
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
    </div>
  );
}

export default PrayerTimesView;
