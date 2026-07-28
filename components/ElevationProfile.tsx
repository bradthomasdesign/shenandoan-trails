'use client';

import { useRef, useState } from 'react';

type ProfilePoint = { d: number; e: number };

type Props = {
  profile?: ProfilePoint[] | null;
  gainFt: number | null;
  distanceMiles: number | null;
};

const VIEW_W = 480;
const VIEW_H = 130;
const TOP_PAD = 12;
const BOTTOM = 120;

function buildGeometry(profile: ProfilePoint[]) {
  const elevations = profile.map((p) => p.e);
  const minE = Math.min(...elevations);
  const maxE = Math.max(...elevations);
  const maxD = profile[profile.length - 1].d || 1;
  const range = maxE - minE || 1;

  const points = profile.map((p) => ({
    x: (p.d / maxD) * VIEW_W,
    y: BOTTOM - ((p.e - minE) / range) * (BOTTOM - TOP_PAD),
    d: p.d,
    e: p.e,
  }));

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  return { path, minE, maxE, maxD, points };
}

function gradeAt(points: { d: number; e: number }[], i: number) {
  const a = points[Math.max(0, i - 1)];
  const b = points[Math.min(points.length - 1, i)];
  const runFt = (b.d - a.d) * 5280;
  if (runFt <= 0) return 0;
  return Math.round(((b.e - a.e) / runFt) * 100);
}

// Real per-trail terrain, traced from USGS/ASTER elevation samples along the
// mapped route (see elevation_profile). Falls back to a flat line if no
// profile data is available yet.
export default function ElevationProfile({ profile, gainFt, distanceMiles }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const hasProfile = profile && profile.length > 1;
  const geo = hasProfile ? buildGeometry(profile!) : null;
  const { path, minE, maxE, points } = geo || { path: `M0,${BOTTOM} L${VIEW_W},${BOTTOM}`, minE: 0, maxE: 0, points: [] as ReturnType<typeof buildGeometry>['points'] };

  const startFt = hasProfile ? Math.round(profile![0].e) : null;
  const endFt = hasProfile ? Math.round(profile![profile!.length - 1].e) : null;
  const highFt = hasProfile ? Math.round(maxE) : null;
  const showHigh = hasProfile && highFt !== startFt && highFt !== endFt;

  const updateHover = (clientX: number) => {
    if (!svgRef.current || points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const xFrac = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const xView = xFrac * VIEW_W;
    let nearest = 0;
    let bestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - xView);
      if (dist < bestDist) {
        bestDist = dist;
        nearest = i;
      }
    });
    setHoverIdx(nearest);
  };

  const clearHover = () => setHoverIdx(null);

  const hoverPoint = hoverIdx !== null ? points[hoverIdx] : null;
  const hoverGrade = hoverIdx !== null && hasProfile ? gradeAt(profile!, hoverIdx) : null;
  const tooltipLeftPct = hoverPoint ? (hoverPoint.x / VIEW_W) * 100 : 0;

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        width="100%"
        height="120"
        preserveAspectRatio="none"
        role="img"
        aria-label={
          hasProfile
            ? `Elevation profile from ${startFt} to ${endFt} feet, high point ${highFt} feet`
            : 'Elevation profile'
        }
        style={{ cursor: hasProfile ? 'crosshair' : 'default', touchAction: 'pan-y' }}
        onMouseMove={(e) => hasProfile && updateHover(e.clientX)}
        onMouseLeave={clearHover}
        onTouchMove={(e) => hasProfile && e.touches[0] && updateHover(e.touches[0].clientX)}
        onTouchEnd={clearHover}
      >
        <defs>
          <linearGradient id="ridgeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3d5a80" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#3d5a80" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={`${path} L${VIEW_W},${VIEW_H} L0,${VIEW_H} Z`} fill="url(#ridgeFill)" />
        <path d={path} fill="none" stroke="#3d5a80" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {hoverPoint && (
          <>
            <line x1={hoverPoint.x} y1={TOP_PAD} x2={hoverPoint.x} y2={BOTTOM} stroke="#7a7568" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx={hoverPoint.x} cy={hoverPoint.y} r="4" fill="#3d5a80" stroke="#f5f0e6" strokeWidth="1.5" />
          </>
        )}
      </svg>

      {hoverPoint && (
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: `${tooltipLeftPct}%`,
            transform: `translateX(${tooltipLeftPct > 70 ? '-105%' : tooltipLeftPct < 15 ? '2%' : '-50%'})`,
            background: 'var(--parchment)',
            border: '1px solid var(--line)',
            borderRadius: 4,
            padding: '8px 10px',
            fontFamily: 'Inter, sans-serif',
            fontSize: 12,
            color: 'var(--ink)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: '0 2px 6px rgba(31,46,35,0.12)',
          }}
        >
          <div>Distance: {hoverPoint.d.toFixed(1)} mi</div>
          <div>Elevation: {Math.round(hoverPoint.e).toLocaleString()} ft</div>
          <div>
            Grade: {hoverGrade! > 0 ? '+' : ''}
            {hoverGrade}%
          </div>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 6,
          fontSize: 12,
          color: 'var(--stone)',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
        }}
      >
        <span>{startFt !== null ? `${startFt.toLocaleString()} ft` : 'Trailhead'}</span>
        {showHigh ? <span>High point &middot; {highFt!.toLocaleString()} ft</span> : <span />}
        <span>
          {endFt !== null ? `${endFt.toLocaleString()} ft` : ''}
          {gainFt ? ` · +${gainFt.toLocaleString()} ft gain` : ''}
        </span>
      </div>
    </div>
  );
}
