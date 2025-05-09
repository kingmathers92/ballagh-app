import PropTypes from "prop-types";

import "../styles/Pagination.css";

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onPrev,
  onNext,
  isPrevDisabled,
  isNextDisabled,
}) {
  const pageNumbers = [];
  const maxPageNumbersToShow = 5;

  let startPage = Math.max(
    1,
    currentPage - Math.floor(maxPageNumbersToShow / 2)
  );
  let endPage = startPage + maxPageNumbersToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
      <button
        disabled={isPrevDisabled}
        onClick={onPrev}
        className={isPrevDisabled ? "disabled" : ""}
        aria-label="Go to previous page"
      >
        Prev
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          className={number === currentPage ? "active" : ""}
          onClick={() => onPageChange(number)}
          aria-label={`Go to page ${number}`}
        >
          {number}
        </button>
      ))}

      <button
        disabled={isNextDisabled}
        onClick={onNext}
        className={isNextDisabled ? "disabled" : ""}
        aria-label="Go to next page"
      >
        Next
      </button>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  isPrevDisabled: PropTypes.bool.isRequired,
  isNextDisabled: PropTypes.bool.isRequired,
};

export default Pagination;
