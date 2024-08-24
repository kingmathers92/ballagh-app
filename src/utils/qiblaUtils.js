export const calculateQiblaDirection = (latitude, longitude) => {
  const kaabaLatitude = 21.4225;
  const kaabaLongitude = 39.8262;
  const phiK = (kaabaLatitude * Math.PI) / 180.0;
  const lambdaK = (kaabaLongitude * Math.PI) / 180.0;
  const phi = (latitude * Math.PI) / 180.0;
  const lambda = (longitude * Math.PI) / 180.0;
  const qiblaDirection =
    (Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) -
        Math.sin(phi) * Math.cos(lambdaK - lambda)
    ) *
      180.0) /
    Math.PI;
  return (qiblaDirection + 360.0) % 360.0;
};

export const handleOrientation = (event, setCompassHeading, setError) => {
  let heading;
  // Will be updated later to display a map instead of a compass on laptop
  // Check if the device has the ability to provide orientation
  if (event.webkitCompassHeading !== undefined) {
    heading = event.webkitCompassHeading; // iOS Safari
  } else if (event.alpha !== null) {
    heading = (event.alpha + 360) % 360; // Other browsers
  } else {
    setError(
      "Compass heading not available. This feature may not be supported on your device."
    );
    return;
  }
  setCompassHeading(heading);
};
