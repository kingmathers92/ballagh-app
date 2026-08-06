import PropTypes from "prop-types";

const FALLBACK_TIMEZONES = [
  "UTC",
  "Africa/Cairo",
  "Africa/Lagos",
  "Africa/Tunis",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Jakarta",
  "Asia/Kuala_Lumpur",
  "Asia/Riyadh",
  "Europe/London",
  "Europe/Istanbul",
];

const getTimeZoneOptions = () =>
  typeof Intl.supportedValuesOf === "function"
    ? Intl.supportedValuesOf("timeZone")
    : FALLBACK_TIMEZONES;

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
        <option value="MuslimWorldLeague">Muslim World League</option>
        <option value="Egyptian">Egyptian General Authority</option>
        <option value="Karachi">Univ. of Islamic Sciences, Karachi</option>
        <option value="UmmAlQura">Umm Al-Qura, Makkah</option>
        <option value="Dubai">Dubai (UAE)</option>
        <option value="MoonsightingCommittee">Moonsighting Committee</option>
        <option value="NorthAmerica">ISNA (North America)</option>
        <option value="Kuwait">Kuwait</option>
        <option value="Qatar">Qatar</option>
        <option value="Singapore">Singapore (MUIS)</option>
        <option value="Tehran">Univ. of Tehran</option>
        <option value="Turkey">Diyanet (Turkey)</option>
      </select>
      <select
        value={timeZone}
        onChange={(e) => setTimeZone(e.target.value)}
        className="time-zone"
        aria-label={translations[language].timeZoneLabel}
        style={{ marginBottom: "15px" }}
      >
        {getTimeZoneOptions().map((tz) => (
          <option key={tz} value={tz}>
            {tz.replace(/_/g, " ")}
          </option>
        ))}
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
    "MuslimWorldLeague",
    "Egyptian",
    "Karachi",
    "UmmAlQura",
    "Dubai",
    "MoonsightingCommittee",
    "NorthAmerica",
    "Kuwait",
    "Qatar",
    "Singapore",
    "Tehran",
    "Turkey",
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
