import { useState, useEffect } from "react";
import "../styles/Qibla.css";

function Qibla() {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Explicit location permissions check
    if ("geolocation" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permissionStatus) => {
          if (
            permissionStatus.state === "granted" ||
            permissionStatus.state === "prompt"
          ) {
            navigator.geolocation.getCurrentPosition(
              successCallback,
              errorCallback
            );
          } else {
            setError(
              "Location access is denied. Please allow location access in your browser settings."
            );
            setIsLoading(false);
          }
        });
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
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
    setIsLoading(false);
  };

  const errorCallback = () => {
    setError("Unable to retrieve your location.");
    setIsLoading(false);
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
    let heading;
    // Will be updated later to display a map instead of a compass on laptop
    // Check if the device has the ability to provide orientation information
    if (event.webkitCompassHeading !== undefined) {
      heading = event.webkitCompassHeading; // iOS Safari
    } else if (event.alpha !== null) {
      heading = (event.alpha + 360) % 360; // Other browsers
    } else {
      setError(
        "Compass heading not available. This feature may not be supported on your device."
      );
      return;
    }

    setCompassHeading(heading);
  };

  return (
    <div className="qibla-direction">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
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
