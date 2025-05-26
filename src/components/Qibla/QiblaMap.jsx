import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Leaflet (ensure this runs after DOM is ready)
if (typeof window !== "undefined") {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

function QiblaMap({ location, qiblaDirection }) {
  const mapRef = useRef(null);

  const calculateQiblaPoint = (lat, lon, direction, distance = 0.1) => {
    const R = 6371;
    const bearing = (direction * Math.PI) / 180;
    const lat1 = (lat * Math.PI) / 180;
    const lon1 = (lon * Math.PI) / 180;

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(distance / R) +
        Math.cos(lat1) * Math.sin(distance / R) * Math.cos(bearing)
    );
    const lon2 =
      lon1 +
      Math.atan2(
        Math.sin(bearing) * Math.sin(distance / R) * Math.cos(lat1),
        Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2)
      );

    return [(lat2 * 180) / Math.PI, (lon2 * 180) / Math.PI];
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([location.latitude, location.longitude], 15);
    }
  }, [location]);

  return (
    <MapContainer
      center={[location.latitude, location.longitude]}
      zoom={15}
      style={{ height: "200px", width: "100%", borderRadius: "10px" }}
      whenCreated={(map) => {
        mapRef.current = map;
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[location.latitude, location.longitude]} />
      <Polyline
        positions={[
          [location.latitude, location.longitude],
          calculateQiblaPoint(
            location.latitude,
            location.longitude,
            qiblaDirection
          ),
        ]}
        color="#2ecc71"
        weight={3}
      />
    </MapContainer>
  );
}

QiblaMap.propTypes = {
  location: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,
  qiblaDirection: PropTypes.number.isRequired,
};

export default QiblaMap;
