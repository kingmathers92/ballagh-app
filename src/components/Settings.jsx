import React from "react";

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
    <>
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
    </>
  );
};

export default Settings;
