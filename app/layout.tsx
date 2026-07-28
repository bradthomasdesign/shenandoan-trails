import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shenandoan Trails',
  description: 'Trail guides for the Shenandoah Valley, from Shenandoan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            padding: '18px 20px 0',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
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
        {children}
      </body>
    </html>
  );
}
