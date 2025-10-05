import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import location from "../../assets/images/location-pin.png";
import L from "leaflet";
import "./alumniMap.scss";

const alumniData = [
  { id: 1, name: "John Doe", batch: "2015", location: [26.9124, 75.7873] },
  { id: 2, name: "Jane Smith", batch: "2018", location: [28.7041, 77.1025] },
  { id: 3, name: "Alice Johnson", batch: "2020", location: [19.076, 72.8777] },
  { id: 4, name: "Bob Williams", batch: "2016", location: [12.9716, 77.5946] },
];

const customIcon = new L.Icon({
  iconUrl: location,
  iconSize: [30, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const AlumniMap = () => {
  const [selectedBatch, setSelectedBatch] = useState("All");

  const filteredAlumni = selectedBatch === "All"
    ? alumniData
    : alumniData.filter(alumnus => alumnus.batch === selectedBatch);

  return (
    <div className="alumni-map">
      <h2>Alumni Map</h2>

      <div className="filter">
        <label>Filter by Batch Year: </label>
        <select onChange={(e) => setSelectedBatch(e.target.value)} value={selectedBatch}>
          <option value="All">All</option>
          <option value="2015">2015</option>
          <option value="2016">2016</option>
          <option value="2018">2018</option>
          <option value="2020">2020</option>
        </select>
      </div>

      <MapContainer center={[20, 0]} zoom={4} minZoom={3}  maxZoom={18} className="map-container">
        <TileLayer
          url="https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=eeb07ee97c2a4621bd98f5db40685ed1"
          attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>'
        />
        {filteredAlumni.map((alumnus) => (
          <Marker key={alumnus.id} position={alumnus.location} icon={customIcon}>
            <Popup>
              <strong>{alumnus.name}</strong><br />
              Batch: {alumnus.batch}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default AlumniMap;
