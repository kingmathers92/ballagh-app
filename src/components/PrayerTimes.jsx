import { useState, useEffect } from "react";
import { Coordinates } from "adhan";
import {
  calculatePrayerTimes,
  determineCurrentNextPrayer,
  startCountdown,
} from "../utils/prayerUtils";

import "../styles/PrayerTimes.css";

function PrayerTimesView() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [nextPrayerCountdown, setNextPrayerCountdown] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = new Coordinates(
            position.coords.latitude,
            position.coords.longitude
          );
          setLocation(coords);
          updatePrayerTimes(coords);
        },
        (err) => {
          setError(
            "Unable to access location. Using default location (Makkah)."
          );
          const defaultCoords = new Coordinates(21.4225, 39.8262); // Makkah
          setLocation(defaultCoords);
          updatePrayerTimes(defaultCoords);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      const defaultCoords = new Coordinates(21.4225, 39.8262); // Makkah
      setLocation(defaultCoords);
      updatePrayerTimes(defaultCoords);
    }
  }, []);

  const updatePrayerTimes = (coords) => {
    const times = calculatePrayerTimes(coords);
    setPrayerTimes(times);

    const rawTimes = {
      fajr: new Date(times.fajr),
      sunrise: new Date(times.sunrise),
      dhuhr: new Date(times.dhuhr),
      asr: new Date(times.asr),
      maghrib: new Date(times.maghrib),
      isha: new Date(times.isha),
      location: coords,
    };

    const { currentPrayer, nextPrayer } = determineCurrentNextPrayer(rawTimes);
    setCurrentPrayer(currentPrayer);

    const cleanup = startCountdown(nextPrayer, setNextPrayerCountdown, () =>
      updatePrayerTimes(coords)
    );
    return cleanup;
  };

  return (
    <div className="container">
      <h2 className="title">Prayer Times</h2>
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
      {prayerTimes ? (
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
      ) : (
        <p>Loading prayer times...</p>
      )}
    </div>
  );
}

export default PrayerTimesView;
