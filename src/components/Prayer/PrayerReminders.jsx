import PropTypes from "prop-types";
import { togglePrayerReminder } from "../../utils/prayerUtils";
import { ADHAN_SOUNDS } from "../../utils/adhanSounds";

const PrayerReminders = ({
  prayerReminders,
  setPrayerReminders,
  language,
  translations,
  adhanSoundId,
  setAdhanSoundId,
}) => {
  const handlePreview = (url) => {
    const audio = new Audio(url);
    audio.play().catch((err) => console.error("Preview playback failed:", err));
  };

  return (
    <div
      className="reminders"
      role="region"
      aria-label={translations[language].prayerReminders}
    >
      <h3>{translations[language].prayerReminders}</h3>
      {/* Sunrise isn't a prayer - no reminder for it, matching what
          scheduleReminders actually checks. */}
      {["fajr", "dhuhr", "asr", "maghrib", "isha"].map((prayer) => (
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

      <div className="adhan-picker">
        <h4 className="adhan-picker-title">Adhan sound</h4>
        <div className="adhan-list">
          {ADHAN_SOUNDS.map((adhan) => {
            const isSelected = adhan.id === adhanSoundId;
            return (
              <div
                key={adhan.id}
                className={`adhan-option${isSelected ? " adhan-option-selected" : ""}`}
              >
                <button
                  type="button"
                  className="adhan-option-select"
                  onClick={() => setAdhanSoundId(adhan.id)}
                  aria-pressed={isSelected}
                >
                  <span className="adhan-option-radio" aria-hidden="true" />
                  {adhan.name}
                </button>
                <button
                  type="button"
                  className="adhan-option-preview"
                  onClick={() => handlePreview(adhan.url)}
                  aria-label={`Preview ${adhan.name}`}
                >
                  <svg viewBox="0 0 16 16" fill="none">
                    <path d="M5 3.5v9l8-4.5Z" fill="currentColor" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
        <p className="adhan-picker-note">
          Reminders fire while the app is open in your browser - this is a
          client-side app with no background push server, so it can&apos;t
          wake up your phone if the app and browser are fully closed.
        </p>
      </div>
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
  adhanSoundId: PropTypes.string.isRequired,
  setAdhanSoundId: PropTypes.func.isRequired,
};

export default PrayerReminders;
