'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aici ai putea trimite eroarea catre un serviciu de logging (ex: Sentry)
    console.error("Eroare interceptată:", error);
  }, [error]);

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center' }}>
      <div className="glass-card" style={{ padding: '40px', maxWidth: '500px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#f87171', marginBottom: '16px' }}>⚠️ Ceva a mers greșit!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          O eroare neașteptată a împiedicat încărcarea acestei secțiuni.
        </p>
        <button
          onClick={() => reset()} // Incearca sa re-randeze segmentul
          className="btn btn-primary"
          style={{ background: '#ef4444', color: 'white', borderColor: '#dc2626' }}
        >
          🔄 Încearcă din nou
        </button>
      </div>
    </div>
  );
}
