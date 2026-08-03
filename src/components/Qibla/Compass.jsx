import PropTypes from "prop-types";
import { getCompassStyle, getQiblaMarkerStyle } from "../../utils/qiblaUtils";

const ALIGNMENT_THRESHOLD = 6;

const getAngleDelta = (a, b) => {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
};

function Compass({ qiblaDirection, compassHeading }) {
  const isAligned =
    qiblaDirection !== null &&
    getAngleDelta(compassHeading, qiblaDirection) <= ALIGNMENT_THRESHOLD;

  return (
    <div className="compass-container">
      <div className="compass" style={getCompassStyle(compassHeading)}>
        <div className="compass-rose">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="compass-mark"
              style={{ transform: `rotate(${i * 45}deg)` }}
            />
          ))}
        </div>
        <div className={`compass-arrow${isAligned ? " compass-arrow-aligned" : ""}`}></div>
        <svg
          className={`compass-star${isAligned ? " compass-star-aligned" : ""}`}
          viewBox="0 0 22 22"
          aria-hidden="true"
        >
          <path
            d="M11 1 13.2 5 18 3.4 16.6 8.2 21 11 16.6 13.8 18 18.6 13.2 17 11 21 8.8 17 4 18.6 5.4 13.8 1 11 5.4 8.2 4 3.4 8.8 5Z"
            fill={isAligned ? "var(--accent-color)" : "var(--text-color)"}
          />
        </svg>
        {qiblaDirection !== null && (
          <>
            <div
              className="qibla-marker"
              style={getQiblaMarkerStyle(qiblaDirection)}
            ></div>
            <div
              className="qibla-line"
              style={getQiblaMarkerStyle(qiblaDirection)}
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
      <p className={`qibla-alignment-message${isAligned ? " visible" : ""}`} role="status">
        You&apos;re facing the Qibla
      </p>
    </div>
  );
}

Compass.propTypes = {
  qiblaDirection: PropTypes.number,
  compassHeading: PropTypes.number.isRequired,
};

export default Compass;