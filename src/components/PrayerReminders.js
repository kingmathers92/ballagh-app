import React from "react";
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

export default PrayerReminders;
