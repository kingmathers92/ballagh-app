import { useState, useEffect } from "react";
import "../styles/Qibla.css";

function Qibla() {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      setError("Geolocation is not supported by this browser.");
    }

    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  const successCallback = (position) => {
    const { latitude, longitude } = position.coords;
    const direction = calculateQiblaDirection(latitude, longitude);
    setQiblaDirection(direction);
  };

  const errorCallback = () => {
    setError("Unable to retrieve your location.");
  };

  const calculateQiblaDirection = (latitude, longitude) => {
    const kaabaLatitude = 21.4225;
    const kaabaLongitude = 39.8262;
    const phiK = (kaabaLatitude * Math.PI) / 180.0;
    const lambdaK = (kaabaLongitude * Math.PI) / 180.0;
    const phi = (latitude * Math.PI) / 180.0;
    const lambda = (longitude * Math.PI) / 180.0;
    const qiblaDirection =
      (Math.atan2(
        Math.sin(lambdaK - lambda),
        Math.cos(phi) * Math.tan(phiK) -
          Math.sin(phi) * Math.cos(lambdaK - lambda)
      ) *
        180.0) /
      Math.PI;
    return (qiblaDirection + 360.0) % 360.0;
  };

  const handleOrientation = (event) => {
    let heading = event.webkitCompassHeading || Math.abs(event.alpha - 360);
    setCompassHeading(heading);
  };

  return (
    <div className="qibla-direction">
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="compass-container">
            <div
              className="compass"
              style={{ transform: `rotate(${compassHeading}deg)` }}
            >
              <div className="compass-arrow"></div>
              {qiblaDirection !== null && (
                <div
                  className="qibla-marker"
                  style={{
                    transform: `rotate(${qiblaDirection}deg)`,
                  }}
                ></div>
              )}
            </div>
          </div>
          <p>Your Qibla direction is: {qiblaDirection?.toFixed(2)}°</p>
        </>
      )}
    </div>
  );
}

export default Qibla;
