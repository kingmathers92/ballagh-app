import React, { useMemo } from "react";

const PrayerTimesDisplay = ({
  prayerTimes,
  currentPrayer,
  prayerReminders,
  language,
  translations,
}) => {
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
  }, [prayerTimes, currentPrayer, prayerReminders, language, translations]);

  return renderPrayerTimes;
};

export default PrayerTimesDisplay;
