import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '40px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Bun venit în Next.js! ⚡</h1>
      <p>Aceasta este o pagină randată pe <strong>Server (Server Component)</strong>.</p>
      <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
        <Link href="/about" style={{ background: '#0070f3', color: '#fff', padding: '10px 16px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>
          Mergi la pagina Despre noi ➔
        </Link>
        <Link href="/users" style={{ background: '#10b981', color: '#fff', padding: '10px 16px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>
          Mergi la pagina cu lista utilizatorilor ➔
        </Link>
      </div>
    </main>
  );
}