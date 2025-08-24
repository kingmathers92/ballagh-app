import { useEffect } from "react";
import { addNotification } from "../utils/prayerUtils.js";

export const useServiceWorker = (language, translations) => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err);
          addNotification(
            translations[language].serviceWorkerError ||
              "Failed to register service worker",
            true
          );
        });
    }
  }, [language, translations]);
};
