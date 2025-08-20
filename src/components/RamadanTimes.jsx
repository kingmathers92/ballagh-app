import PropTypes from "prop-types";

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
      <p>
        {translations[language].currentState.replace(
          "{state}",
          translations[language][ramadanTimes.currentEvent.toLowerCase()]
        )}
      </p>
    </div>
  ) : null;
};

RamadanTimes.propTypes = {
  ramadanTimes: PropTypes.shape({
    ramadanDay: PropTypes.number,
    suhoor: PropTypes.instanceOf(Date),
    iftar: PropTypes.instanceOf(Date),
    currentEvent: PropTypes.string,
    nextEvent: PropTypes.shape({
      name: PropTypes.string,
      time: PropTypes.instanceOf(Date),
    }),
  }),
  timeZone: PropTypes.string.isRequired,
  language: PropTypes.oneOf(["en", "ar"]).isRequired,
  translations: PropTypes.object.isRequired,
};

export default RamadanTimes;
