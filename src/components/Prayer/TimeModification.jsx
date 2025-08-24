import PropTypes from "prop-types";
import { addNotification } from "../../utils/prayerUtils";

const TimeModification = ({
  useCustomTime,
  setUseCustomTime,
  customTime,
  setCustomTime,
  triggerPrayer,
  setTriggerPrayer,
  prayerReminders,
  language,
  translations,
}) => {
  const toggleCustomTime = () => {
    setUseCustomTime((prev) => !prev);
    setTriggerPrayer("");
  };

  const handleCustomTimeChange = (e) => {
    setCustomTime(new Date(e.target.value));
    setTriggerPrayer("");
  };

  const handleTriggerPrayer = () => {
    if (triggerPrayer && prayerReminders[triggerPrayer]) {
      addNotification(
        translations[language].testNotification.replace(
          "{prayer}",
          translations[language].prayers[triggerPrayer]
        ),
        false
      );
    }
  };

  return (
    <div
      className="time-modification"
      role="region"
      aria-label={translations[language].timeModificationLabel}
    >
      <label className="time-modification-label">
        <input
          type="checkbox"
          checked={useCustomTime}
          onChange={toggleCustomTime}
          aria-label={translations[language].enableTimeModification}
        />
        {translations[language].enableTimeModification}
      </label>
      {useCustomTime && (
        <>
          <input
            type="datetime-local"
            value={customTime.toISOString().slice(0, 16)}
            onChange={handleCustomTimeChange}
            className="custom-time-input"
            aria-label={translations[language].customTimeLabel}
            style={{ marginBottom: "15px" }}
          />
          <select
            value={triggerPrayer}
            onChange={(e) => setTriggerPrayer(e.target.value)}
            className="trigger-prayer"
            aria-label={translations[language].triggerPrayerLabel}
            style={{ marginBottom: "15px" }}
          >
            <option value="">{translations[language].prayers.select}</option>
            {["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"].map(
              (prayer) => (
                <option key={prayer} value={prayer}>
                  {translations[language].prayers[prayer]}
                </option>
              )
            )}
          </select>
          <button
            className="button"
            onClick={handleTriggerPrayer}
            disabled={!triggerPrayer || !prayerReminders[triggerPrayer]}
            aria-label={translations[language].triggerPrayerButton}
            style={{ marginBottom: "15px" }}
          >
            {translations[language].triggerPrayerButton}
          </button>
        </>
      )}
    </div>
  );
};

TimeModification.propTypes = {
  useCustomTime: PropTypes.bool.isRequired,
  setUseCustomTime: PropTypes.func.isRequired,
  customTime: PropTypes.instanceOf(Date).isRequired,
  setCustomTime: PropTypes.func.isRequired,
  triggerPrayer: PropTypes.string.isRequired,
  setTriggerPrayer: PropTypes.func.isRequired,
  prayerReminders: PropTypes.shape({
    fajr: PropTypes.bool.isRequired,
    sunrise: PropTypes.bool.isRequired,
    dhuhr: PropTypes.bool.isRequired,
    asr: PropTypes.bool.isRequired,
    maghrib: PropTypes.bool.isRequired,
    isha: PropTypes.bool.isRequired,
  }).isRequired,
  language: PropTypes.oneOf(["en", "ar"]).isRequired,
  translations: PropTypes.shape({
    en: PropTypes.shape({
      timeModificationLabel: PropTypes.string.isRequired,
      enableTimeModification: PropTypes.string.isRequired,
      customTimeLabel: PropTypes.string.isRequired,
      triggerPrayerLabel: PropTypes.string.isRequired,
      triggerPrayerButton: PropTypes.string.isRequired,
      testNotification: PropTypes.string.isRequired,
      prayers: PropTypes.shape({
        select: PropTypes.string.isRequired,
        fajr: PropTypes.string.isRequired,
        sunrise: PropTypes.string.isRequired,
        dhuhr: PropTypes.string.isRequired,
        asr: PropTypes.string.isRequired,
        maghrib: PropTypes.string.isRequired,
        isha: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    ar: PropTypes.shape({
      timeModificationLabel: PropTypes.string.isRequired,
      enableTimeModification: PropTypes.string.isRequired,
      customTimeLabel: PropTypes.string.isRequired,
      triggerPrayerLabel: PropTypes.string.isRequired,
      triggerPrayerButton: PropTypes.string.isRequired,
      testNotification: PropTypes.string.isRequired,
      prayers: PropTypes.shape({
        select: PropTypes.string.isRequired,
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

export default TimeModification;
