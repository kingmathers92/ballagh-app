import React from "react";

const RamadanTimes = ({ ramadanTimes, timeZone, language, translations }) => {
  return ramadanTimes ? (
    <div
      className="ramadan-times"
      role="region"
      aria-label={translations[language].ramadanCompanion}
    >
      <h3>{translations[language].ramadanCompanion}</h3>
      {ramadanTimes.ramadanDay ? (
        <p>
          {translations[language].dayOfRamadan.replace(
            "{day}",
            ramadanTimes.ramadanDay
          )}
        </p>
      ) : (
        <p>{translations[language].ramadanNotActive}</p>
      )}
      <p>
        {translations[language].suhoor.replace(
          "{time}",
          ramadanTimes.suhoor.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone,
          })
        )}
      </p>
      <p>
        {translations[language].iftar.replace(
          "{time}",
          ramadanTimes.iftar.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone,
          })
        )}
      </p>
      <p className="countdown">
        {translations[language].timeUntilNextEvent.replace(
          "{countdown}",
          ramadanTimes.nextEventCountdown || "Calculating..."
        )}
      </p>
      <p>
        {translations[language].currentState.replace(
          "{state}",
          ramadanTimes.currentEvent
        )}
      </p>
    </div>
  ) : null;
};

export default RamadanTimes;
