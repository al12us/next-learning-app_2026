'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<{ type: 'error' | 'success' | 'idle', message: string }>({ type: 'idle', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Înregistrare eșuată.' });
      } else {
        setStatus({ type: 'success', message: 'Contul a fost creat cu succes! Te poți loga acum.' });
        // Redirecționăm către login după 1.5 secunde
        setTimeout(() => {
          router.push('/login');
        }, 1500);
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
          <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>Cont Nou 🚀</h1>
          <p className="page-subtitle" style={{ fontSize: '0.95rem' }}>Alătură-te platformei noastre.</p>
        </div>

        {status.message && (
          <div className={`badge ${status.type === 'error' ? 'badge-rose' : 'badge-emerald'}`} style={{ width: '100%', display: 'block', textAlign: 'center', padding: '12px', marginBottom: '24px', fontSize: '0.9rem' }}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Nume Complet</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isLoading}
            style={{ width: '100%', marginTop: '12px', padding: '12px' }}
          >
            {isLoading ? 'Se procesează...' : 'Creează Contul'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Ai deja un cont?{' '}
          <Link href="/login" style={{ color: 'var(--accent-indigo)', fontWeight: '600', textDecoration: 'none' }}>
            Loghează-te aici
          </Link>
        </div>
      </div>
    </main>
  );
}