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
  setLanguage
) => [
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
