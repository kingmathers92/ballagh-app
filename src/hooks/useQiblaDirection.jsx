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
  const [orientationSupported, setOrientationSupported] = useState(true);
  const [orientationDataReceived, setOrientationDataReceived] = useState(false);

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
    console.log("handleOrientation: Event received -", event);
    if (event.alpha !== null) {
      let heading = event.alpha;
      if (event.webkitCompassHeading !== undefined) {
        console.log("handleOrientation: Using webkitCompassHeading for iOS...");
        heading = event.webkitCompassHeading;
      }
      if (!event.absolute && event.alpha !== null) {
        console.warn(
          "handleOrientation: Absolute orientation not available, using relative alpha..."
        );
      }
      console.log(`handleOrientation: Compass Heading: ${heading}°`);
      setCompassHeading(heading);
      setOrientationDataReceived(true);
    } else {
      console.warn(
        "handleOrientation: Alpha is null, device orientation may not be supported"
      );
      setOrientationSupported(false);
      setError("ORIENTATION_DATA_UNAVAILABLE");
    }
  }, []);

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
              window.addEventListener(
                "deviceorientationabsolute",
                debouncedOrientation,
                true
              );
            } else {
              console.error(
                "setupOrientation: Device orientation permission denied"
              );
              setError("ORIENTATION_PERMISSION_DENIED");
              setOrientationSupported(false);
              setIsLoading(false);
            }
          } catch (err) {
            console.error(
              "setupOrientation: Error requesting permission -",
              err.message
            );
            setError("ORIENTATION_ERROR");
            setOrientationSupported(false);
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
          window.addEventListener(
            "deviceorientationabsolute",
            debouncedOrientation,
            true
          );
        }
      } else {
        console.error("setupOrientation: Device orientation not supported");
        setError("ORIENTATION_UNSUPPORTED");
        setOrientationSupported(false);
        setIsLoading(false);
      }
    };

    setupOrientation();

    // Timeout to check if orientation data is received
    const orientationTimeout = setTimeout(() => {
      if (!orientationDataReceived && orientationSupported) {
        console.warn(
          "setupOrientation: No orientation data received after 5 seconds"
        );
        setError("ORIENTATION_DATA_UNAVAILABLE");
        setOrientationSupported(false);
      }
    }, 5000);

    return () => {
      console.log("useEffect: Cleaning up event listeners...");
      window.removeEventListener(
        "deviceorientation",
        debouncedOrientation,
        true
      );
      window.removeEventListener(
        "deviceorientationabsolute",
        debouncedOrientation,
        true
      );
      clearTimeout(orientationTimeout);
    };
  }, [
    getGeolocation,
    debouncedOrientation,
    orientationDataReceived,
    orientationSupported,
  ]);

  const recalibrate = useCallback(() => {
    console.log("recalibrate: Recalibrating...");
    setOrientationSupported(true);
    setOrientationDataReceived(false);
    setError(null);
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
            window.addEventListener(
              "deviceorientationabsolute",
              debouncedOrientation,
              true
            );
          } else {
            console.error("recalibrate: Device orientation permission denied");
            setError("ORIENTATION_PERMISSION_DENIED");
            setOrientationSupported(false);
          }
        })
        .catch((err) => {
          console.error(
            "recalibrate: Error requesting permission -",
            err.message
          );
          setError("ORIENTATION_ERROR");
          setOrientationSupported(false);
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
    orientationSupported,
  };
};
