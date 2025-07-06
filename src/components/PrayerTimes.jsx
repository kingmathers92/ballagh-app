import { useState } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { usePrayerTimes } from "../hooks/usePrayerTimes";
import Notification from "../components/Notification";

import "../styles/PrayerTimes.css";

function PrayerTimesView() {
  const { location, error } = useGeolocation();
  const ramadanStart = new Date("2025-03-01");
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    setNotifications((prev) => [...prev, { id: Date.now(), message }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const {
    prayerTimes,
    currentPrayer,
    nextPrayerCountdown,
    ramadanTimes,
    nextEventCountdown,
  } = usePrayerTimes(location, ramadanStart, addNotification);

  return (
    <div className="container">
      <h2 className="title">Prayer & Ramadan Times</h2>
      {error && <div className="error">{error}</div>}
      {location && (
        <p className="description">
          Location: Lat {location.latitude.toFixed(4)}, Lon{" "}
          {location.longitude.toFixed(4)}
        </p>
      )}
      {nextPrayerCountdown && (
        <p className="countdown">
          Time until next prayer: {nextPrayerCountdown}
        </p>
      )}
      {prayerTimes && (
        <div className="prayer-times">
          <p className={currentPrayer === "fajr" ? "current-prayer" : ""}>
            <span>Fajr</span> <span>{prayerTimes.fajr}</span>
          </p>
          <p className={currentPrayer === "sunrise" ? "current-prayer" : ""}>
            <span>Sunrise</span> <span>{prayerTimes.sunrise}</span>
          </p>
          <p className={currentPrayer === "dhuhr" ? "current-prayer" : ""}>
            <span>Dhuhr</span> <span>{prayerTimes.dhuhr}</span>
          </p>
          <p className={currentPrayer === "asr" ? "current-prayer" : ""}>
            <span>Asr</span> <span>{prayerTimes.asr}</span>
          </p>
          <p className={currentPrayer === "maghrib" ? "current-prayer" : ""}>
            <span>Maghrib</span> <span>{prayerTimes.maghrib}</span>
          </p>
          <p className={currentPrayer === "isha" ? "current-prayer" : ""}>
            <span>Isha</span> <span>{prayerTimes.isha}</span>
          </p>
        </div>
      )}
      {ramadanTimes && (
        <div className="ramadan-times">
          <h3>Ramadan Companion</h3>
          {ramadanTimes.ramadanDay ? (
            <p>Day {ramadanTimes.ramadanDay} of Ramadan</p>
          ) : (
            <p>Ramadan not active (starts March 1, 2025)</p>
          )}
          <p>
            Suhoor:{" "}
            {ramadanTimes.suhoor.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>
            Iftar:{" "}
            {ramadanTimes.iftar.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="countdown">
            Time until next prayer: {nextEventCountdown || "Calculating..."}
          </p>
          <p>Current State: {ramadanTimes.currentEvent}</p>
        </div>
      )}
      {notifications.map((notif) => (
        <Notification
          key={notif.id}
          message={notif.message}
          onClose={() => removeNotification(notif.id)}
        />
      ))}
    </div>
  );
}

export default PrayerTimesView;
