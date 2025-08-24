import { memo } from "react";
import PropTypes from "prop-types";
import Notification from "./Notification.jsx";

const MemoizedNotification = memo(Notification);

const NotificationStack = ({ notifications, setNotifications }) => (
  <div className="notification-stack">
    {notifications.map((notif, index) => (
      <MemoizedNotification
        key={notif.id}
        message={notif.message}
        onClose={() =>
          setNotifications((prev) => prev.filter((n) => n.id !== notif.id))
        }
        isPermissionMessage={notif.isPermissionMessage}
        style={{ top: `${20 + index * 60}px` }}
        aria-live={notif.isPermissionMessage ? "polite" : "assertive"}
      />
    ))}
  </div>
);

NotificationStack.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      isPermissionMessage: PropTypes.bool.isRequired,
    })
  ).isRequired,
  setNotifications: PropTypes.func.isRequired,
};

export default NotificationStack;
