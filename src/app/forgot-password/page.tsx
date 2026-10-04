'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });
  const [devLink, setDevLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: 'idle', message: '' });
    setDevLink(null);

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Eroare la trimitere.' });
      } else {
        setStatus({ type: 'success', message: data.message });
        // În dev: afișăm direct link-ul de resetare (în prod s-ar trimite prin email)
        if (data.devResetLink) setDevLink(data.devResetLink);
      }
    } catch {
      setStatus({ type: 'error', message: 'Eroare de rețea. Încearcă din nou.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="app-container animate-fade-in"
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}
    >
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔑</div>
          <h1 className="page-title" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
            Ai uitat parola?
          </h1>
          <p className="page-subtitle" style={{ fontSize: '0.92rem' }}>
            Introdu adresa de email și îți vom trimite un link de resetare.
          </p>
        </div>

        {/* Mesaj status */}
        {status.message && (
          <div
            className={`badge ${status.type === 'error' ? 'badge-rose' : 'badge-emerald'}`}
            style={{
              width: '100%',
              display: 'block',
              textAlign: 'center',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '0.9rem',
            }}
          >
            {status.message}
          </div>
        )}

        {/* 🛠️ Link Dev — afișat DOAR în development */}
        {devLink && (
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              marginBottom: '20px',
              fontSize: '0.82rem',
            }}
          >
            <div style={{ color: '#fde047', fontWeight: '700', marginBottom: '6px' }}>
              🛠️ Mod Dezvoltare — Link de Resetare:
            </div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.78rem' }}>
              În producție, acesta ar fi trimis pe email. Acum îl afișăm direct:
            </div>
            <Link
              href={devLink}
              style={{
                color: 'var(--accent-indigo)',
                wordBreak: 'break-all',
                textDecoration: 'underline',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
              }}
            >
              {window?.location?.origin}{devLink}
            </Link>
          </div>
        )}

        {/* Formular */}
        {status.type !== 'success' && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="reset-email">
                Adresa de email
              </label>
              <input
                id="reset-email"
                type="email"
                className="form-input"
                placeholder="nume@nextapp.ro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              id="forgot-submit-btn"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%', padding: '12px', marginTop: '4px' }}
            >
              {isLoading ? '⏳ Se procesează...' : '📧 Trimite Link de Resetare'}
            </button>
          </form>
        )}

        {/* Footer navigare */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '28px',
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          <Link href="/login" style={{ color: 'var(--accent-indigo)', fontWeight: '600', textDecoration: 'none' }}>
            ← Înapoi la Log In
          </Link>
          <Link href="/register" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            Cont nou
          </Link>
        </div>
      </div>
    </main>
  );
}
