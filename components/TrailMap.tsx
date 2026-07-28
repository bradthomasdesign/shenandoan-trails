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

const startIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:12px;height:12px;background:#1f2e23;border:2px solid #f5f0e6;box-shadow:0 0 0 1px #1f2e23;"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const finishIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:12px;height:12px;background:#1f2e23;border:2px solid #f5f0e6;box-shadow:0 0 0 1px #1f2e23;transform:rotate(45deg);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

type Props = {
  lat: number;
  lng: number;
  routeLine?: [number, number][];
  waypoints?: Waypoint[];
};

export default function TrailMap({ lat, lng, routeLine, waypoints }: Props) {
  const start = routeLine && routeLine.length > 1 ? routeLine[0] : undefined;
  const finish = routeLine && routeLine.length > 1 ? routeLine[routeLine.length - 1] : undefined;

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
      {start && (
        <Marker position={start} icon={startIcon}>
          <Popup>Start</Popup>
        </Marker>
      )}
      {finish && (
        <Marker position={finish} icon={finishIcon}>
          <Popup>Finish</Popup>
        </Marker>
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
