'use client';

import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Waypoint } from '@/lib/supabase';

const trailheadIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#b5573a;border:2px solid #f5f0e6;box-shadow:0 0 0 1px #1f2e23;"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const waypointIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:10px;height:10px;border-radius:50%;background:#3d5a80;border:2px solid #f5f0e6;"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

type Props = {
  lat: number;
  lng: number;
  routeLine?: [number, number][];
  waypoints?: Waypoint[];
};

export default function TrailMap({ lat, lng, routeLine, waypoints }: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
      />
      {routeLine && routeLine.length > 1 && (
        <Polyline positions={routeLine} pathOptions={{ color: '#3d5a80', weight: 4, opacity: 0.85 }} />
      )}
      <Marker position={[lat, lng]} icon={trailheadIcon}>
        <Popup>Trailhead</Popup>
      </Marker>
      {waypoints?.map((wp) => (
        <Marker key={wp.id} position={[wp.lat, wp.lng]} icon={waypointIcon}>
          <Popup>
            <strong>{wp.label}</strong>
            {wp.description ? <div>{wp.description}</div> : null}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
