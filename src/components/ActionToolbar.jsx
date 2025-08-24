import { memo } from "react";
import {
  requestNotificationPermission,
  dismissAllNotifications,
  exportPrayerTimes,
} from "../utils/prayerUtils.js";

const ActionToolbar = ({
  notificationPermission,
  setNotificationPermission,
  notifications,
  setNotifications,
  prayerTimes,
  ramadanTimes,
  calculationMethod,
  timeZone,
  language,
  translations,
}) => (
  <div className="action-toolbar">
    {notificationPermission === "default" && (
      <button
        className="button enable-notifications"
        onClick={() =>
          requestNotificationPermission(
            setNotificationPermission,
            (message, isPermissionMessage) =>
              setNotifications((prev) => [
                ...prev,
                { id: Date.now(), message, isPermissionMessage },
              ]),
            translations,
            language
          )
        }
        aria-label={translations[language].enableNotifications}
      >
        <span className="button-icon">🔔</span>
        {translations[language].enableNotifications}
      </button>
    )}
    {notifications.length > 1 && (
      <button
        className="button dismiss-notifications"
        onClick={() => dismissAllNotifications(setNotifications)}
        aria-label={translations[language].dismissAllNotifications}
      >
        <span className="button-icon">✖️</span>
        {translations[language].dismissAllNotifications}
      </button>
    )}
    <button
      className="export-button button"
      onClick={() =>
        exportPrayerTimes(
          prayerTimes,
          ramadanTimes,
          calculationMethod,
          timeZone,
          language,
          (message, isPermissionMessage) =>
            setNotifications((prev) => [
              ...prev,
              { id: Date.now(), message, isPermissionMessage },
            ]),
          translations
        )
      }
      aria-label={translations[language].exportPrayerTimes}
    >
      <span className="button-icon">📥</span>
      {translations[language].exportPrayerTimes}
    </button>
  </div>
);

export default memo(ActionToolbar);
