import { useState, useEffect } from "react";
import { Coordinates } from "adhan";

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let retryTimeoutId;
    let attempt = 0;
    const maxAttempts = 2;

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (cancelled) return;
            const coords = new Coordinates(
              position.coords.latitude,
              position.coords.longitude
            );
            setLocation(coords);
          },
          (err) => {
            if (cancelled) return;
            console.error("Geolocation error (attempt " + attempt + "):", err);
            attempt++;
            if (attempt < maxAttempts) {
              retryTimeoutId = setTimeout(getLocation, 2000);
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
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        setLocation(null);
      }
    };

    getLocation();

    return () => {
      cancelled = true;
      clearTimeout(retryTimeoutId);
    };
  }, []);

  return { location, error };
};
