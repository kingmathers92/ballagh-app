import PropTypes from "prop-types";

function StaticQibla({ qiblaDirection }) {
  return (
    <div className="static-qibla-container">
      <div className="static-qibla-direction">
        <div
          className="static-qibla-arrow"
          style={{ transform: `rotate(${qiblaDirection}deg)` }}
        ></div>
        <p className="static-instruction">
          Qibla is at {qiblaDirection?.toFixed(1)}°. Face this direction to
          align with the Qibla.
        </p>
      </div>
    </div>
  );
}

StaticQibla.propTypes = {
  qiblaDirection: PropTypes.number,
};

export default StaticQibla;
