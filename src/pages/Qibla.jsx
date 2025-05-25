import { useState, useEffect, useCallback } from "react";
import { useQiblaDirection } from "../hooks/useQiblaDirection";
import Spinner from "../components/Spinner";
import QiblaMap from "../components/QiblaMap";

import "../styles/Qibla.css";

function Qibla() {
  const {
    qiblaDirection,
    compassHeading,
    error,
    isLoading,
    location,
    accuracy,
    recalibrate,
    orientationSupported,
  } = useQiblaDirection();

  const [mosques, setMosques] = useState([]);
  const [fetchingMosques, setFetchingMosques] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const fetchNearbyMosques = useCallback(async () => {
    if (!location) return;
    setFetchingMosques(true);
    setFetchError(null);
    try {
      const overpassQuery = `
        [out:json];
        node["amenity"="place_of_worship"]["religion"="muslim"]
        (around:5000,${location.latitude},${location.longitude});
        out body;
      `;
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: overpassQuery,
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch mosques: ${response.statusText}`);
      }
      const data = await response.json();
      const mosqueList = data.elements.map((element) => ({
        name: element.tags.name || "Unnamed Mosque",
        lat: element.lat,
        lon: element.lon,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          element.lat,
          element.lon
        ),
      }));
      setMosques(mosqueList.sort((a, b) => a.distance - b.distance));
    } catch (_err) {
      console.error("Error fetching mosques:", _err);
      setFetchError("Failed to fetch nearby mosques. Please try again later.");
    } finally {
      setFetchingMosques(false);
    }
  }, [location]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (location) {
      fetchNearbyMosques();
    }
  }, [location, fetchNearbyMosques]);

  const getCompassStyle = () => ({
    transform: `rotate(${compassHeading}deg)`,
  });

  const getQiblaMarkerStyle = () => ({
    transform: `rotate(${qiblaDirection}deg)`,
    animationDelay: `${Math.random() * 0.5}s`,
  });

  const getAccuracyColor = () => {
    if (!accuracy) return "gray";
    if (accuracy <= 15) return "#4CAF50";
    if (accuracy <= 30) return "#FFC107";
    return "#F44336";
  };

  const getErrorMessage = () => {
    switch (error) {
      case "PERMISSION_DENIED":
        return "Location access denied. Please enable location services.";
      case "LOCATION_UNAVAILABLE":
        return "Unable to retrieve location. Please try again.";
      case "GEOLOCATION_UNSUPPORTED":
        return "Geolocation is not supported on this device.";
      case "ORIENTATION_PERMISSION_DENIED":
        return "Device orientation permission denied. Please allow motion access.";
      case "ORIENTATION_UNSUPPORTED":
        return "Device orientation is not supported on this device. Please use the Qibla direction value manually.";
      case "ORIENTATION_ERROR":
        return "An error occurred while accessing device orientation.";
      case "ORIENTATION_DATA_UNAVAILABLE":
        return "Device orientation data is unavailable. Please use the Qibla direction value manually.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  return (
    <div className="qibla-direction">
      {isLoading ? (
        <Spinner />
      ) : error && !qiblaDirection ? (
        <div className="error-message">
          <p>{getErrorMessage()}</p>
          <button className="retry-button" onClick={recalibrate}>
            Try Again
          </button>
        </div>
      ) : (
        <>
          {location && qiblaDirection !== null && (
            <div className="qibla-map-container">
              <QiblaMap location={location} qiblaDirection={qiblaDirection} />
            </div>
          )}

          {orientationSupported ? (
            <div className="compass-container">
              <div className="compass" style={getCompassStyle()}>
                <div className="compass-rose">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="compass-mark"
                      style={{ transform: `rotate(${i * 45}deg)` }}
                    />
                  ))}
                </div>
                <div className="compass-arrow"></div>
                {qiblaDirection !== null && (
                  <>
                    <div
                      className="qibla-marker"
                      style={getQiblaMarkerStyle()}
                    ></div>
                    <div
                      className="qibla-line"
                      style={getQiblaMarkerStyle()}
                    ></div>
                  </>
                )}
              </div>
              <div className="compass-labels">
                <span>N</span>
                <span>E</span>
                <span>S</span>
                <span>W</span>
              </div>
            </div>
          ) : (
            <div className="static-qibla-container">
              <div className="static-qibla-direction">
                <div
                  className="static-qibla-arrow"
                  style={{ transform: `rotate(${qiblaDirection}deg)` }}
                ></div>
                <p className="static-instruction">
                  Qibla is at {qiblaDirection?.toFixed(1)}°. Face this direction
                  to align with the Qibla.
                </p>
              </div>
            </div>
          )}

          <div className="nearby-mosques">
            <h3>Nearby Mosques</h3>
            {fetchingMosques ? (
              <Spinner />
            ) : fetchError ? (
              <p className="error-text">{fetchError}</p>
            ) : mosques.length > 0 ? (
              <ul>
                {mosques.slice(0, 5).map((mosque, index) => (
                  <li key={index} className="mosque-item">
                    <span>{mosque.name}</span>
                    <span>{mosque.distance.toFixed(2)} km away</span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mosque-directions"
                    >
                      Get Directions
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No mosques found nearby.</p>
            )}
          </div>

          <div className="qibla-info">
            <p>
              Qibla Direction: <strong>{qiblaDirection?.toFixed(1)}°</strong>
            </p>
            <p>
              Your Location:{" "}
              <strong>
                {location?.latitude?.toFixed(4)},{" "}
                {location?.longitude?.toFixed(4)}
              </strong>
            </p>
            {accuracy && (
              <p>
                Accuracy:{" "}
                <strong style={{ color: getAccuracyColor() }}>
                  {accuracy.toFixed(0)} meters
                </strong>
              </p>
            )}
            {orientationSupported && (
              <p className="instruction">
                Rotate your device until the compass needle (North) aligns with
                the Qibla marker to face the Qibla.
              </p>
            )}
            {error && (
              <p className="error-text">
                {getErrorMessage()}
                <button className="retry-button inline" onClick={recalibrate}>
                  Try Again
                </button>
              </p>
            )}
          </div>

          <div className="action-buttons">
            <button className="calibrate-button" onClick={recalibrate}>
              <i className="icon-sync"></i> Recalibrate
            </button>
            <button
              className="guide-button"
              onClick={() =>
                window.open("https://qiblafinder.withgoogle.com", "_blank")
              }
            >
              <i className="icon-help"></i> Qibla Guide
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Qibla;
