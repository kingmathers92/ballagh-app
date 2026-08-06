import PropTypes from "prop-types";
import { getCompassStyle } from "../../utils/qiblaUtils";

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
      <div className="compass">
        <div className="heading-indicator" aria-hidden="true" />
        <div className="compass-dial" style={getCompassStyle(compassHeading)}>
          <div className="compass-rose">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`compass-mark${i % 2 === 0 ? " compass-mark-major" : ""}`}
                style={{ transform: `rotate(${i * 45}deg)` }}
              />
            ))}
          </div>
          <span className="compass-label compass-label-n">N</span>
          <span className="compass-label compass-label-e">E</span>
          <span className="compass-label compass-label-s">S</span>
          <span className="compass-label compass-label-w">W</span>

          {qiblaDirection !== null && (
            <div
              className={`qibla-needle${isAligned ? " qibla-needle-aligned" : ""}`}
              style={{ transform: `rotate(${qiblaDirection}deg)` }}
            >
              <svg
                viewBox="0 0 16 90"
                className="qibla-needle-shaft"
                aria-hidden="true"
              >
                <path d="M8 0 L8 90" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="qibla-needle-mark" aria-hidden="true">
                <svg viewBox="0 0 20 20">
                  <path
                    d="M5 8 L5 16 L15 16 L15 8 L10 4 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          )}
        </div>

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
      </div>
      <p
        className={`qibla-alignment-message${isAligned ? " visible" : ""}`}
        role="status"
      >
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
