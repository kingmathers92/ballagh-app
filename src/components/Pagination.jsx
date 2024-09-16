import PropTypes from "prop-types";
import "../styles/Pagination.css"; // Import your CSS file if needed

function Pagination({ onPrev, onNext, isPrevDisabled, isNextDisabled }) {
  return (
    <div className="pagination-controls">
      <button
        onClick={onPrev}
        disabled={isPrevDisabled}
        className={`pagination-btn prev-btn ${
          isPrevDisabled ? "disabled" : ""
        }`}
        aria-label="Previous Page"
      >
        &larr; Previous
      </button>
      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className={`pagination-btn next-btn ${
          isNextDisabled ? "disabled" : ""
        }`}
        aria-label="Next Page"
      >
        Next &rarr;
      </button>
    </div>
  );
}

Pagination.propTypes = {
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  isPrevDisabled: PropTypes.bool.isRequired,
  isNextDisabled: PropTypes.bool.isRequired,
};

export default Pagination;
