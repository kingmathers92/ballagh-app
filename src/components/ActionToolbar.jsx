import { memo } from "react";
import PropTypes from "prop-types";
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
        <span className="button-icon">
          <svg viewBox="0 0 20 20" fill="none" width="15" height="15">
            <path
              d="M10 3.5c-2.2 0-3.8 1.8-3.8 4v2.3L5 12.5h10l-1.2-2.7V7.5c0-2.2-1.6-4-3.8-4Z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {translations[language].enableNotifications}
      </button>
    )}
    {notifications.length > 1 && (
      <button
        className="button dismiss-notifications"
        onClick={() => dismissAllNotifications(setNotifications)}
        aria-label={translations[language].dismissAllNotifications}
      >
        <span className="button-icon">
          <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
            <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
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
      <span className="button-icon">
        <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
          <path d="M10 3v9M10 12 6.5 8.5M10 12l3.5-3.5M4 15h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {translations[language].exportPrayerTimes}
    </button>
  </div>
);

ActionToolbar.propTypes = {
  notificationPermission: PropTypes.oneOf(["default", "granted", "denied"])
    .isRequired,
  setNotificationPermission: PropTypes.func.isRequired,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      isPermissionMessage: PropTypes.bool.isRequired,
    })
  ).isRequired,
  setNotifications: PropTypes.func.isRequired,
  prayerTimes: PropTypes.shape({
    fajr: PropTypes.instanceOf(Date),
    sunrise: PropTypes.instanceOf(Date),
    dhuhr: PropTypes.instanceOf(Date),
    asr: PropTypes.instanceOf(Date),
    maghrib: PropTypes.instanceOf(Date),
    isha: PropTypes.instanceOf(Date),
    location: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
  }),
  ramadanTimes: PropTypes.shape({
    ramadanDay: PropTypes.number,
    suhoor: PropTypes.instanceOf(Date),
    iftar: PropTypes.instanceOf(Date),
    currentEvent: PropTypes.string,
    nextEvent: PropTypes.shape({
      name: PropTypes.string,
      time: PropTypes.instanceOf(Date),
    }),
  }),
  calculationMethod: PropTypes.string.isRequired,
  timeZone: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  translations: PropTypes.object.isRequired,
};

export default memo(ActionToolbar);
