import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div className="glass-card" style={{ padding: '60px', maxWidth: '500px' }}>
        <h1 style={{ fontSize: '6rem', margin: '0', lineHeight: '1', color: 'var(--accent-indigo)' }}>404</h1>
        <h2 style={{ fontSize: '1.8rem', marginTop: '16px', marginBottom: '16px' }}>Pagină Negăsită 🕵️‍♂️</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.1rem', lineHeight: '1.5' }}>
          Oops! Ruta pe care o cauți nu există sau a fost mutată. Întoarce-te în siguranță la pagina principală.
        </p>
        <Link href="/" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '1.05rem' }}>
          🏠 Înapoi Acasă
        </Link>
      </div>
    </div>
  );
}
