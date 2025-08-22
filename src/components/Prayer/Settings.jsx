import PropTypes from "prop-types";

const Settings = ({
  calculationMethod,
  setCalculationMethod,
  timeZone,
  setTimeZone,
  language,
  setLanguage,
  translations,
}) => {
  return (
    <div
      className="settings"
      role="region"
      aria-label={translations[language].settingsLabel}
    >
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
    </div>
  );
};

Settings.propTypes = {
  calculationMethod: PropTypes.oneOf([
    "UmmAlQura",
    "MuslimWorldLeague",
    "Egyptian",
  ]).isRequired,
  setCalculationMethod: PropTypes.func.isRequired,
  timeZone: PropTypes.string.isRequired,
  setTimeZone: PropTypes.func.isRequired,
  language: PropTypes.oneOf(["en", "ar"]).isRequired,
  setLanguage: PropTypes.func.isRequired,
  translations: PropTypes.shape({
    en: PropTypes.shape({
      settingsLabel: PropTypes.string.isRequired,
      calculationMethodLabel: PropTypes.string.isRequired,
      timeZoneLabel: PropTypes.string.isRequired,
      languageLabel: PropTypes.string.isRequired,
    }).isRequired,
    ar: PropTypes.shape({
      settingsLabel: PropTypes.string.isRequired,
      calculationMethodLabel: PropTypes.string.isRequired,
      timeZoneLabel: PropTypes.string.isRequired,
      languageLabel: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Settings;
