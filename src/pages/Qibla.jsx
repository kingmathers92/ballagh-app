import { useQiblaDirection } from "../hooks/useQiblaDirection";
import Spinner from "../components/Spinner";

import "../styles/Qibla.css";

function Qibla() {
  const {
    qiblaDirection,
    compassHeading,
    error,
    isLoading,
    location,
    accuracy,
    recalibrate,
    orientationSupported,
  } = useQiblaDirection();

  const getCompassStyle = () => ({
    transform: `rotate(${compassHeading}deg)`,
  });

  const getQiblaMarkerStyle = () => ({
    transform: `rotate(${qiblaDirection}deg)`,
    animationDelay: `${Math.random() * 0.5}s`,
  });

  const getAccuracyColor = () => {
    if (!accuracy) return "gray";
    if (accuracy <= 15) return "#4CAF50";
    if (accuracy <= 30) return "#FFC107";
    return "#F44336";
  };

  const getErrorMessage = () => {
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

  return (
    <div className="qibla-direction">
      {isLoading ? (
        <Spinner />
      ) : error && !qiblaDirection ? (
        <div className="error-message">
          <p>{getErrorMessage()}</p>
          <button className="retry-button" onClick={recalibrate}>
            Try Again
          </button>
        </div>
      ) : (
        <>
          {orientationSupported ? (
            <div className="compass-container">
              <div className="compass" style={getCompassStyle()}>
                <div className="compass-rose">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="compass-mark"
                      style={{ transform: `rotate(${i * 45}deg)` }}
                    />
                  ))}
                </div>
                <div className="compass-arrow"></div>
                {qiblaDirection !== null && (
                  <>
                    <div
                      className="qibla-marker"
                      style={getQiblaMarkerStyle()}
                    ></div>
                    <div
                      className="qibla-line"
                      style={getQiblaMarkerStyle()}
                    ></div>
                  </>
                )}
              </div>
              <div className="compass-labels">
                <span>N</span>
                <span>E</span>
                <span>S</span>
                <span>W</span>
              </div>
            </div>
          ) : (
            <div className="static-qibla-container">
              <div className="static-qibla-direction">
                <div
                  className="static-qibla-arrow"
                  style={{ transform: `rotate(${qiblaDirection}deg)` }}
                ></div>
                <p className="static-instruction">
                  Qibla is at {qiblaDirection?.toFixed(1)}°. Face this direction
                  to align with the Qibla.
                </p>
              </div>
            </div>
          )}

          <div className="qibla-info">
            <p>
              Qibla Direction: <strong>{qiblaDirection?.toFixed(1)}°</strong>
            </p>
            <p>
              Your Location:{" "}
              <strong>
                {location?.latitude?.toFixed(4)},{" "}
                {location?.longitude?.toFixed(4)}
              </strong>
            </p>
            {accuracy && (
              <p>
                Accuracy:{" "}
                <strong style={{ color: getAccuracyColor() }}>
                  {accuracy.toFixed(0)} meters
                </strong>
              </p>
            )}
            {orientationSupported && (
              <p className="instruction">
                Rotate your device until the compass needle (North) aligns with
                the Qibla marker to face the Qibla.
              </p>
            )}
            {error && (
              <p className="error-text">
                {getErrorMessage()}
                <button className="retry-button inline" onClick={recalibrate}>
                  Try Again
                </button>
              </p>
            )}
          </div>

          <div className="action-buttons">
            <button className="calibrate-button" onClick={recalibrate}>
              <i className="icon-sync"></i> Recalibrate
            </button>
            <button
              className="guide-button"
              onClick={() =>
                window.open("https://qiblafinder.withgoogle.com", "_blank")
              }
            >
              <i className="icon-help"></i> Qibla Guide
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Qibla;
