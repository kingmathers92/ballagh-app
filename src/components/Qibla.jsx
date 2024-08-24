import { useQiblaDirection } from "../hooks/useQiblaDirection";
import Spinner from "../components/Spinner";
import "../styles/Qibla.css";

function Qibla() {
  const { qiblaDirection, compassHeading, error, isLoading } =
    useQiblaDirection();

  return (
    <div className="qibla-direction">
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <p>{error}</p>
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
        </>
      )}
    </div>
  );
}

export default Qibla;
