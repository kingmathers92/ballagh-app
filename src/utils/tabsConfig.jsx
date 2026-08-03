import PrayerTimesDisplay from "../components/Prayer/PrayerTimesDisplay.jsx";
import RamadanTimes from "../components/Prayer/RamadanTimes.jsx";
import PrayerReminders from "../components/Prayer/PrayerReminders.jsx";
import Settings from "../components/Prayer/Settings.jsx";

export const getTabsConfig = (
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
  setLanguage,
) => [
  {
    id: "prayer-times",
    label: translations[language].title,
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.3" />
        <path d="M10 6v4l2.6 1.5" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
    content: (
      <div className="prayer-times-card">
        {nextPrayerCountdown && (
          <p className="countdown">
            {translations[language].timeUntilNextPrayer.replace(
              "{countdown}",
              nextPrayerCountdown,
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
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <path
          d="M12.5 3.5a7 7 0 1 0 0 13 8.2 8.2 0 0 1 0-13Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
    content: (
      <div className="ramadan-times-card">
        {nextEventCountdown && ramadanTimes && ramadanTimes.nextEvent && (
          <p className="countdown">
            {translations[language].timeUntilNextEvent
              .replace(
                "{event}",
                translations[language][
                  ramadanTimes.nextEvent.name.toLowerCase()
                ],
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
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <path
          d="M10 3.5c-2.2 0-3.8 1.8-3.8 4v2.3L5 12.5h10l-1.2-2.7V7.5c0-2.2-1.6-4-3.8-4Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 14.5a1.5 1.5 0 0 0 3 0"
          stroke="currentColor"
          strokeWidth="1.3"
        />
      </svg>
    ),
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
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <circle
          cx="10"
          cy="10"
          r="2.6"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M10 3v2M10 15v2M17 10h-2M5 10H3M14.9 5.1l-1.4 1.4M6.5 13.5l-1.4 1.4M14.9 14.9l-1.4-1.4M6.5 6.5 5.1 5.1"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
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
