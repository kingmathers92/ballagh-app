import { useState, useEffect } from "react";
import { Coordinates } from "adhan";
import {
  calculatePrayerTimes,
  determineCurrentNextPrayer,
  startCountdown,
  determineRamadanTimes,
  startRamadanCountdown,
} from "../utils/prayerUtils";

import "../styles/PrayerTimes.css";

function PrayerTimesView() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [nextPrayerCountdown, setNextPrayerCountdown] = useState(null);
  const [ramadanTimes, setRamadanTimes] = useState(null);
  const [nextEventCountdown, setNextEventCountdown] = useState(null);
  const [manualCoords, setManualCoords] = useState({
    latitude: 52.52,
    longitude: 13.405,
  });
  const ramadanStart = new Date("2025-03-01");

  useEffect(() => {
    let cleanup;
    let attempt = 0;
    const maxAttempts = 2;

    const getLocation = () => {
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
            cleanup = updateTimes(coords);
          },
          (err) => {
            console.error("Geolocation error (attempt " + attempt + "):", err);
            attempt++;
            if (attempt < maxAttempts) {
              setTimeout(getLocation, 2000);
            } else {
              setError(
                "Unable to access accurate location after " +
                  maxAttempts +
                  " attempts. Please set manual location. Error: " +
                  err.message
              );
              setLocation(null);
            }
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        setLocation(null);
      }
    };

    getLocation();
    return () => cleanup && cleanup();
  }, [manualCoords]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateTimes = (coords) => {
    if (!coords) return () => {};
    console.log("Calculating times for coords:", coords);
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

    const { currentPrayer, nextPrayer } = determineCurrentNextPrayer(rawTimes);
    setCurrentPrayer(currentPrayer);

    const prayerCleanup = startCountdown(
      nextPrayer,
      setNextPrayerCountdown,
      () => updateTimes(coords)
    );

    const ramadanData = determineRamadanTimes(rawTimes, ramadanStart);
    setRamadanTimes(ramadanData);

    const eventCleanup = startRamadanCountdown(
      ramadanData.nextEvent,
      setNextEventCountdown,
      () => updateTimes(coords)
    );

    // Add 15-minute pre-Suhoor reminder
    if (
      ramadanData.nextEvent.name === "Suhoor" &&
      ramadanData.nextEvent.time > new Date()
    ) {
      const timeUntilSuhoor = ramadanData.nextEvent.time - new Date();
      if (timeUntilSuhoor > 15 * 60 * 1000) {
        // Only set if more than 15 mins away
        setTimeout(
          () => alert("Suhoor ends at Fajr in 15 minutes!"),
          timeUntilSuhoor - 15 * 60 * 1000
        );
      }
    } else if (
      ramadanData.nextEvent.name === "Iftar" &&
      ramadanData.nextEvent.time > new Date()
    ) {
      setTimeout(
        () => alert("Time for Iftar is approaching!"),
        ramadanData.nextEvent.time - new Date() - 5 * 60 * 1000
      ); // 5 mins before
    }

    return () => {
      prayerCleanup && prayerCleanup();
      eventCleanup && eventCleanup();
    };
  };

  const handleManualLocation = (e) => {
    e.preventDefault();
    const coords = new Coordinates(
      manualCoords.latitude,
      manualCoords.longitude
    );
    setLocation(coords);
    updateTimes(coords);
  };

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
            Time until next event: {nextEventCountdown || "Calculating..."}
          </p>
          <p>Current State: {ramadanTimes.currentEvent}</p>
        </div>
      )}
      <form onSubmit={handleManualLocation} style={{ margin: "15px 0" }}>
        <input
          type="number"
          value={manualCoords.latitude}
          onChange={(e) =>
            setManualCoords({
              ...manualCoords,
              latitude: Number(e.target.value),
            })
          }
          placeholder="Latitude"
          step="0.0001"
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          value={manualCoords.longitude}
          onChange={(e) =>
            setManualCoords({
              ...manualCoords,
              longitude: Number(e.target.value),
            })
          }
          placeholder="Longitude"
          step="0.0001"
          style={{ marginRight: "10px" }}
        />
        <button type="submit">Set Manual Location</button>
      </form>
    </div>
  );
}

export default PrayerTimesView;
