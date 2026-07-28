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
      <body>{children}</body>
    </html>
  );
}
