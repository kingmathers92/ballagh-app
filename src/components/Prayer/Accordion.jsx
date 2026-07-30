import { memo, useCallback } from "react";
import PropTypes from "prop-types";

const Accordion = ({ tabs, openAccordions, setOpenAccordions }) => {
  const toggleAccordion = useCallback(
    (section) => {
      setOpenAccordions((prev) =>
        prev.includes(section)
          ? prev.filter((s) => s !== section)
          : [...prev, section]
      );
    },
    [setOpenAccordions]
  );

  return (
    <div className="accordion-container">
      {tabs.map((tab) => (
        <div key={tab.id} className="accordion-item">
          <button
            className={`accordion-header ${
              openAccordions.includes(tab.id) ? "active" : ""
            }`}
            onClick={() => toggleAccordion(tab.id)}
            aria-expanded={openAccordions.includes(tab.id)}
            aria-controls={`accordion-panel-${tab.id}`}
            id={`accordion-${tab.id}`}
          >
            <span className="accordion-icon">{tab.icon}</span>
            {tab.label}
            <span className="accordion-arrow">
              {openAccordions.includes(tab.id) ? "▲" : "▼"}
            </span>
          </button>
          <div
            id={`accordion-panel-${tab.id}`}
            className={`accordion-content ${
              openAccordions.includes(tab.id) ? "open" : ""
            }`}
            role="region"
            aria-labelledby={`accordion-${tab.id}`}
            hidden={!openAccordions.includes(tab.id)}
          >
            {tab.content}
          </div>
        </div>
      ))}
    </div>
  );
};

Accordion.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
  openAccordions: PropTypes.arrayOf(PropTypes.string).isRequired,
  setOpenAccordions: PropTypes.func.isRequired,
};

export default memo(Accordion);
