import Link from 'next/link';
import Counter from '../../components/Counter';

export default function AboutPage() {
    return (
        <main style={{ padding: '40px', fontFamily: 'system-ui,sans-serif' }}>
            <h1>Despre Noi  ℹ️</h1>
            <p>Aceasta este o rută creată automat de Next.js prin simpla existență a folderului <code>src/app/about</code>!</p>
            <Counter />
            <div style={{ marginTop: '20px' }}>

                <Link
                    href="/" style={{ background: '#333', color: '#fff', padding: '10px 16px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>
                    ⬅ Înapoi la pagina Principală!
                </Link>
            </div>
        </main>
    );
}