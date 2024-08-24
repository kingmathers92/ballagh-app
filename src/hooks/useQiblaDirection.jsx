import { useState, useEffect } from "react";
import {
  calculateQiblaDirection,
  handleOrientation,
} from "../utils/qiblaUtils";

export const useQiblaDirection = () => {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const requestGeolocationPermission = () => {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permissionStatus) => {
          if (
            permissionStatus.state === "granted" ||
            permissionStatus.state === "prompt"
          ) {
            getGeolocation();
          } else {
            setError(
              "Location access is denied. Please allow location access in your browser settings."
            );
            setIsLoading(false);
          }
        });
    };

    const getGeolocation = () => {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    };

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

    if ("geolocation" in navigator) {
      requestGeolocationPermission();
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }

    window.addEventListener(
      "deviceorientation",
      handleOrientationWrapper,
      true
    );

    return () => {
      window.removeEventListener(
        "deviceorientation",
        handleOrientationWrapper,
        true
      );
    };
  }, []);

  const handleOrientationWrapper = (event) => {
    handleOrientation(event, setCompassHeading, setError);
  };

  return { qiblaDirection, compassHeading, error, isLoading };
};
