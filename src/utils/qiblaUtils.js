/**
 * Calculates the Qibla direction from the detected user's location.
 * @param {number} latitude - The latitude of the user's location (-90 to 90).
 * @param {number} longitude - The longitude of the user's location (-180 to 180).
 * @returns {number} The Qibla direction in degrees (0-360).
 * @throws {Error} If the latitude or longitude is invalid.
 */
export const calculateQiblaDirection = (latitude, longitude) => {
  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    isNaN(latitude) ||
    isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error("Invalid latitude or longitude");
  }

  // More precise Kaaba coordinates
  const kaabaLat = 21.422487;
  const kaabaLon = 39.826206;

  // Check if the user is at the Kaaba (within 10 meters)
  const distanceToKaaba = calculateDistance(
    latitude,
    longitude,
    kaabaLat,
    kaabaLon
  );
  if (distanceToKaaba < 0.01) {
    return 0;
  }

  const lat1 = (latitude * Math.PI) / 180;
  const lon1 = (longitude * Math.PI) / 180;
  const lat2 = (kaabaLat * Math.PI) / 180;
  const lon2 = (kaabaLon * Math.PI) / 180;

  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  let direction = Math.atan2(y, x);
  direction = (direction * 180) / Math.PI;
  direction = (direction + 360) % 360;
  return direction;
};

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

/**
 * Debounces a function to limit execution rate.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The wait time in milliseconds.
 * @param {boolean} [leading=false] - Whether to execute the function on the leading edge.
 * @returns {Function} The debounced function.
 */
export const debounce = (func, wait, leading = false) => {
  let timeout;
  return (...args) => {
    const context = this;
    const later = () => {
      timeout = null;
      if (!leading) func.apply(context, args);
    };
    const callNow = leading && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
