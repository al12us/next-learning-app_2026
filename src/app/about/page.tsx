import Link from 'next/link';
import Counter from '@/components/Counter';
import { NextjsIcon, ReactIcon, TypescriptIcon, RestApiIcon, NodejsIcon, CssIcon } from '@/components/TechIcons';

export default function AboutPage() {
  const architecturalPoints = [
    {
      title: "File-System Based Routing",
      desc: "Fiecare folder din 'src/app/' devine automat o rută în browser, fără librării externe de routing.",
      tag: "App Router",
      icon: <NextjsIcon size={20} />
    },
    {
      title: "Server Components by Default",
      desc: "Paginile sunt randate nativ pe server pentru viteză maximă și zero pachete JS inutile trimise la client.",
      tag: "Server Side",
      icon: <ReactIcon size={20} />
    },
    {
      title: "Directiva 'use client'",
      desc: "Utilizată doar acolo unde avem nevoie de hooks (useState, useEffect) sau evenimente de click.",
      tag: "Interactive",
      icon: <TypescriptIcon size={20} />
    },
    {
      title: "REST API Route Handlers",
      desc: "Endpoints HTTP (GET, POST, PUT, DELETE) găzduite direct în 'app/api/posts/route.ts'.",
      tag: "Backend",
      icon: <RestApiIcon size={20} />
    }
  ];

  const fullStackList = [
    { name: "Next.js 16", icon: <NextjsIcon size={22} />, desc: "Framework Fullstack", url: "https://nextjs.org/docs" },
    { name: "React 19", icon: <ReactIcon size={22} />, desc: "UI Library & RSC", url: "https://react.dev/" },
    { name: "TypeScript 5", icon: <TypescriptIcon size={22} />, desc: "Static Typing", url: "https://www.typescriptlang.org/docs/" },
    { name: "Node.js runtime", icon: <NodejsIcon size={22} />, desc: "Backend Server", url: "https://nodejs.org/en/docs/" },
    { name: "Vanilla CSS 3", icon: <CssIcon size={22} />, desc: "Custom Design Tokens", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  ];

  return (
    <main className="app-container animate-fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-indigo">Concepte Fundamentale</span>
        </div>
        <h1 className="page-title">
          Despre Această Aplicație ℹ️
        </h1>
        <p className="page-subtitle">
          Creată în Next.js 16 cu suport complet pentru noul model React 19 Server Components.
        </p>
      </div>

      {/* Tech Stack Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '32px' }}>
        {fullStackList.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card"
            style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{item.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.desc}</div>
            </div>
          </a>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginBottom: '36px' }}>
        {/* Card explicativ */}
        <div className="glass-card-static" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>⚙️ Arhitectura Next.js</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {architecturalPoints.map((point) => (
              <div key={point.title} style={{ borderLeft: '3px solid var(--accent-indigo)', paddingLeft: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {point.icon}
                    <strong style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>{point.title}</strong>
                  </div>
                  <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>{point.tag}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {point.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Client Component Showcase */}
        <div className="glass-card-static" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>🧪 Exemplu: Client Component</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.5' }}>
              Componenta de mai jos include directiva <code>'use client'</code> și gestionează starea interactivă prin hook-ul <code>useState</code>.
            </p>
            <Counter />
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <Link href="/" className="btn btn-secondary btn-sm">
              ⬅ Înapoi la Acasă
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}