import PropTypes from "prop-types";

function ActionButtons({ recalibrate }) {
  return (
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
  );
}

ActionButtons.propTypes = {
  recalibrate: PropTypes.func.isRequired,
};

export default ActionButtons;
