import Link from 'next/link';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  company: {
    name: string;
  };
}

export default async function UsersPage() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const users: User[] = await response.json();

  // Helper pentru generare inițiale
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('');
  };

  const gradients = [
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
    'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
    'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
  ];

  return (
    <main className="app-container animate-fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-cyan">Data Fetching pe Server</span>
        </div>
        <h1 className="page-title">
          Lista Utilizatori 👥
        </h1>
        <p className="page-subtitle">
          Aceste date au fost descărcate asincron direct pe serverul Next.js și randate în HTML înainte de a ajunge în browser.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {users.map((user, idx) => (
          <div key={user.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Header card cu avatar și badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: gradients[idx % gradients.length],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                  {getInitials(user.name)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '2px' }}>{user.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID #{user.id}</span>
                </div>
              </div>

              {/* Detalii de contact */}
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✉️</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🏢</span>
                  <span className="badge badge-indigo" style={{ textTransform: 'none', fontSize: '0.75rem', padding: '2px 8px' }}>
                    {user.company.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Link către pagina dinamică [id] */}
            <Link
              href={`/users/${user.id}`}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', textAlign: 'center' }}
            >
              Vezi Profil Complet ➔
            </Link>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
        <Link href="/" className="btn btn-ghost">
          ⬅ Înapoi Acasă
        </Link>
      </div>
    </main>
  );
}