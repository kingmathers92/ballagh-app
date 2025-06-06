/**
 * Calculates the distance between two points on Earth using the Haversine formula.
 * @param {number} lat1 - Latitude of the first point.
 * @param {number} lon1 - Longitude of the first point.
 * @param {number} lat2 - Latitude of the second point.
 * @param {number} lon2 - Longitude of the second point.
 * @returns {number} Distance in kilometers.
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance < 0.01 ? 0 : distance; // return 0 if extremely close
};

/**
 * Returns the style for the compass based on heading.
 * @param {number} compassHeading - The heading in degrees.
 * @returns {Object} CSS transform style.
 */
export const getCompassStyle = (compassHeading) => ({
  transform: `rotate(${compassHeading}deg)`,
});

/**
 * Returns the style for the Qibla marker.
 * @param {number} qiblaDirection - The Qibla direction in degrees.
 * @returns {Object} CSS transform and animation style.
 */
export const getQiblaMarkerStyle = (qiblaDirection) => ({
  transform: `rotate(${qiblaDirection}deg)`,
  animationDelay: `${Math.random() * 0.5}s`,
});

/**
 * Returns a color based on location accuracy using theme variables.
 * @param {number|null} accuracy - The accuracy in meters.
 * @returns {string} CSS variable for the color.
 */
export const getAccuracyColor = (accuracy) => {
  if (!accuracy) return "var(--secondary-color)";
  if (accuracy <= 15) return "var(--accent-color)";
  if (accuracy <= 30) return "var(--text-color)";
  return "var(--error-color, #F44336)";
};

/**
 * Maps Qibla-related errors to user-friendly messages.
 * @param {string} error - The error code or message.
 * @returns {string} A user-friendly error message.
 */
export const getErrorMessage = (error) => {
  switch (error) {
    case "PERMISSION_DENIED":
      return "Location access denied. Please enable location services in your browser settings (e.g., Chrome: Settings > Privacy and security > Site settings > Location).";
    case "LOCATION_UNAVAILABLE":
      return "Unable to retrieve location. Ensure your device has GPS enabled and try again.";
    case "GEOLOCATION_UNSUPPORTED":
      return "Geolocation is not supported on this device. Please use a device with location capabilities.";
    case "ORIENTATION_PERMISSION_DENIED":
      return "Device orientation permission denied. Please allow motion access in your browser settings (e.g., Safari: Settings > Websites > Motion & Orientation Access).";
    case "ORIENTATION_UNSUPPORTED":
      return "Device orientation is not supported on this device. Please use the Qibla direction value manually.";
    case "ORIENTATION_ERROR":
      return "An error occurred while accessing device orientation. Please ensure your device supports motion sensors.";
    case "ORIENTATION_DATA_UNAVAILABLE":
      return "Device orientation data is unavailable. Please use the Qibla direction value manually.";
    case "LOCATION_TIMEOUT":
      return "Location request timed out. Please check your connection and try again.";
    default:
      return error?.startsWith?.("Failed to calculate Qibla direction")
        ? error
        : "Something went wrong. Please try again.";
  }
};
