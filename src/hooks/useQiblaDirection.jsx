import { useState, useEffect, useCallback, useRef } from "react";
import { calculateQiblaDirection } from "../utils/qiblaUtils";

export const useQiblaDirection = () => {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [orientationSupported, setOrientationSupported] = useState(false);

  const getGeolocation = useCallback(() => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("GEOLOCATION_UNSUPPORTED");
      setIsLoading(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      setError("LOCATION_TIMEOUT");
      setIsLoading(false);
    }, 15000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({ latitude, longitude });
        setAccuracy(accuracy);
        try {
          const direction = calculateQiblaDirection(latitude, longitude);
          setQiblaDirection(direction);
        } catch (err) {
          setError("Failed to calculate Qibla direction: " + err.message);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        clearTimeout(timeoutId);
        setError(
          err.code === 1
            ? "PERMISSION_DENIED"
            : err.code === 2
            ? "LOCATION_UNAVAILABLE"
            : "Something went wrong"
        );
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const debounceTimeoutRef = useRef(null);

  const handleOrientation = useCallback(
    (event) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        if (event.alpha === null || event.alpha === undefined) {
          setOrientationSupported(false);
          setError("ORIENTATION_DATA_UNAVAILABLE");
          return;
        }

        let heading = event.webkitCompassHeading || event.alpha;
        if (event.webkitCompassHeading) {
          setCompassHeading(heading);
        } else {
          heading = 360 - event.alpha;
          setCompassHeading(heading);
        }
      }, 100);
    },
    [setOrientationSupported, setError, setCompassHeading]
  );

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.DeviceOrientationEvent &&
      typeof window.DeviceOrientationEvent.requestPermission === "function"
    ) {
      const requestPermission = async () => {
        try {
          const permission =
            await window.DeviceOrientationEvent.requestPermission();
          if (permission === "granted") {
            window.addEventListener(
              "deviceorientation",
              handleOrientation,
              true
            );
            setOrientationSupported(true);
          } else {
            setOrientationSupported(false);
            setError("ORIENTATION_PERMISSION_DENIED");
          }
        } catch (_err) {
          setOrientationSupported(false);
          setError("ORIENTATION_ERROR");
        }
      };
      requestPermission();
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation, true);
      setOrientationSupported(true);
    } else {
      setOrientationSupported(false);
      setError("ORIENTATION_UNSUPPORTED");
    }

    getGeolocation();

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [getGeolocation, handleOrientation]);

  const recalibrate = () => {
    setCompassHeading(0);
    getGeolocation();
  };

  return {
    qiblaDirection,
    compassHeading,
    error,
    isLoading,
    location,
    accuracy,
    recalibrate,
    orientationSupported,
  };
};
