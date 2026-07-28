'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SiteHeader() {
  const pathname = usePathname();
  const onTrailPage = pathname?.startsWith('/trail/');

  return (
    <div
      style={{
        maxWidth: 1080,
        margin: '0 auto',
        padding: '18px 20px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {onTrailPage ? (
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
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
      ) : (
        <span />
      )}
      <a
        href="https://shenandoan.com"
        style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--muted)',
          textDecoration: 'none',
        }}
      >
        Shenandoan.com &rarr;
      </a>
    </div>
  );
}
