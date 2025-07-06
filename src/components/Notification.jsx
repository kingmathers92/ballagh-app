import PropTypes from "prop-types";
import { useEffect } from "react";

const Notification = ({ message, onClose, isPermissionMessage = false }) => {
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
      }`}
      role="alert"
      aria-live="polite"
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
};

export default Notification;
