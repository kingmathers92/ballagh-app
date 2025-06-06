import { useState, useEffect } from "react";
import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";

function PrayerTimesView() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [nextPrayerCountdown, setNextPrayerCountdown] = useState(null);

  useEffect(() => {
    // fetching user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = new Coordinates(
            position.coords.latitude,
            position.coords.longitude
          );
          setLocation(coords);
          calculatePrayerTimes(coords);
        },
        (err) => {
          setError(
            "Unable to access location. Using default location (Makkah)."
          );
          const defaultCoords = new Coordinates(21.4225, 39.8262); // Makkah
          setLocation(defaultCoords);
          calculatePrayerTimes(defaultCoords);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      const defaultCoords = new Coordinates(21.4225, 39.8262); // Makkah
      setLocation(defaultCoords);
      calculatePrayerTimes(defaultCoords);
    }
  }, []);

  const calculatePrayerTimes = (coords) => {
    const date = new Date();
    const params = CalculationMethod.MuslimWorldLeague();
    const times = new PrayerTimes(coords, date, params);

    // Format times to local timezone
    const formattedTimes = {
      fajr: new Date(times.fajr).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sunrise: new Date(times.sunrise).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      dhuhr: new Date(times.dhuhr).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      asr: new Date(times.asr).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      maghrib: new Date(times.maghrib).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isha: new Date(times.isha).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setPrayerTimes(formattedTimes);

    // Storing raw Date objects for comparison
    const rawTimes = {
      fajr: new Date(times.fajr),
      sunrise: new Date(times.sunrise),
      dhuhr: new Date(times.dhuhr),
      asr: new Date(times.asr),
      maghrib: new Date(times.maghrib),
      isha: new Date(times.isha),
    };

    // getting current and next prayer
    const now = new Date();
    let current = null;
    let nextPrayer = null;
    const prayerOrder = [
      { name: "fajr", time: rawTimes.fajr },
      { name: "sunrise", time: rawTimes.sunrise },
      { name: "dhuhr", time: rawTimes.dhuhr },
      { name: "asr", time: rawTimes.asr },
      { name: "maghrib", time: rawTimes.maghrib },
      { name: "isha", time: rawTimes.isha },
    ];

    for (let i = 0; i < prayerOrder.length; i++) {
      if (now < prayerOrder[i].time) {
        nextPrayer = prayerOrder[i];
        if (i > 0) {
          current = prayerOrder[i - 1].name;
        }
        break;
      }
    }

    // If no next prayer today, set next prayer to tomorrow's Fajr
    if (!nextPrayer) {
      current = "isha";
      const tomorrow = new Date(date);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowTimes = new PrayerTimes(coords, tomorrow, params);
      nextPrayer = { name: "fajr", time: new Date(tomorrowTimes.fajr) };
    } else if (!current) {
      current = "isha"; // Before Fajr, consider Isha as current
    }

    setCurrentPrayer(current);

    // Starting countdown to next prayer
    const updateCountdown = () => {
      const now = new Date();
      const diff = nextPrayer.time - now;
      if (diff <= 0) {
        calculatePrayerTimes(coords); // calculate again if next prayer has passed
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setNextPrayerCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
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
        <p className="description">
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
