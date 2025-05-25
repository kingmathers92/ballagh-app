import { useState, useEffect, useCallback } from "react";
import { useQiblaDirection } from "../hooks/useQiblaDirection";
import Spinner from "../components/Spinner";
import QiblaMap from "../components/QiblaMap";
import Compass from "../components/Compass";
import StaticQibla from "../components/StaticQibla"; // New import
import {
  calculateDistance,
  getAccuracyColor,
  getErrorMessage,
} from "../utils/qiblaUtils";

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

  useEffect(() => {
    if (location) {
      fetchNearbyMosques();
    }
  }, [location, fetchNearbyMosques]);

  return (
    <div className="qibla-direction">
      {isLoading ? (
        <Spinner />
      ) : error && !qiblaDirection ? (
        <div className="error-message">
          <p>{getErrorMessage(error)}</p>
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
            <Compass
              qiblaDirection={qiblaDirection}
              compassHeading={compassHeading}
            />
          ) : (
            <StaticQibla qiblaDirection={qiblaDirection} />
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
                <strong style={{ color: getAccuracyColor(accuracy) }}>
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
                {getErrorMessage(error)}
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
