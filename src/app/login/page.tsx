'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Generează o provocare CAPTCHA matematică simplă
function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const ops = ['+', '-', '×'] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let answer: number;
  if (op === '+') answer = a + b;
  else if (op === '-') answer = a - b;
  else answer = a * b;
  return { question: `${a} ${op} ${b} = ?`, answer };
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<{ type: 'error' | 'success' | 'idle'; message: string }>({
    type: 'idle',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // ─── Protecție Anti-Bot ──────────────────────────────────────────────────────
  // 1. Honeypot - câmp invizibil: omul nu îl vede, botul îl completează
  const [honeypot, setHoneypot] = useState('');

  // 2. Time-check - boturile submitează prea rapid (< 2 secunde)
  const formLoadTime = useRef<number>(Date.now());

  // 3. CAPTCHA matematic simplu
  const [captcha, setCaptcha] = useState<{question: string, answer: number} | null>(null);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState(false);

  // Evităm eroarea de "hydration mismatch" setând datele aleatorii abia pe client (după prima randare)
  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);
  // ─────────────────────────────────────────────────────────────────────────────

  // Regenerăm CAPTCHA la eroare de autentificare
  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
    setCaptchaError(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // ── Verificare 1: Honeypot ────────────────────────────────────────────────
    if (honeypot) {
      // Un bot a completat câmpul ascuns - respingem silențios
      setStatus({ type: 'error', message: 'Activitate suspectă detectată.' });
      return;
    }

    // ── Verificare 2: Time-check (min 2 secunde) ──────────────────────────────
    const elapsed = Date.now() - formLoadTime.current;
    if (elapsed < 2000) {
      setStatus({ type: 'error', message: 'Trimite prea rapid. Încearcă din nou.' });
      return;
    }

    // ── Verificare 3: CAPTCHA matematic ───────────────────────────────────────
    if (!captcha || parseInt(captchaInput, 10) !== captcha.answer) {
      setCaptchaError(true);
      refreshCaptcha();
      setStatus({ type: 'error', message: 'Răspuns CAPTCHA incorect. Încearcă din nou.' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: 'idle', message: '' });
    setCaptchaError(false);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Autentificare eșuată.' });
        refreshCaptcha();
      } else {
        setStatus({ type: 'success', message: 'Te-ai logat cu succes! Redirecționare...' });
        setTimeout(() => {
          window.location.href = '/posts';
        }, 1000);
      }
    } catch {
      setStatus({ type: 'error', message: 'Eroare de rețea.' });
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="app-container animate-fade-in"
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}
    >
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>
            Log In 🔐
          </h1>
          <p className="page-subtitle" style={{ fontSize: '0.95rem' }}>
            Bine ai revenit! Te rugăm să te autentifici.
          </p>
        </div>

        {status.message && (
          <div
            className={`badge ${status.type === 'error' ? 'badge-rose' : 'badge-emerald'}`}
            style={{
              width: '100%',
              display: 'block',
              textAlign: 'center',
              padding: '12px',
              marginBottom: '24px',
              fontSize: '0.9rem',
            }}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* ── 🍯 Honeypot: invizibil pentru oameni, botii il completeaza ─── */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '-9999px',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
              opacity: 0,
              pointerEvents: 'none',
            }}
          >
            <label htmlFor="website">Lasă acest câmp gol</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* ── Email ─────────────────────────────────────────────────────── */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="nume@exemplu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* ── Parolă ────────────────────────────────────────────────────── */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <label className="form-label" htmlFor="password">
                Parolă
              </label>
              <Link
                href="/forgot-password"
                style={{ fontSize: '0.78rem', color: 'var(--accent-indigo)', textDecoration: 'none', opacity: 0.85 }}
              >
                Ai uitat parola?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* ── 🔢 CAPTCHA Matematic ──────────────────────────────────────── */}
          <div className="form-group">
            <label className="form-label" htmlFor="captcha-input">
              Verificare umană — Rezolvă:{' '}
              <span
                style={{
                  display: 'inline-block',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  borderRadius: '8px',
                  padding: '2px 10px',
                  fontFamily: 'monospace',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  letterSpacing: '2px',
                  color: 'var(--accent-indigo)',
                }}
              >
                {captcha ? captcha.question : '...'}
              </span>
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                id="captcha-input"
                type="number"
                className="form-input"
                placeholder="Răspunsul tău"
                value={captchaInput}
                onChange={(e) => {
                  setCaptchaInput(e.target.value);
                  setCaptchaError(false);
                }}
                required
                style={{
                  borderColor: captchaError ? 'var(--accent-rose, #f43f5e)' : undefined,
                }}
              />
              <button
                type="button"
                title="Generează altă întrebare"
                onClick={refreshCaptcha}
                style={{
                  flexShrink: 0,
                  background: 'rgba(99,102,241,0.12)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.25)')
                }
                onMouseOut={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.12)')
                }
              >
                🔄
              </button>
            </div>
            <p
              style={{
                marginTop: '6px',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              🛡️ Protecție anti-bot activă
            </p>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ width: '100%', marginTop: '4px', padding: '12px' }}
          >
            {isLoading ? 'Se procesează...' : 'Intră în cont'}
          </button>
        </form>

        <div
          style={{
            textAlign: 'center',
            marginTop: '24px',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
          }}
        >
          Nu ai cont încă?{' '}
          <Link
            href="/register"
            style={{ color: 'var(--accent-indigo)', fontWeight: '600', textDecoration: 'none' }}
          >
            Creează unul aici
          </Link>
        </div>
      </div>
    </main>
  );
}
