import { supabase, Trail, Waypoint } from '@/lib/supabase';
import ElevationProfile from '@/components/ElevationProfile';
import TrailMap from '@/components/TrailMapClient';
import { getForecast, forecastIcon } from '@/lib/weather';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  hard: 'Hard',
  strenuous: 'Very Strenuous',
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: 'var(--diff-easy)',
  moderate: 'var(--diff-moderate)',
  hard: 'var(--diff-hard)',
  strenuous: 'var(--diff-strenuous)',
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

  const forecast =
    trail.trailhead_lat && trail.trailhead_lng ? await getForecast(trail.trailhead_lat, trail.trailhead_lng) : null;

  const routeLine: [number, number][] | undefined = trail.geojson?.coordinates
    ? trail.geojson.coordinates.map((c: [number, number]) => [c[1], c[0]])
    : undefined;

  const startCoord: [number, number] | undefined =
    routeLine && routeLine.length > 0
      ? routeLine[0]
      : trail.trailhead_lat && trail.trailhead_lng
      ? [trail.trailhead_lat, trail.trailhead_lng]
      : undefined;

  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: '0 20px 80px' }}>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          marginTop: 24,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: '0.01em',
          color: 'var(--muted)',
          textDecoration: 'none',
        }}
      >
        &larr; All trails
      </Link>
      <header style={{ padding: '16px 0 24px' }}>
        <div
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--accent)',
            marginBottom: 10,
          }}
        >
          {trail.park_or_forest || trail.region}
        </div>
        <h1
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
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
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 500,
              fontSize: 18,
              color: 'var(--muted)',
              margin: 0,
            }}
          >
            {trail.subtitle}
          </p>
        )}
      </header>

      {/* Stat strip — grid dividers via gap, not borders (so a lone last
          item on mobile doesn't stretch full-width with a stray edge) */}
      <div
        className="stat-grid"
        style={{
          border: '1px solid var(--line)',
          borderRadius: 12,
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}
      >
        {[
          ['Distance', trail.distance_miles ? `${trail.distance_miles} mi` : null, null],
          ['Elevation gain', trail.elevation_gain_ft ? `${trail.elevation_gain_ft.toLocaleString()} ft` : null, null],
          [
            'Difficulty',
            trail.difficulty ? DIFFICULTY_LABEL[trail.difficulty] : null,
            trail.difficulty ? DIFFICULTY_COLOR[trail.difficulty] : null,
          ],
          ['Route', trail.route_type ? ROUTE_LABEL[trail.route_type] : null, null],
          ['Time', formatTime(trail.est_time_minutes), null],
        ]
          .filter(([, v]) => v)
          .map(([label, value, dotColor]) => (
            <div
              key={label as string}
              style={{
                background: 'var(--surface)',
                padding: '18px 16px',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--muted)',
                  marginBottom: 4,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: 20,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {dotColor && (
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: dotColor as string,
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                )}
                {value}
              </div>
            </div>
          ))}
      </div>

      {/* Character chips — quiet pill style */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '20px 0 0' }}>
        {[
          trail.fee_required ? 'Fee required' : null,
          trail.dog_policy ? (trail.dog_policy.toLowerCase().includes('not') ? 'Dogs not allowed' : 'Dogs on leash') : null,
          ...(trail.tags || []),
        ]
          .filter((v): v is string => Boolean(v))
          .map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--ink)',
                background: '#eae8e1',
                borderRadius: 999,
                padding: '7px 14px',
              }}
            >
              {tag}
            </span>
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

      {/* Weather — live NWS forecast for the trailhead coordinates */}
      {forecast && forecast.length > 0 && (
        <section style={{ margin: '28px 0' }}>
          <h2 style={sectionHeading}>Weather at the Trailhead</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${forecast.length}, 1fr)`,
              gap: 1,
              background: 'var(--line)',
              border: '1px solid var(--line)',
              borderRadius: 12,
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
            }}
          >
            {forecast.map((period) => (
              <div key={period.name} style={{ background: 'var(--surface)', padding: '16px 14px' }}>
                <div
                  style={{
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--muted)',
                    marginBottom: 6,
                  }}
                >
                  {period.name}
                </div>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{forecastIcon(period.shortForecast)}</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, fontWeight: 700 }}>
                  {period.temperature}°{period.temperatureUnit}
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{period.shortForecast}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
            From the National Weather Service, for the trailhead coordinates — conditions can differ at elevation.
          </div>
        </section>
      )}

      {/* Map */}
      <div
        style={{
          height: 420,
          border: '1px solid var(--line)',
          borderRadius: 12,
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
          margin: '24px 0 12px',
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

      {startCoord && (
        <div className="btn-row" style={{ margin: '20px 0 24px' }}>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${startCoord[0]},${startCoord[1]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Directions (Google Maps)
          </a>
          <a
            href={`https://maps.apple.com/?daddr=${startCoord[0]},${startCoord[1]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Apple Maps
          </a>
          <a href={`/trail/${trail.slug}/gpx`} className="btn-secondary">
            Download GPX
          </a>
        </div>
      )}

      {/* Elevation */}
      <section style={{ margin: '36px 0' }}>
        <h2 style={sectionHeading}>The Climb</h2>
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            boxShadow: 'var(--shadow-sm)',
            padding: '20px 16px 16px',
          }}
        >
          <ElevationProfile
            profile={trail.elevation_profile}
            gainFt={trail.elevation_gain_ft}
            distanceMiles={trail.distance_miles}
          />
        </div>
      </section>

      {/* What to expect */}
      <section style={{ margin: '36px 0' }}>
        <h2 style={sectionHeading}>What to Expect</h2>
        <dl
          style={{
            margin: 0,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            boxShadow: 'var(--shadow-sm)',
            padding: '4px 20px',
          }}
        >
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
          {trail.hazards && <Field label="Hazards" value={trail.hazards} last />}
        </dl>
      </section>

      {trail.article_url && (
        <a
          href={trail.article_url}
          style={{
            display: 'inline-block',
            marginTop: 20,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontWeight: 600,
            fontSize: 16,
            color: 'var(--accent)',
          }}
        >
          Read the full trail guide on Shenandoan &rarr;
        </a>
      )}
    </main>
  );
}

const sectionHeading: React.CSSProperties = {
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  fontWeight: 700,
  letterSpacing: '-0.01em',
  fontSize: 22,
  margin: '0 0 14px',
  color: 'var(--ink)',
};

function Field({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className="field-row" style={{ borderBottom: last ? 'none' : '1px solid var(--line)' }}>
      <dt
        className="field-label"
        style={{
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--muted)',
          margin: 0,
        }}
      >
        {label}
      </dt>
      <dd className="field-value" style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>
        {value}
      </dd>
    </div>
  );
}
