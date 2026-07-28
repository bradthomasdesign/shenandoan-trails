'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const TrailMap = dynamic(() => import('./TrailMap'), { ssr: false });

export default TrailMap;
