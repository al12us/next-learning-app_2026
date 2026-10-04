'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Verificăm starea de autentificare printr-un endpoint dedicat
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(true);
        setUserData(data.user);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch {
      setIsLoggedIn(false);
      setUserData(null);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth, pathname]); // Re-verificăm la fiecare schimbare de pagină

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
      setIsLoggedIn(false);
      setUserData(null);
      router.push('/');
      router.refresh(); // Curăță cache-ul Next.js
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { href: '/', label: 'Acasă', icon: '🏠' },
    { href: '/about', label: 'Despre', icon: 'ℹ️' },
    { href: '/users', label: 'Utilizatori', icon: '👥' },
    { href: '/posts', label: 'Blog (CRUD)', icon: '📝' },
    { href: '/calculator', label: 'Calculator', icon: '🧮' },
  ];

  return (
    <header className="navbar-glass">
      <div className="navbar-container">
        {/* Logo */}
        <Link href="/" className="nav-logo">
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--gradient-brand)',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
            fontSize: '1.2rem'
          }}>
            ⚡
          </span>
          <span>Next<span className="gradient-text">App</span></span>
        </Link>

        {/* Link-uri de navigare */}
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <ul className="nav-links">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`nav-link-item ${isActive ? 'nav-link-active' : ''}`}
                  >
                    <span style={{ marginRight: '6px' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Autentificare — condiționat pe starea de login */}
          <div style={{ display: 'flex', gap: '10px', paddingLeft: '24px', borderLeft: '1px solid rgba(255,255,255,0.1)', alignItems: 'center' }}>
            {isLoggedIn ? (
              // ── Utilizator logat ─────────────────────────────────────────
              <>
                <Link href="/profile" style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'background 0.2s'
                }}
                className="hover-bg-light"
                >
                  {userData?.avatar ? (
                    <img 
                      src={userData.avatar} 
                      alt="Avatar" 
                      style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        objectFit: 'cover'
                      }} 
                    />
                  ) : (
                    <span style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: '#10b981', display: 'inline-block',
                      boxShadow: '0 0 6px #10b981',
                    }} />
                  )}
                  Profil
                </Link>
                <button
                  id="logout-btn"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {isLoggingOut ? '⏳' : '🚪'} {isLoggingOut ? 'Ieșire...' : 'Deconectare'}
                </button>
              </>
            ) : (
              // ── Utilizator nelogat ────────────────────────────────────────
              <>
                <Link href="/login" id="login-btn" className="btn btn-ghost btn-sm" style={{ padding: '6px 12px' }}>
                  🔐 Log in
                </Link>
                <Link href="/register" id="register-btn" className="btn btn-primary btn-sm" style={{ padding: '6px 12px' }}>
                  ✨ Cont Nou
                </Link>
              </>
            )}
          </div>
        </nav>

      </div>
    </header>
  );
}
