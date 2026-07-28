'use client';

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

function buildPath(profile: ProfilePoint[]) {
  const elevations = profile.map((p) => p.e);
  const minE = Math.min(...elevations);
  const maxE = Math.max(...elevations);
  const maxD = profile[profile.length - 1].d || 1;
  const range = maxE - minE || 1;

  const points = profile.map((p) => {
    const x = (p.d / maxD) * VIEW_W;
    const y = BOTTOM - ((p.e - minE) / range) * (BOTTOM - TOP_PAD);
    return [x, y];
  });

  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  return { path, minE, maxE };
}

// Real per-trail terrain, traced from USGS/ASTER elevation samples along the
// mapped route (see elevation_profile). Falls back to a flat line if no
// profile data is available yet.
export default function ElevationProfile({ profile, gainFt, distanceMiles }: Props) {
  const hasProfile = profile && profile.length > 1;
  const { path, minE, maxE } = hasProfile
    ? buildPath(profile!)
    : { path: `M0,${BOTTOM} L${VIEW_W},${BOTTOM}`, minE: 0, maxE: 0 };

  const startFt = hasProfile ? Math.round(profile![0].e) : null;
  const endFt = hasProfile ? Math.round(profile![profile!.length - 1].e) : null;
  const highFt = hasProfile ? Math.round(maxE) : null;
  const showHigh = hasProfile && highFt !== startFt && highFt !== endFt;

  return (
    <div style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} width="100%" height="120" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="ridgeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3d5a80" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#3d5a80" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={`${path} L${VIEW_W},${VIEW_H} L0,${VIEW_H} Z`} fill="url(#ridgeFill)" />
        <path d={path} fill="none" stroke="#3d5a80" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
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
