import { supabase, Trail } from '@/lib/supabase';
import Link from 'next/link';

async function getTrails(): Promise<Trail[]> {
  const { data } = await supabase
    .from('trails')
    .select('*')
    .eq('is_published', true)
    .order('name', { ascending: true });
  return data || [];
}

export default async function HomePage() {
  const trails = await getTrails();

  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: '48px 20px 80px' }}>
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
        Shenandoan
      </div>
      <h1
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          margin: '0 0 8px',
        }}
      >
        Trail Guides
      </h1>
      <p style={{ color: 'var(--stone)', fontSize: 16, marginBottom: 40, maxWidth: 560 }}>
        Maps, elevation, and what to expect on trails across the Shenandoah Valley.
      </p>

      {trails.length === 0 ? (
        <p style={{ color: 'var(--stone)' }}>No trails published yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {trails.map((trail) => (
            <Link
              key={trail.id}
              href={`/trail/${trail.slug}`}
              style={{
                display: 'block',
                padding: '20px 0',
                borderTop: '1px solid var(--line)',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  fontSize: 24,
                  color: 'var(--ink)',
                  marginBottom: 4,
                }}
              >
                {trail.name}
              </div>
              <div style={{ fontSize: 13, color: 'var(--stone)' }}>
                {[
                  trail.distance_miles ? `${trail.distance_miles} mi` : null,
                  trail.elevation_gain_ft ? `${trail.elevation_gain_ft.toLocaleString()} ft gain` : null,
                  trail.park_or_forest,
                ]
                  .filter(Boolean)
                  .join(' \u00b7 ')}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
