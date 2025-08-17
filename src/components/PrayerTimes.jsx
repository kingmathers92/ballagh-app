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
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );

  const translations = {
    en: {
      title: "Prayer & Ramadan Times",
      enableNotifications: "Enable Notifications",
      dismissAllNotifications: "Dismiss All Notifications",
      prayerReminders: "Prayer Reminders",
      ramadanCompanion: "Ramadan Companion",
      location: "Location: Lat {lat}, Lon {lon} (Time Zone: {tz})",
      timeUntilNextPrayer: "Time until next prayer: {countdown}",
      dayOfRamadan: "Day {day} of Ramadan",
      ramadanNotActive: "Ramadan not active (starts March 1, 2025)",
      suhoor: "Suhoor: {time}",
      iftar: "Iftar: {time}",
      timeUntilNextEvent: "Time until next event: {countdown}",
      currentState: "Current State: {state}",
      loading: "Loading prayer times...",
      offline: "Offline: Showing cached prayer times",
      calculationMethodLabel: "Select prayer time calculation method",
      timeZoneLabel: "Select time zone",
      languageLabel: "Select language",
      prayers: {
        fajr: "Fajr",
        sunrise: "Sunrise",
        dhuhr: "Dhuhr",
        asr: "Asr",
        maghrib: "Maghrib",
        isha: "Isha",
      },
      reminder: "Reminder: {status}",
    },
    ar: {
      title: "أوقات الصلاة ورمضان",
      enableNotifications: "تفعيل الإشعارات",
      dismissAllNotifications: "إلغاء جميع الإشعارات",
      prayerReminders: "تذكيرالصلاة",
      ramadanCompanion: "رفيق رمضان",
      location:
        "الموقع: خط العرض {lat}، خط الطول {lon} (المنطقة الزمنية: {tz})",
      timeUntilNextPrayer: "الوقت حتى الصلاة التالية: {countdown}",
      dayOfRamadan: "اليوم {day} من رمضان",
      ramadanNotActive: "رمضان غير نشط (يبدأ في 1 مارس 2025)",
      suhoor: "السحور: {time}",
      iftar: "الإفطار: {time}",
      timeUntilNextEvent: "الوقت حتى الحدث التالي: {countdown}",
      currentState: "الحالة الحالية: {state}",
      loading: "جارٍ تحميل أوقات الصلاة...",
      offline: "غير متصل: عرض أوقات الصلاة المخزنة",
      calculationMethodLabel: "اختر طريقة حساب أوقات الصلاة",
      timeZoneLabel: "اختر المنطقة الزمنية",
      languageLabel: "اختر اللغة",
      prayers: {
        fajr: "الفجر",
        sunrise: "الشروق",
        dhuhr: "الظهر",
        asr: "العصر",
        maghrib: "المغرب",
        isha: "العشاء",
      },
      reminder: "تذكير: {status}",
    },
  };

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
    localStorage.setItem("language", language);
  }, [language]);

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
          addNotification(
            translations[language].enableNotifications + "!",
            true
          );
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
    prayerReminders,
    language
  );

  const renderPrayerTimes = useMemo(() => {
    if (!prayerTimes) return null;
    return (
      <div
        className="prayer-times"
        role="region"
        aria-label={translations[language].prayers}
      >
        {["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"].map(
          (prayer) => (
            <p
              key={prayer}
              className={currentPrayer === prayer ? "current-prayer" : ""}
            >
              <span>{translations[language].prayers[prayer]}</span>
              <span>{prayerTimes[prayer]}</span>
              <span className="reminder-status">
                {translations[language].reminder.replace(
                  "{status}",
                  prayerReminders[prayer]
                    ? language === "en"
                      ? "On"
                      : "مفعل"
                    : language === "en"
                    ? "Off"
                    : "معطل"
                )}
              </span>
            </p>
          )
        )}
      </div>
    );
  }, [prayerTimes, currentPrayer, prayerReminders, language]);

  return (
    <div className="container">
      <h2 className="title">{translations[language].title}</h2>
      <button
        className="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${
          theme === "light"
            ? translations[language].prayers.dark
            : translations[language].prayers.light
        } mode`}
        style={{ marginBottom: "15px" }}
      >
        {translations[language].prayers.toggle}{" "}
        {theme === "light"
          ? translations[language].prayers.dark
          : translations[language].prayers.light}{" "}
        Mode
      </button>
      <select
        value={calculationMethod}
        onChange={(e) => setCalculationMethod(e.target.value)}
        className="calculation-method"
        aria-label={translations[language].calculationMethodLabel}
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
        aria-label={translations[language].timeZoneLabel}
        style={{ marginBottom: "15px" }}
      >
        <option value="America/New_York">America/New York</option>
        <option value="Europe/London">Europe/London</option>
        <option value="Asia/Dubai">Asia/Dubai</option>
        <option value="Asia/Riyadh">Asia/Riyadh</option>
        <option value="Asia/Karachi">Asia/Karachi</option>
      </select>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="language"
        aria-label={translations[language].languageLabel}
        style={{ marginBottom: "15px" }}
      >
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
      <div
        className="reminders"
        role="region"
        aria-label={translations[language].prayerReminders}
      >
        <h3>{translations[language].prayerReminders}</h3>
        {["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"].map(
          (prayer) => (
            <label key={prayer} className="reminder-label">
              <input
                type="checkbox"
                checked={prayerReminders[prayer]}
                onChange={() => togglePrayerReminder(prayer)}
                aria-label={`Toggle reminder for ${translations[language].prayers[prayer]}`}
              />
              {translations[language].prayers[prayer]}{" "}
              {translations[language].prayerReminders}
            </label>
          )
        )}
      </div>
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
          onClick={requestNotificationPermission}
          style={{ marginBottom: "15px" }}
          aria-label={translations[language].enableNotifications}
        >
          {translations[language].enableNotifications}
        </button>
      )}
      {notifications.length > 1 && (
        <button
          className="button"
          onClick={dismissAllNotifications}
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
      {renderPrayerTimes}
      {ramadanTimes && (
        <div
          className="ramadan-times"
          role="region"
          aria-label={translations[language].ramadanCompanion}
        >
          <h3>{translations[language].ramadanCompanion}</h3>
          {ramadanTimes.ramadanDay ? (
            <p>
              {translations[language].dayOfRamadan.replace(
                "{day}",
                ramadanTimes.ramadanDay
              )}
            </p>
          ) : (
            <p>{translations[language].ramadanNotActive}</p>
          )}
          <p>
            {translations[language].suhoor.replace(
              "{time}",
              ramadanTimes.suhoor.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                timeZone,
              })
            )}
          </p>
          <p>
            {translations[language].iftar.replace(
              "{time}",
              ramadanTimes.iftar.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                timeZone,
              })
            )}
          </p>
          <p className="countdown">
            {translations[language].timeUntilNextEvent.replace(
              "{countdown}",
              nextEventCountdown || translations[language].prayers.calculating
            )}
          </p>
          <p>
            {translations[language].currentState.replace(
              "{state}",
              ramadanTimes.currentEvent
            )}
          </p>
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
