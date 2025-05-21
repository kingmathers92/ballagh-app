import { useState, useEffect, useCallback } from "react";
import { calculateQiblaDirection } from "../utils/qiblaUtils";
import { debounce } from "../utils/debounceUtils";

export const useQiblaDirection = () => {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0);
  const [location, setLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getGeolocation = useCallback(() => {
    setIsLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const success = (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      setLocation({ latitude, longitude });
      setAccuracy(accuracy);
      setQiblaDirection(calculateQiblaDirection(latitude, longitude));
      setIsLoading(false);
    };

    const failure = (err) => {
      setError(err.code === 1 ? "PERMISSION_DENIED" : "LOCATION_UNAVAILABLE");
      setIsLoading(false);
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(success, failure, options);
    } else {
      setError("GEOLOCATION_UNSUPPORTED");
      setIsLoading(false);
    }
  }, []);

  const handleOrientation = useCallback((event) => {
    if (event.alpha !== null) {
      const heading = event.alpha; // Compass heading (0-360)
      setCompassHeading(heading);
    }
  }, []);

  const debouncedOrientation = debounce(handleOrientation, 100);

  useEffect(() => {
    getGeolocation();

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", debouncedOrientation, true);
    }

    return () => {
      window.removeEventListener(
        "deviceorientation",
        debouncedOrientation,
        true
      );
    };
  }, [getGeolocation, debouncedOrientation]);

  const recalibrate = useCallback(() => {
    getGeolocation();
    if (window.DeviceOrientationEvent?.requestPermission) {
      window.DeviceOrientationEvent.requestPermission().then((permission) => {
        if (permission === "granted") {
          window.addEventListener(
            "deviceorientation",
            debouncedOrientation,
            true
          );
        }
      });
    }
  }, [getGeolocation, debouncedOrientation]);

  return {
    qiblaDirection,
    compassHeading,
    location,
    accuracy,
    error,
    isLoading,
    recalibrate,
  };
};
