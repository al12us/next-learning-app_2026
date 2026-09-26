'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Acasă', icon: '🏠' },
    { href: '/about', label: 'Despre', icon: 'ℹ️' },
    { href: '/users', label: 'Utilizatori', icon: '👥' },
    { href: '/posts', label: 'Blog (CRUD)', icon: '📝' },
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
        <nav>
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
        </nav>


      </div>
    </header>
  );
}
