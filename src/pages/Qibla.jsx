import { useQiblaDirection } from "../hooks/useQiblaDirection";
import Spinner from "../components/Spinner";

import "../styles/Qibla.css";

function Qibla() {
  const { qiblaDirection, compassHeading, error, isLoading, location } =
    useQiblaDirection();

  return (
    <div className="qibla-direction">
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <p>
          {error === "PERMISSION_DENIED"
            ? "Location access denied. Please enable location services."
            : "Something went wrong. Please try again."}
        </p>
      ) : (
        <>
          <div className="compass-container">
            <div
              className="compass"
              style={{ transform: `rotate(${compassHeading}deg)` }}
            >
              <div className="compass-arrow"></div>
              {qiblaDirection !== null && (
                <div
                  className="qibla-marker"
                  style={{
                    transform: `rotate(${qiblaDirection}deg)`,
                  }}
                ></div>
              )}
            </div>
          </div>
          <p>Your Qibla direction is: {qiblaDirection?.toFixed(2)}°</p>
          <p>
            Your Location: Lat {location?.latitude}, Lon {location?.longitude}
          </p>
        </>
      )}
    </div>
  );
}

export default Qibla;
