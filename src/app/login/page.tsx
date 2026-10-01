'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<{ type: 'error' | 'success' | 'idle', message: string }>({ type: 'idle', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Autentificare eșuată.' });
      } else {
        setStatus({ type: 'success', message: 'Te-ai logat cu succes! Redirecționare...' });
        // Redirecționăm utilizatorul după 1 secundă
        setTimeout(() => {
          window.location.href = '/posts';
        }, 1000);
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Eroare de rețea.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="app-container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>Log In 🔐</h1>
          <p className="page-subtitle" style={{ fontSize: '0.95rem' }}>Bine ai revenit! Te rugăm să te autentifici.</p>
        </div>

        {status.message && (
          <div className={`badge ${status.type === 'error' ? 'badge-rose' : 'badge-emerald'}`} style={{ width: '100%', display: 'block', textAlign: 'center', padding: '12px', marginBottom: '24px', fontSize: '0.9rem' }}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
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

          <div className="form-group">
            <label className="form-label" htmlFor="password">Parolă</label>
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

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isLoading}
            style={{ width: '100%', marginTop: '12px', padding: '12px' }}
          >
            {isLoading ? 'Se procesează...' : 'Intră în cont'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Nu ai cont încă?{' '}
          <Link href="/register" style={{ color: 'var(--accent-indigo)', fontWeight: '600', textDecoration: 'none' }}>
            Creează unul aici
          </Link>
        </div>
      </div>
    </main>
  );
}
