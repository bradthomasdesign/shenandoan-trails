import { supabase, Trail, Waypoint } from '@/lib/supabase';
import ElevationProfile from '@/components/ElevationProfile';
import TrailMap from '@/components/TrailMapClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  hard: 'Hard',
  strenuous: 'Very Strenuous',
};

const ROUTE_LABEL: Record<string, string> = {
  out_and_back: 'Out & back',
  loop: 'Loop',
  point_to_point: 'Point to point',
};

async function getTrail(slug: string): Promise<{ trail: Trail; waypoints: Waypoint[] } | null> {
  const { data: trail, error } = await supabase
    .from('trails')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !trail) return null;

  const { data: waypoints } = await supabase
    .from('trail_waypoints')
    .select('*')
    .eq('trail_id', trail.id)
    .order('sequence', { ascending: true });

  return { trail, waypoints: waypoints || [] };
}

function formatTime(minutes: number | null) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h} hr ${m} min`;
  if (h) return `${h} hr`;
  return `${m} min`;
}

export default async function TrailPage({ params }: { params: { slug: string } }) {
  const result = await getTrail(params.slug);
  if (!result) notFound();
  const { trail, waypoints } = result;

  const routeLine: [number, number][] | undefined = trail.geojson?.coordinates
    ? trail.geojson.coordinates.map((c: [number, number]) => [c[1], c[0]])
    : undefined;

  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: '0 20px 80px' }}>
      <header style={{ padding: '40px 0 24px', borderBottom: '1px solid var(--line)' }}>
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 12,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--stone)',
            marginBottom: 10,
          }}
        >
          {trail.park_or_forest || trail.region}
        </div>
        <h1
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            lineHeight: 1.05,
            margin: '0 0 10px',
            color: 'var(--ink)',
          }}
        >
          {trail.name}
        </h1>
        {trail.subtitle && (
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 18,
              color: 'var(--stone)',
              margin: 0,
            }}
          >
            {trail.subtitle}
          </p>
        )}
      </header>

      {/* Stat strip — topo-legend style, not a card grid */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0',
          borderBottom: '1px solid var(--line)',
        }}
      >
        {[
          ['Distance', trail.distance_miles ? `${trail.distance_miles} mi` : null],
          ['Elevation gain', trail.elevation_gain_ft ? `${trail.elevation_gain_ft.toLocaleString()} ft` : null],
          ['Difficulty', trail.difficulty ? DIFFICULTY_LABEL[trail.difficulty] : null],
          ['Route', trail.route_type ? ROUTE_LABEL[trail.route_type] : null],
          ['Time', formatTime(trail.est_time_minutes)],
        ]
          .filter(([, v]) => v)
          .map(([label, value]) => (
            <div
              key={label}
              style={{
                flex: '1 1 120px',
                padding: '18px 16px',
                borderRight: '1px solid var(--line)',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--stone)',
                  marginBottom: 4,
                }}
              >
                {label}
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 700 }}>{value}</div>
            </div>
          ))}
      </div>

      {trail.summary && (
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            color: 'var(--ink)',
            margin: '28px 0',
            maxWidth: 640,
          }}
        >
          {trail.summary}
        </p>
      )}

      {/* Map */}
      <div
        style={{
          height: 420,
          border: '1px solid var(--line)',
          borderRadius: 4,
          overflow: 'hidden',
          margin: '24px 0',
        }}
      >
        {trail.trailhead_lat && trail.trailhead_lng && (
          <TrailMap
            lat={trail.trailhead_lat}
            lng={trail.trailhead_lng}
            routeLine={routeLine}
            waypoints={waypoints}
          />
        )}
      </div>

      {/* Elevation */}
      <section style={{ margin: '36px 0' }}>
        <h2 style={sectionHeading}>The Climb</h2>
        <ElevationProfile gainFt={trail.elevation_gain_ft} distanceMiles={trail.distance_miles} />
      </section>

      {/* What to expect */}
      <section style={{ margin: '36px 0' }}>
        <h2 style={sectionHeading}>What to Expect</h2>
        <dl style={{ margin: 0 }}>
          {trail.parking_notes && <Field label="Parking" value={trail.parking_notes} />}
          {trail.fee_required !== null && (
            <Field
              label="Fees"
              value={trail.fee_required ? trail.fee_notes || 'Entrance fee required' : 'No fee required'}
            />
          )}
          {trail.dog_policy && <Field label="Dogs" value={trail.dog_policy} />}
          {trail.best_seasons && trail.best_seasons.length > 0 && (
            <Field label="Best seasons" value={trail.best_seasons.join(', ')} />
          )}
          {trail.water_sources && <Field label="Water" value={trail.water_sources} />}
          {trail.cell_service && <Field label="Cell service" value={trail.cell_service} />}
          {trail.hazards && <Field label="Hazards" value={trail.hazards} />}
        </dl>
      </section>

      {trail.article_url && (
        <a
          href={trail.article_url}
          style={{
            display: 'inline-block',
            marginTop: 20,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: 16,
            color: 'var(--rust)',
            borderBottom: '1px solid var(--rust)',
            paddingBottom: 2,
          }}
        >
          Read the full trail guide on Shenandoan &rarr;
        </a>
      )}
    </main>
  );
}

const sectionHeading: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontWeight: 700,
  letterSpacing: '-0.01em',
  fontSize: 22,
  margin: '0 0 14px',
  color: 'var(--ink)',
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', padding: '10px 0', borderTop: '1px solid var(--line)', gap: 20 }}>
      <dt
        style={{
          flex: '0 0 140px',
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--stone)',
          paddingTop: 2,
        }}
      >
        {label}
      </dt>
      <dd style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>{value}</dd>
    </div>
  );
}
