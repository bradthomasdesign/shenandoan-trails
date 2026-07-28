import { supabase, Trail } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: 'var(--diff-easy)',
  moderate: 'var(--diff-moderate)',
  hard: 'var(--diff-hard)',
  strenuous: 'var(--diff-strenuous)',
};

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  hard: 'Hard',
  strenuous: 'Very strenuous',
};

async function getTrails(): Promise<Trail[]> {
  const { data } = await supabase
    .from('trails')
    .select('*')
    .eq('is_published', true)
    .order('name', { ascending: true });
  return data || [];
}

// A quiet route-shape thumbnail traced from the trail's real geometry —
// no photo needed, framed as a small map panel (tinted ground + start
// marker) so it reads as a route, not a stray line.
function RouteThumbnail({ geojson }: { geojson: any }) {
  const coords: [number, number][] | undefined = geojson?.coordinates;
  const W = 100;
  const H = 64;
  const PAD = 10;

  if (!coords || coords.length < 2) {
    return <div style={{ width: '100%', height: H, borderRadius: 10, background: 'var(--accent-soft)' }} />;
  }

  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const spanLng = maxLng - minLng || 1;
  const spanLat = maxLat - minLat || 1;
  const scale = Math.min((W - PAD * 2) / spanLng, (H - PAD * 2) / spanLat);
  const offX = (W - spanLng * scale) / 2;
  const offY = (H - spanLat * scale) / 2;

  const points = coords.map(([lng, lat]) => {
    const x = offX + (lng - minLng) * scale;
    const y = H - (offY + (lat - minLat) * scale);
    return [x, y];
  });

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const [startX, startY] = points[0];

  return (
    <div style={{ background: 'var(--accent-soft)', borderRadius: 10 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={startX} cy={startY} r="3" fill="var(--accent)" stroke="#ffffff" strokeWidth="1.25" />
      </svg>
    </div>
  );
}

export default async function HomePage() {
  const trails = await getTrails();

  return (
    <main style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 20px 80px' }}>
      <div
        style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--accent)',
          marginBottom: 10,
        }}
      >
        Shenandoan
      </div>
      <h1
        style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          margin: '0 0 8px',
          color: 'var(--ink)',
        }}
      >
        Trail Guides
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 40, maxWidth: 560 }}>
        Maps, elevation, and what to expect on trails across the Shenandoah Valley.
      </p>

      {trails.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>No trails published yet.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {trails.map((trail) => (
            <Link
              key={trail.id}
              href={`/trail/${trail.slug}`}
              className="trail-card"
              style={{
                display: 'block',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 14,
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{ padding: '16px 16px 0' }}>
                <RouteThumbnail geojson={trail.geojson} />
              </div>
              <div style={{ padding: '4px 18px 18px' }}>
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    fontSize: 19,
                    color: 'var(--ink)',
                    marginBottom: 3,
                  }}
                >
                  {trail.name}
                </div>
                {trail.park_or_forest && (
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>{trail.park_or_forest}</div>
                )}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 13,
                    color: 'var(--ink)',
                    fontWeight: 500,
                  }}
                >
                  <span>
                    {[
                      trail.distance_miles ? `${trail.distance_miles} mi` : null,
                      trail.elevation_gain_ft ? `${trail.elevation_gain_ft.toLocaleString()} ft` : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                  {trail.difficulty && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted)' }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: DIFFICULTY_COLOR[trail.difficulty],
                          display: 'inline-block',
                        }}
                      />
                      {DIFFICULTY_LABEL[trail.difficulty]}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
