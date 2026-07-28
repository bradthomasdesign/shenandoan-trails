'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AccessForm() {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const next = params.get('next') || '/';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    setLoading(true);
    try {
      const res = await fetch('/api/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        window.location.href = next;
      } else {
        setError(true);
        setLoading(false);
      }
    } catch {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Access code"
          autoFocus
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 16,
            padding: '14px 16px',
            border: '1px solid var(--line)',
            borderRadius: 10,
            background: 'var(--surface)',
            color: 'var(--ink)',
          }}
        />
        <button type="submit" className="btn-primary" disabled={loading || !code} style={{ border: 'none' }}>
          {loading ? 'Checking…' : 'Unlock'}
        </button>
      </form>
      {error && (
        <p style={{ color: 'var(--diff-hard)', fontSize: 14, marginTop: 12 }}>
          That code didn&apos;t work. Check the newsletter for the current code.
        </p>
      )}
      <a
        href="https://shenandoan.com/subscribe"
        style={{
          display: 'inline-block',
          marginTop: 28,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontWeight: 600,
          fontSize: 14,
          color: 'var(--accent)',
        }}
      >
        Not a subscriber yet? Subscribe free at Shenandoan.com &rarr;
      </a>
    </>
  );
}
