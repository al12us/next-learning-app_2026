import Link from 'next/link';
import { NextjsIcon, ReactIcon, TypescriptIcon, RestApiIcon } from '@/components/TechIcons';

export default function Home() {
  const features = [
    {
      title: "Server & Client Components",
      desc: "Descoperă diferența esențială dintre componentele randate pe server și cele interactive din client.",
      icon: "⚡",
      badge: "Arhitectură",
      badgeClass: "badge-indigo",
      link: "/about",
      actionText: "Vezi Pagina Despre ➔",
    },
    {
      title: "Data Fetching pe Server",
      desc: "Fetch de date asincron direct în Server Components fără useEffect sau biblioteci suplimentare.",
      icon: "🌐",
      badge: "Server-Side",
      badgeClass: "badge-cyan",
      link: "/users",
      actionText: "Vezi Utilizatorii ➔",
    },
    {
      title: "Fullstack CRUD & API Routes",
      desc: "Creează, citește, editează și șterge articole cu propriul API REST Next.js și router.refresh().",
      icon: "📝",
      badge: "Fullstack API",
      badgeClass: "badge-emerald",
      link: "/posts",
      actionText: "Deschide Blogul CRUD ➔",
    },
    {
      title: "Rute Dinamice ([id])",
      desc: "Navighează prin pagini dinamice cu parametri URL asincroni conform standardului Next.js 16.",
      icon: "🎯",
      badge: "Routing",
      badgeClass: "badge-purple",
      link: "/users/1",
      actionText: "Exemplu Utilizator #1 ➔",
    }
  ];

  const techBadges = [
    { name: "Next.js 16", desc: "App Router & SSR", icon: <NextjsIcon size={28} />, url: "https://nextjs.org/docs" },
    { name: "React 19", desc: "Server Components", icon: <ReactIcon size={28} />, url: "https://react.dev/" },
    { name: "TypeScript 5", desc: "Strict Type Safety", icon: <TypescriptIcon size={28} />, url: "https://www.typescriptlang.org/docs/" },
    { name: "REST API", desc: "Route Handlers", icon: <RestApiIcon size={28} />, url: "https://developer.mozilla.org/en-US/docs/Glossary/REST" }
  ];

  return (
    <main className="app-container animate-fade-in">
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '40px 0 50px', maxWidth: '840px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', marginBottom: '20px' }}>
          <span className="badge badge-indigo" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            🚀 Next.js 16 + React 19 Project Hub
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', lineHeight: '1.15', marginBottom: '20px' }}>
          Învață dezvoltarea modernă <br />
          cu <span className="gradient-text">Next.js & React</span>
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '32px' }}>
          O călătorie practică de la concepte de bază până la <strong>Server Components</strong>, 
          <strong> Rute Dinamice</strong> și operații <strong>CRUD Backend</strong> complete.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/posts" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '1.05rem' }}>
            📝 Explorează Blogul CRUD
          </Link>
          <Link href="/users" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '1.05rem' }}>
            👥 Lista Utilizatori
          </Link>
        </div>
      </section>

      {/* Tech Stack Banner cu Logo-uri SVG */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '60px'
      }}>
        {techBadges.map((tech) => (
          <a
            key={tech.name}
            href={tech.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card"
            style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid var(--border-subtle)',
              flexShrink: 0
            }}>
              {tech.icon}
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-primary)' }}>{tech.name}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>{tech.desc}</div>
            </div>
          </a>
        ))}
      </div>

      {/* Feature Cards Grid */}
      <section>
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Funcționalități & Lecții Implementate</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Fiecare modul reflectă o etapă esențială în ecosistemul Next.js.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {features.map((feat) => (
            <div key={feat.title} className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '2rem' }}>{feat.icon}</span>
                  <span className={`badge ${feat.badgeClass}`}>{feat.badge}</span>
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{feat.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '20px' }}>
                  {feat.desc}
                </p>
              </div>

              <Link href={feat.link} className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start', color: '#a5b4fc', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                {feat.actionText}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}