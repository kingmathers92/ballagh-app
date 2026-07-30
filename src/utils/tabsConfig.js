import PrayerTimesDisplay from "../components/Prayer/PrayerTimesDisplay";
import RamadanTimes from "../components/Prayer/RamadanTimes";
import PrayerReminders from "../components/Prayer/PrayerReminders";
import Settings from "../components/Prayer/Settings";

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
) => {
  // Runtime validation
  if (
    !translations ||
    typeof language !== "string" ||
    typeof calculationMethod !== "string" ||
    typeof timeZone !== "string" ||
    typeof setPrayerReminders !== "function" ||
    typeof setCalculationMethod !== "function" ||
    typeof setTimeZone !== "function" ||
    typeof setLanguage !== "function"
  ) {
    throw new Error("Invalid arguments provided to getTabsConfig");
  }

  return [
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
};
