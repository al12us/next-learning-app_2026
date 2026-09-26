import Link from 'next/link';
import { NextjsIcon, ReactIcon, TypescriptIcon } from '@/components/TechIcons';

export default function Footer() {
  return (
    <footer className="footer-glass">
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.1rem' }}>⚡</span>
              <strong style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>Next.js 16 Learning Hub</strong>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Dezvoltat cu React 19, TypeScript, Server Components & App Router
            </p>
          </div>

          <div style={{ display: 'flex', gap: '20px', fontSize: '0.875rem' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Acasă</Link>
            <Link href="/about" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Despre</Link>
            <Link href="/users" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Utilizatori</Link>
            <Link href="/posts" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Blog CRUD</Link>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} NextLearn App. Toate drepturile rezervate.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
              <NextjsIcon size={16} /> Next.js 16
            </a>
            <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
              <ReactIcon size={16} /> React 19
            </a>
            <a href="https://www.typescriptlang.org/docs/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
              <TypescriptIcon size={16} /> TypeScript 5
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
