export const calculateQiblaDirection = (latitude, longitude) => {
  const kaabaLat = 21.4225;
  const kaabaLon = 39.8262;

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

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getCompassStyle = (compassHeading) => ({
  transform: `rotate(${compassHeading}deg)`,
});

export const getQiblaMarkerStyle = (qiblaDirection) => ({
  transform: `rotate(${qiblaDirection}deg)`,
  animationDelay: `${Math.random() * 0.5}s`,
});

export const getAccuracyColor = (accuracy) => {
  if (!accuracy) return "gray";
  if (accuracy <= 15) return "#4CAF50";
  if (accuracy <= 30) return "#FFC107";
  return "#F44336";
};

export const getErrorMessage = (error) => {
  switch (error) {
    case "PERMISSION_DENIED":
      return "Location access denied. Please enable location services.";
    case "LOCATION_UNAVAILABLE":
      return "Unable to retrieve location. Please try again.";
    case "GEOLOCATION_UNSUPPORTED":
      return "Geolocation is not supported on this device.";
    case "ORIENTATION_PERMISSION_DENIED":
      return "Device orientation permission denied. Please allow motion access.";
    case "ORIENTATION_UNSUPPORTED":
      return "Device orientation is not supported on this device. Please use the Qibla direction value manually.";
    case "ORIENTATION_ERROR":
      return "An error occurred while accessing device orientation.";
    case "ORIENTATION_DATA_UNAVAILABLE":
      return "Device orientation data is unavailable. Please use the Qibla direction value manually.";
    default:
      return "Something went wrong. Please try again.";
  }
};
