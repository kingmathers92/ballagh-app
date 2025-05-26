import PropTypes from "prop-types";
import Spinner from "../Spinner";

function NearbyMosques({ mosques, fetchingMosques, fetchError }) {
  return (
    <div className="nearby-mosques">
      <h3>Nearby Mosques</h3>
      {fetchingMosques ? (
        <Spinner />
      ) : fetchError ? (
        <p className="error-text">{fetchError}</p>
      ) : mosques.length > 0 ? (
        <ul>
          {mosques.slice(0, 5).map((mosque, index) => (
            <li key={index} className="mosque-item">
              <span>{mosque.name}</span>
              <span>{mosque.distance.toFixed(2)} km away</span>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mosque-directions"
              >
                Get Directions
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No mosques found nearby.</p>
      )}
    </div>
  );
}

NearbyMosques.propTypes = {
  mosques: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      lat: PropTypes.number.isRequired,
      lon: PropTypes.number.isRequired,
      distance: PropTypes.number.isRequired,
    })
  ).isRequired,
  fetchingMosques: PropTypes.bool.isRequired,
  fetchError: PropTypes.string,
};

export default NearbyMosques;
