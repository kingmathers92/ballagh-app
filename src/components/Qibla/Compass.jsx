import PropTypes from "prop-types";
import { getCompassStyle, getQiblaMarkerStyle } from "../../utils/qiblaUtils";

function Compass({ qiblaDirection, compassHeading }) {
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
        <div className="compass-arrow"></div>
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
    </div>
  );
}

Compass.propTypes = {
  qiblaDirection: PropTypes.number,
  compassHeading: PropTypes.number.isRequired,
};

export default Compass;
