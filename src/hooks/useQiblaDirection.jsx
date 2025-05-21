import { useState, useEffect, useCallback, useMemo } from "react";
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
    console.log("getGeolocation: Starting geolocation fetch...");
    setIsLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const success = (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      console.log(
        `getGeolocation: Success - Lat: ${latitude}, Lon: ${longitude}, Accuracy: ${accuracy}`
      );
      setLocation({ latitude, longitude });
      setAccuracy(accuracy);
      const direction = calculateQiblaDirection(latitude, longitude);
      setQiblaDirection(direction);
      console.log(`getGeolocation: Qibla Direction: ${direction}°`);
      setIsLoading(false);
    };

    const failure = (err) => {
      console.error("getGeolocation: Error -", err.message);
      setError(err.code === 1 ? "PERMISSION_DENIED" : "LOCATION_UNAVAILABLE");
      setIsLoading(false);
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(success, failure, options);
    } else {
      console.error("getGeolocation: Geolocation not supported");
      setError("GEOLOCATION_UNSUPPORTED");
      setIsLoading(false);
    }
  }, []);

  const handleOrientation = useCallback((event) => {
    if (event.alpha !== null) {
      const heading = event.alpha;
      console.log(`handleOrientation: Compass Heading: ${heading}°`);
      setCompassHeading(heading);
    } else {
      console.warn(
        "handleOrientation: Alpha is null, device orientation may not be supported"
      );
    }
  }, []);

  // Memoize the debounced function to prevent recreation on every render
  const debouncedOrientation = useMemo(
    () => debounce(handleOrientation, 100),
    [handleOrientation]
  );

  useEffect(() => {
    console.log("useEffect: Initial setup...");
    getGeolocation();

    const setupOrientation = async () => {
      console.log("setupOrientation: Checking device orientation support...");
      if (window.DeviceOrientationEvent) {
        if (typeof DeviceOrientationEvent.requestPermission === "function") {
          console.log(
            "setupOrientation: Requesting device orientation permission..."
          );
          try {
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === "granted") {
              console.log(
                "setupOrientation: Permission granted, adding event listener..."
              );
              window.addEventListener(
                "deviceorientation",
                debouncedOrientation,
                true
              );
            } else {
              console.error(
                "setupOrientation: Device orientation permission denied"
              );
              setError("ORIENTATION_PERMISSION_DENIED");
              setIsLoading(false);
            }
          } catch (err) {
            console.error(
              "setupOrientation: Error requesting permission -",
              err.message
            );
            setError("ORIENTATION_ERROR");
            setIsLoading(false);
          }
        } else {
          console.log(
            "setupOrientation: Adding event listener (no permission required)..."
          );
          window.addEventListener(
            "deviceorientation",
            debouncedOrientation,
            true
          );
        }
      } else {
        console.error("setupOrientation: Device orientation not supported");
        setError("ORIENTATION_UNSUPPORTED");
        setIsLoading(false);
      }
    };

    setupOrientation();

    return () => {
      console.log("useEffect: Cleaning up event listener...");
      window.removeEventListener(
        "deviceorientation",
        debouncedOrientation,
        true
      );
    };
  }, [getGeolocation, debouncedOrientation]);

  const recalibrate = useCallback(() => {
    console.log("recalibrate: Recalibrating...");
    getGeolocation();

    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      console.log("recalibrate: Requesting device orientation permission...");
      DeviceOrientationEvent.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            console.log(
              "recalibrate: Permission granted, adding event listener..."
            );
            window.addEventListener(
              "deviceorientation",
              debouncedOrientation,
              true
            );
          } else {
            console.error("recalibrate: Device orientation permission denied");
            setError("ORIENTATION_PERMISSION_DENIED");
          }
        })
        .catch((err) => {
          console.error(
            "recalibrate: Error requesting permission -",
            err.message
          );
          setError("ORIENTATION_ERROR");
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
