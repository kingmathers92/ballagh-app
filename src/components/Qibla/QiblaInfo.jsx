import PropTypes from "prop-types";
import { getAccuracyColor, getErrorMessage } from "../../utils/qiblaUtils";

function QiblaInfo({
  qiblaDirection,
  location,
  accuracy,
  orientationSupported,
  error,
  recalibrate,
}) {
  return (
    <div className="qibla-info">
      <p>
        Qibla Direction: <strong>{qiblaDirection?.toFixed(1)}°</strong>
      </p>
      <p>
        Your Location:{" "}
        <strong>
          {location?.latitude?.toFixed(4)}, {location?.longitude?.toFixed(4)}
        </strong>
      </p>
      {accuracy && (
        <p>
          Accuracy:{" "}
          <strong style={{ color: getAccuracyColor(accuracy) }}>
            {accuracy.toFixed(0)} meters
          </strong>
        </p>
      )}
      {orientationSupported && (
        <p className="instruction">
          Rotate your device until the compass needle (North) aligns with the
          Qibla marker to face the Qibla.
        </p>
      )}
      {error && (
        <p className="error-text">
          {getErrorMessage(error)}
          <button className="retry-button inline" onClick={recalibrate}>
            Try Again
          </button>
        </p>
      )}
    </div>
  );
}

QiblaInfo.propTypes = {
  qiblaDirection: PropTypes.number,
  location: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }),
  accuracy: PropTypes.number,
  orientationSupported: PropTypes.bool.isRequired,
  error: PropTypes.string,
  recalibrate: PropTypes.func.isRequired,
};

export default QiblaInfo;
