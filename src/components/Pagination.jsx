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
      <button disabled={isPrevDisabled} onClick={onPrev}>
        Prev
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          className={number === currentPage ? "active" : ""}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}

      <button disabled={isNextDisabled} onClick={onNext}>
        Next
      </button>
    </div>
  );
}

Pagination.propTypes = {
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  isPrevDisabled: PropTypes.bool.isRequired,
  isNextDisabled: PropTypes.bool.isRequired,
  currentPage: PropTypes.bool.isRequired,
  totalPages: PropTypes.bool.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
