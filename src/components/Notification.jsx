import PropTypes from "prop-types";
import { useEffect } from "react";

import "./PrayerTimes.css";

const Notification = ({
  message,
  onClose,
  isPermissionMessage = false,
  className = "",
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`notification ${
        isPermissionMessage ? "notification-permission" : ""
      } ${className}`}
      role="alert"
      aria-live={isPermissionMessage ? "polite" : "assertive"}
    >
      <p>{message}</p>
      <button
        className="notification-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  isPermissionMessage: PropTypes.bool,
  className: PropTypes.string,
};

export default Notification;
