import { useState, useEffect, useCallback, useRef } from "react";
import { Coordinates, Qibla } from "adhan";
import geomagnetism from "geomagnetism";

export const useQiblaDirection = () => {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [orientationSupported, setOrientationSupported] = useState(false);
  const declinationRef = useRef(0);

  const attemptRef = useRef(0);

  const getGeolocation = useCallback(() => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("GEOLOCATION_UNSUPPORTED");
      setIsLoading(false);
      return;
    }

    const attempt = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          attemptRef.current = 0;
          const { latitude, longitude, accuracy } = position.coords;
          setLocation({ latitude, longitude });
          setAccuracy(accuracy);
          try {
            declinationRef.current = geomagnetism
              .model()
              .point([latitude, longitude]).decl;
          } catch (declErr) {
            console.error("Error computing magnetic declination:", declErr);
            declinationRef.current = 0;
          }
          try {
            const coords = new Coordinates(latitude, longitude);
            const direction = Qibla(coords);
            setQiblaDirection(direction);
          } catch (err) {
            setError("Failed to calculate Qibla direction: " + err.message);
          } finally {
            setIsLoading(false);
          }
        },
        (err) => {
          if (attemptRef.current < 1 && err.code !== 1) {
            attemptRef.current += 1;
            setTimeout(attempt, 1500);
            return;
          }
          attemptRef.current = 0;
          setError(
            err.code === 1
              ? "PERMISSION_DENIED"
              : err.code === 2
                ? "LOCATION_UNAVAILABLE"
                : err.code === 3
                  ? "LOCATION_TIMEOUT"
                  : "Something went wrong",
          );
          setIsLoading(false);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
      );
    };

    attempt();
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
          heading = event.webkitCompassHeading;
        } else {
          heading = 360 - event.alpha;
        }
        const trueHeading = (heading + declinationRef.current + 360) % 360;
        setCompassHeading(trueHeading);
      }, 100);
    },
    [setOrientationSupported, setError, setCompassHeading],
  );

  useEffect(() => {
    let receivedAbsolute = false;
    const handleAbsolute = (event) => {
      receivedAbsolute = true;
      handleOrientation(event);
    };
    const handleRelativeFallback = (event) => {
      if (!receivedAbsolute) handleOrientation(event);
    };

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
              true,
            );
            setOrientationSupported(true);
          } else {
            setOrientationSupported(false);
            setError("ORIENTATION_PERMISSION_DENIED");
          }
        } catch {
          setOrientationSupported(false);
          setError("ORIENTATION_ERROR");
        }
      };
      requestPermission();
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener(
        "deviceorientationabsolute",
        handleAbsolute,
        true,
      );
      window.addEventListener(
        "deviceorientation",
        handleRelativeFallback,
        true,
      );
      setOrientationSupported(true);
    } else {
      setOrientationSupported(false);
      setError("ORIENTATION_UNSUPPORTED");
    }

    getGeolocation();

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
      window.removeEventListener(
        "deviceorientationabsolute",
        handleAbsolute,
        true,
      );
      window.removeEventListener(
        "deviceorientation",
        handleRelativeFallback,
        true,
      );
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
