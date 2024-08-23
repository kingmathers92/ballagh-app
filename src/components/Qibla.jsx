import { useState, useEffect } from "react";

function QiblaDirection() {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      setError("Geolocation is not supported by this browser.");
    }
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

  return (
    <div className="qibla-direction">
      {error ? (
        <p>{error}</p>
      ) : (
        <p>Your Qibla direction is: {qiblaDirection?.toFixed(2)}°</p>
      )}
    </div>
  );
}

export default QiblaDirection;
