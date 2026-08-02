import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGeolocation } from "../hooks/useGeolocation";
import { usePersistedState } from "../hooks/usePersistedState";
import {
  calculatePrayerTimes,
  determineCurrentNextPrayer,
  startCountdown,
} from "../utils/prayerUtils";
import translations from "../utils/translations";
import "../styles/Home.css";

const navItems = [
  {
    to: "/journal",
    labelAr: "اليوميات",
    labelEn: "Journal",
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <path
          d="M4 3h12v14l-6-3-6 3z"
          stroke="currentColor"
          strokeWidth="1.3"
        />
      </svg>
    ),
  },
  {
    to: "/search",
    labelAr: "بحث",
    labelEn: "Search",
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <circle
          cx="8.5"
          cy="8.5"
          r="5.5"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M13 13 17 17"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const Home = () => {
  const { location: coords } = useGeolocation();
  const [calculationMethod] = usePersistedState(
    "calculationMethod",
    "UmmAlQura",
  );
  const [prayerStatus, setPrayerStatus] = useState(null);
  const [countdown, setCountdown] = useState("");
  const language = "en";

  useEffect(() => {
    if (!coords) return;
    try {
      const rawTimes = calculatePrayerTimes(coords, calculationMethod);
      setPrayerStatus(determineCurrentNextPrayer(rawTimes));
    } catch (error) {
      console.error("Error calculating prayer times for home glance:", error);
    }
  }, [coords, calculationMethod]);

  useEffect(() => {
    if (!prayerStatus?.nextPrayer) return;
    return startCountdown(prayerStatus.nextPrayer, setCountdown);
  }, [prayerStatus]);

  return (
    <div>
      <header className="hero-section">
        <h1 className="title" style={{ fontFamily: "'Reem Kufi', sans-serif" }}>
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </h1>
      </header>

      <div className="home-container">
        <Link to="/prayer-times" className="right-now-panel cut-corner">
          <span className="right-now-eyebrow">Right now</span>
          {prayerStatus ? (
            <div className="right-now-row">
              <div>
                <div className="right-now-ar">
                  {translations.ar.prayers[prayerStatus.currentPrayer]}
                </div>
                <div className="right-now-en">
                  {translations.en.prayers[prayerStatus.currentPrayer]}
                </div>
              </div>
              <div className="right-now-countdown">
                <span className="countdown-value">{countdown || "…"}</span>
                <span className="countdown-label">
                  until {translations.en.prayers[prayerStatus.nextPrayer.name]}
                </span>
              </div>
            </div>
          ) : (
            <p className="right-now-loading">
              Enable location to see today&apos;s prayer times
            </p>
          )}
        </Link>

        <nav
          className="home-nav-grid"
          aria-label={language === "ar" ? "التنقل السريع" : "Quick navigation"}
        >
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="home-nav-card cut-corner-sm"
            >
              <span className="home-nav-icon">{item.icon}</span>
              <span className="home-nav-label-ar">{item.labelAr}</span>
              <span className="home-nav-label-en">{item.labelEn}</span>
            </Link>
          ))}
        </nav>

        <p className="description">
          Read the Quran, track prayer times, find the Qibla, discover hadith,
          and reflect in your journal — all in one place.
        </p>
      </div>
    </div>
  );
};

export default Home;
