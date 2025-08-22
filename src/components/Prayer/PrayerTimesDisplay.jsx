import { useMemo } from "react";
import PropTypes from "prop-types";

const PrayerTimesDisplay = ({
  prayerTimes,
  currentPrayer,
  prayerReminders,
  language,
  translations,
  timeZone,
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
              <span>
                {prayerTimes[prayer].toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone,
                })}
              </span>
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
  }, [
    prayerTimes,
    currentPrayer,
    prayerReminders,
    language,
    translations,
    timeZone,
  ]);

  return renderPrayerTimes;
};

PrayerTimesDisplay.propTypes = {
  prayerTimes: PropTypes.shape({
    fajr: PropTypes.instanceOf(Date).isRequired,
    sunrise: PropTypes.instanceOf(Date).isRequired,
    dhuhr: PropTypes.instanceOf(Date).isRequired,
    asr: PropTypes.instanceOf(Date).isRequired,
    maghrib: PropTypes.instanceOf(Date).isRequired,
    isha: PropTypes.instanceOf(Date).isRequired,
  }),
  currentPrayer: PropTypes.string,
  prayerReminders: PropTypes.shape({
    fajr: PropTypes.bool.isRequired,
    sunrise: PropTypes.bool.isRequired,
    dhuhr: PropTypes.bool.isRequired,
    asr: PropTypes.bool.isRequired,
    maghrib: PropTypes.bool.isRequired,
    isha: PropTypes.bool.isRequired,
  }).isRequired,
  language: PropTypes.oneOf(["en", "ar"]).isRequired,
  translations: PropTypes.object.isRequired,
  timeZone: PropTypes.string.isRequired,
};

export default PrayerTimesDisplay;
