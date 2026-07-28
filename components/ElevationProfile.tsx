'use client';

type Props = {
  gainFt: number | null;
  distanceMiles: number | null;
  summitFt?: number;
};

// A stylized relief silhouette rather than a literal chart — evokes
// topo-map hachure shading. Real elevation_profile JSON (once loaded
// per-trail) can later replace this with an actual traced path.
export default function ElevationProfile({ gainFt, distanceMiles, summitFt }: Props) {
  const path =
    'M0,120 L40,118 L70,95 L100,100 L140,60 L175,68 L210,30 L245,42 L270,15 L300,20 L330,55 L365,50 L400,90 L440,85 L480,120';

  return (
    <div style={{ width: '100%' }}>
      <svg viewBox="0 0 480 130" width="100%" height="120" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="ridgeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3d5a80" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#3d5a80" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={`${path} L480,130 L0,130 Z`} fill="url(#ridgeFill)" />
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
        <span>Trailhead</span>
        {summitFt ? <span>Summit &middot; {summitFt.toLocaleString()} ft</span> : <span />}
        <span>{gainFt ? `+${gainFt.toLocaleString()} ft gain` : ''}</span>
      </div>
    </div>
  );
}
