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
    let cleanup;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = new Coordinates(
            position.coords.latitude,
            position.coords.longitude
          );
          console.log("Geolocation data:", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp).toLocaleString(),
          });
          setLocation(coords);
          cleanup = updatePrayerTimes(coords);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError(
            "Unable to access location. Using default location (Makkah). Error: " +
              err.message
          );
          const defaultCoords = new Coordinates(21.4225, 39.8262); // Makkah
          setLocation(defaultCoords);
          cleanup = updatePrayerTimes(defaultCoords);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      const defaultCoords = new Coordinates(21.4225, 39.8262); // Makkah
      setLocation(defaultCoords);
      cleanup = updatePrayerTimes(defaultCoords);
    }

    return () => cleanup && cleanup();
  }, []);

  const updatePrayerTimes = (coords) => {
    console.log("Calculating prayer times for coords:", coords);
    const times = calculatePrayerTimes(coords);
    console.log("Calculated prayer times:", times);
    setPrayerTimes({
      fajr: times.fajr.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sunrise: times.sunrise.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      dhuhr: times.dhuhr.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      asr: times.asr.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      maghrib: times.maghrib.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isha: times.isha.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    const rawTimes = {
      fajr: times.fajr,
      sunrise: times.sunrise,
      dhuhr: times.dhuhr,
      asr: times.asr,
      maghrib: times.maghrib,
      isha: times.isha,
      location: coords,
    };
    console.log("Raw times with dates:", rawTimes);

    const now = new Date();
    console.log("Current time:", now.toLocaleString());

    const { currentPrayer, nextPrayer } = determineCurrentNextPrayer(rawTimes);
    console.log("Current prayer:", currentPrayer, "Next prayer:", nextPrayer);
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
