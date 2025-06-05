import { useState, useEffect } from "react";
import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";

function PrayerTimesView() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
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
          const defaultCoords = new Coordinates(21.4225, 39.8262);
          setLocation(defaultCoords);
          calculatePrayerTimes(defaultCoords);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      const defaultCoords = new Coordinates(21.4225, 39.8262);
      setLocation(defaultCoords);
      calculatePrayerTimes(defaultCoords);
    }
  }, []);

  const calculatePrayerTimes = (coords) => {
    const date = new Date();
    const params = CalculationMethod.MuslimWorldLeague();
    const times = new PrayerTimes(coords, date, params);

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
      {prayerTimes ? (
        <div className="prayer-times">
          <p>Fajr: {prayerTimes.fajr}</p>
          <p>Sunrise: {prayerTimes.sunrise}</p>
          <p>Dhuhr: {prayerTimes.dhuhr}</p>
          <p>Asr: {prayerTimes.asr}</p>
          <p>Maghrib: {prayerTimes.maghrib}</p>
          <p>Isha: {prayerTimes.isha}</p>
        </div>
      ) : (
        <p>Loading prayer times...</p>
      )}
    </div>
  );
}

export default PrayerTimesView;
