import { Suspense } from 'react';
import AccessForm from './AccessForm';

export default function AccessPage() {
  return (
    <main style={{ maxWidth: 420, margin: '0 auto', padding: '90px 20px 60px' }}>
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
          fontSize: 'clamp(1.7rem, 5vw, 2.2rem)',
          margin: '0 0 12px',
          color: 'var(--ink)',
        }}
      >
        Trail guides for subscribers
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.5, margin: '0 0 28px' }}>
        This trail guide is a free perk for Shenandoan subscribers. Enter the access code from the
        newsletter to get in.
      </p>
      <Suspense fallback={null}>
        <AccessForm />
      </Suspense>
    </main>
  );
}
