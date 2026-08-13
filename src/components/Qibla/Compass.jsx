import PropTypes from "prop-types";
import { getCompassStyle } from "../../utils/qiblaUtils";

const ALIGNMENT_THRESHOLD = 6;
const CLOSE_THRESHOLD = 25;

const getSignedDelta = (from, to) => ((to - from + 540) % 360) - 180;

function Compass({ qiblaDirection, compassHeading }) {
  const delta =
    qiblaDirection !== null
      ? getSignedDelta(compassHeading, qiblaDirection)
      : null;
  const absDelta = delta !== null ? Math.abs(delta) : null;
  const isAligned = absDelta !== null && absDelta <= ALIGNMENT_THRESHOLD;
  const isClose = absDelta !== null && absDelta <= CLOSE_THRESHOLD;

  const proximityClass = isAligned ? "aligned" : isClose ? "close" : "far";

  return (
    <div className="compass-container">
      <div className="compass">
        <div className="compass-dial" style={getCompassStyle(compassHeading)}>
          {qiblaDirection !== null && (
            <div
              className={`qibla-target qibla-target-${proximityClass}`}
              style={{ transform: `rotate(${qiblaDirection}deg)` }}
            >
              <span className="qibla-target-glow" aria-hidden="true" />
              <span className="qibla-target-mark" aria-hidden="true">
                <svg viewBox="0 0 20 20">
                  <path
                    d="M5 8 L5 16 L15 16 L15 8 L10 4 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          )}
        </div>

        <div className={`qibla-readout qibla-readout-${proximityClass}`}>
          {absDelta !== null ? (
            <span className="qibla-readout-value">
              {Math.round(absDelta)}&deg;
            </span>
          ) : (
            <span className="qibla-readout-value qibla-readout-loading">
              &hellip;
            </span>
          )}
        </div>
      </div>

      <p className="qibla-guidance" role="status">
        {isAligned ? (
          <span className="qibla-guidance-aligned">
            You&apos;re facing the Qibla
          </span>
        ) : delta !== null ? (
          <>
            Turn to your <strong>{delta < 0 ? "left" : "right"}</strong>
          </>
        ) : (
          "Finding direction\u2026"
        )}
      </p>
    </div>
  );
}

Compass.propTypes = {
  qiblaDirection: PropTypes.number,
  compassHeading: PropTypes.number.isRequired,
};

export default Compass;
