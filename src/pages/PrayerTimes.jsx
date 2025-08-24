import { useState } from "react";
import { useGeolocation } from "../hooks/useGeolocation.js";
import { usePrayerTimes } from "../hooks/usePrayerTimes.js";
import { usePersistedState } from "../hooks/usePersistedState.js";
import { useServiceWorker } from "../hooks/useServiceWorker.js";
import Tabs from "./Tabs.jsx";
import Accordion from "./Accordion.jsx";
import ActionToolbar from "./ActionToolbar.jsx";
import NotificationStack from "./NotificationStack.jsx";
import translations from "../utils/translations.js";
import { getTabsConfig } from "../utils/tabsConfig.js";
import "../styles/PrayerTimes.css";

function PrayerTimesView() {
  const { location, error } = useGeolocation();
  const ramadanStart = new Date("2025-03-01");
  const [notifications, setNotifications] = useState([]);
  const [notificationPermission, setNotificationPermission] = usePersistedState(
    "notificationPermission",
    "Notification" in window ? Notification.permission : "denied"
  );
  const [calculationMethod, setCalculationMethod] = usePersistedState(
    "calculationMethod",
    "UmmAlQura"
  );
  const [timeZone, setTimeZone] = usePersistedState(
    "timeZone",
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [prayerReminders, setPrayerReminders] = usePersistedState(
    "prayerReminders",
    {
      fajr: true,
      sunrise: false,
      dhuhr: true,
      asr: true,
      maghrib: true,
      isha: true,
    }
  );
  const [language, setLanguage] = usePersistedState("language", "en");
  const [activeTab, setActiveTab] = useState("prayer-times");
  const [openAccordions, setOpenAccordions] = useState(["prayer-times"]);

  useServiceWorker(language, translations);

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
      setNotifications((prev) => [
        ...prev,
        { id: Date.now(), message, isPermissionMessage },
      ]),
    notificationPermission,
    calculationMethod,
    timeZone,
    prayerReminders,
    language
  );

  const tabs = getTabsConfig(
    translations,
    language,
    prayerTimes,
    currentPrayer,
    prayerReminders,
    setPrayerReminders,
    ramadanTimes,
    nextPrayerCountdown,
    nextEventCountdown,
    timeZone,
    calculationMethod,
    setCalculationMethod,
    setTimeZone,
    setLanguage
  );

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
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <Accordion
          tabs={tabs}
          openAccordions={openAccordions}
          setOpenAccordions={setOpenAccordions}
        />
        <ActionToolbar
          notificationPermission={notificationPermission}
          setNotificationPermission={setNotificationPermission}
          notifications={notifications}
          setNotifications={setNotifications}
          prayerTimes={prayerTimes}
          ramadanTimes={ramadanTimes}
          calculationMethod={calculationMethod}
          timeZone={timeZone}
          language={language}
          translations={translations}
        />
      </main>
      <NotificationStack
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </div>
  );
}

export default PrayerTimesView;
