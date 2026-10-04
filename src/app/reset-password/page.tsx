'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [tokenValid, setTokenValid] = useState<boolean | null>(null); // null = loading
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Validăm token-ul la încărcarea paginii
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }

    fetch(`/api/reset-password?token=${encodeURIComponent(token)}`)
      .then(res => setTokenValid(res.ok))
      .catch(() => setTokenValid(false));
  }, [token]);

  // Forța parolei
  const strength = (() => {
    if (!newPassword) return { score: 0, label: '', color: '' };
    let score = 0;
    if (newPassword.length >= 6) score++;
    if (newPassword.length >= 10) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;

    if (score <= 1) return { score, label: 'Slabă', color: '#f43f5e' };
    if (score <= 3) return { score, label: 'Medie', color: '#f59e0b' };
    return { score, label: 'Puternică', color: '#10b981' };
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'Parolele nu se potrivesc.' });
      return;
    }
    if (newPassword.length < 6) {
      setStatus({ type: 'error', message: 'Parola trebuie să aibă cel puțin 6 caractere.' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: 'error', message: data.error });
        if (data.error?.includes('expirat') || data.error?.includes('invalid')) {
          setTokenValid(false);
        }
      } else {
        setStatus({ type: 'success', message: data.message });
      }
    } catch {
      setStatus({ type: 'error', message: 'Eroare de rețea. Încearcă din nou.' });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (tokenValid === null) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
        Se verifică link-ul...
      </div>
    );
  }

  // ── Token invalid / expirat ──────────────────────────────────────────────────
  if (!tokenValid) {
    return (
      <>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>❌</div>
          <h1 className="page-title" style={{ fontSize: '1.8rem', color: '#f43f5e' }}>
            Link invalid sau expirat
          </h1>
          <p className="page-subtitle" style={{ fontSize: '0.92rem', marginTop: '8px' }}>
            Acest link de resetare nu mai este valabil.<br />
            Link-urile expiră după <strong>15 minute</strong>.
          </p>
        </div>
        <Link href="/forgot-password" className="btn btn-primary" style={{ width: '100%', padding: '12px', textAlign: 'center', display: 'block' }}>
          🔑 Solicită un link nou
        </Link>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link href="/login" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>← Înapoi la Log In</Link>
        </div>
      </>
    );
  }

  // ── Succes ────────────────────────────────────────────────────────────────────
  if (status.type === 'success') {
    return (
      <>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>✅</div>
          <h1 className="page-title" style={{ fontSize: '1.8rem' }}>Parolă resetată!</h1>
          <p className="page-subtitle" style={{ marginTop: '8px' }}>{status.message}</p>
        </div>
        <Link href="/login" className="btn btn-primary" style={{ width: '100%', padding: '12px', textAlign: 'center', display: 'block' }}>
          🔐 Mergi la Log In
        </Link>
      </>
    );
  }

  // ── Formular resetare ────────────────────────────────────────────────────────
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔒</div>
        <h1 className="page-title" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
          Resetează parola
        </h1>
        <p className="page-subtitle" style={{ fontSize: '0.92rem' }}>
          Alege o parolă nouă sigură pentru contul tău.
        </p>
      </div>

      {status.message && (
        <div
          className="badge badge-rose"
          style={{ width: '100%', display: 'block', textAlign: 'center', padding: '12px', marginBottom: '20px', fontSize: '0.9rem' }}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Parolă nouă */}
        <div className="form-group">
          <label className="form-label" htmlFor="new-password">Parolă nouă</label>
          <div style={{ position: 'relative' }}>
            <input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              placeholder="Cel puțin 6 caractere"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoFocus
              style={{ paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem',
                color: 'var(--text-muted)',
              }}
              title={showPassword ? 'Ascunde parola' : 'Arată parola'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Indicator forță parolă */}
          {newPassword && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} style={{
                    flex: 1, height: '3px', borderRadius: '2px',
                    background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.1)',
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
              <span style={{ fontSize: '0.75rem', color: strength.color }}>{strength.label}</span>
            </div>
          )}
        </div>

        {/* Confirmare parolă */}
        <div className="form-group">
          <label className="form-label" htmlFor="confirm-password">Confirmă parola</label>
          <input
            id="confirm-password"
            type={showPassword ? 'text' : 'password'}
            className="form-input"
            placeholder="Repetă parola nouă"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              borderColor: confirmPassword && confirmPassword !== newPassword ? '#f43f5e' : undefined,
            }}
          />
          {confirmPassword && confirmPassword !== newPassword && (
            <p style={{ color: '#f43f5e', fontSize: '0.78rem', marginTop: '4px' }}>
              ⚠️ Parolele nu se potrivesc
            </p>
          )}
        </div>

        <button
          type="submit"
          id="reset-submit-btn"
          className="btn btn-primary"
          disabled={isLoading || newPassword !== confirmPassword || newPassword.length < 6}
          style={{ width: '100%', padding: '12px', marginTop: '4px' }}
        >
          {isLoading ? '⏳ Se procesează...' : '✅ Resetează Parola'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link href="/login" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>← Înapoi la Log In</Link>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <main
      className="app-container animate-fade-in"
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}
    >
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
        <Suspense fallback={
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            ⏳ Se încarcă...
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
