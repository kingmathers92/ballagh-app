import PropTypes from "prop-types";
import { togglePrayerReminder } from "../utils/prayerUtils";

const PrayerReminders = ({
  prayerReminders,
  setPrayerReminders,
  language,
  translations,
}) => {
  return (
    <div
      className="reminders"
      role="region"
      aria-label={translations[language].prayerReminders}
    >
      <h3>{translations[language].prayerReminders}</h3>
      {["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"].map((prayer) => (
        <label key={prayer} className="reminder-label">
          <input
            type="checkbox"
            checked={prayerReminders[prayer]}
            onChange={() => togglePrayerReminder(setPrayerReminders, prayer)}
            aria-label={`Toggle reminder for ${translations[language].prayers[prayer]}`}
          />
          {translations[language].prayers[prayer]}{" "}
          {translations[language].prayerReminders}
        </label>
      ))}
    </div>
  );
};

PrayerReminders.propTypes = {
  prayerReminders: PropTypes.shape({
    fajr: PropTypes.bool.isRequired,
    sunrise: PropTypes.bool.isRequired,
    dhuhr: PropTypes.bool.isRequired,
    asr: PropTypes.bool.isRequired,
    maghrib: PropTypes.bool.isRequired,
    isha: PropTypes.bool.isRequired,
  }).isRequired,
  setPrayerReminders: PropTypes.func.isRequired,
  language: PropTypes.oneOf(["en", "ar"]).isRequired,
  translations: PropTypes.shape({
    en: PropTypes.shape({
      prayerReminders: PropTypes.string.isRequired,
      prayers: PropTypes.shape({
        fajr: PropTypes.string.isRequired,
        sunrise: PropTypes.string.isRequired,
        dhuhr: PropTypes.string.isRequired,
        asr: PropTypes.string.isRequired,
        maghrib: PropTypes.string.isRequired,
        isha: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    ar: PropTypes.shape({
      prayerReminders: PropTypes.string.isRequired,
      prayers: PropTypes.shape({
        fajr: PropTypes.string.isRequired,
        sunrise: PropTypes.string.isRequired,
        dhuhr: PropTypes.string.isRequired,
        asr: PropTypes.string.isRequired,
        maghrib: PropTypes.string.isRequired,
        isha: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default PrayerReminders;
