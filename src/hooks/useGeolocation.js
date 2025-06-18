import { useState, useEffect } from "react";
import { Coordinates } from "adhan";

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

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
                  " attempts. Please enable location services. Error: " +
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
  }, []);

  return { location, error };
};
