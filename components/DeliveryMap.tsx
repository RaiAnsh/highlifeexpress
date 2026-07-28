"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DELIVERY_PINS: { name: string; lat: number; lng: number }[] = [
  { name: "Newmarket", lat: 44.0592, lng: -79.4613 },
  { name: "Barrie", lat: 44.3894, lng: -79.6903 },
  { name: "Mississauga", lat: 43.589, lng: -79.6441 },
  { name: "Toronto", lat: 43.6532, lng: -79.3832 },
  { name: "Scarborough", lat: 43.7764, lng: -79.2318 },
];

export function DeliveryMap() {
  return (
    <MapContainer
      center={[43.95, -79.55]}
      zoom={9}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", minHeight: "inherit" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {DELIVERY_PINS.map((pin) => (
        <Marker key={pin.name} position={[pin.lat, pin.lng]} icon={icon}>
          <Popup>{pin.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
