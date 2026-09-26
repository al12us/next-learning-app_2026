import Link from 'next/link';

interface UserDetail {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
  };
  address: {
    city: string;
    street: string;
    suite: string;
    zipcode: string;
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;

  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

  if (!response.ok) {
    return (
      <main className="app-container animate-fade-in" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="glass-card-static" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>❌</div>
          <h2 style={{ marginBottom: '12px' }}>Utilizatorul #{id} nu a fost găsit</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Nu am putut găsi înregistrări pentru ID-ul solicitat.
          </p>
          <Link href="/users" className="btn btn-primary">
            ⬅ Înapoi la lista de utilizatori
          </Link>
        </div>
      </main>
    );
  }

  const user: UserDetail = await response.json();

  return (
    <main className="app-container animate-fade-in" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/users" className="btn btn-ghost btn-sm">
          ⬅ Înapoi la toți utilizatorii
        </Link>
      </div>

      <div className="glass-card-static" style={{ padding: '36px', position: 'relative' }}>
        {/* Header profil */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)'
          }}>
            {user.name.charAt(0)}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>{user.name}</h1>
              <span className="badge badge-indigo">ID #{user.id}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>@{user.username}</p>
          </div>
        </div>

        {/* Informații structurate în 2 coloane */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '28px'
        }}>
          {/* Card Contact */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1rem', color: '#a5b4fc', marginBottom: '14px' }}>📞 Date de Contact</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div><strong style={{ color: 'var(--text-primary)' }}>✉️ Email:</strong> {user.email}</div>
              <div><strong style={{ color: 'var(--text-primary)' }}>📱 Telefon:</strong> {user.phone}</div>
              <div><strong style={{ color: 'var(--text-primary)' }}>🌐 Website:</strong> {user.website}</div>
            </div>
          </div>

          {/* Card Companie */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1rem', color: '#6ee7b7', marginBottom: '14px' }}>🏢 Companie & Misiune</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div><strong style={{ color: 'var(--text-primary)' }}>Nume:</strong> {user.company.name}</div>
              <div style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>"{user.company.catchPhrase}"</div>
            </div>
          </div>

          {/* Card Adresă (full width dacă e cazul) */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            gridColumn: '1 / -1'
          }}>
            <h3 style={{ fontSize: '1rem', color: '#7dd3fc', marginBottom: '14px' }}>📍 Locație & Adresă</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {user.address.street}, {user.address.suite}, {user.address.city}, Cod poștal: {user.address.zipcode}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
          <span className="badge badge-purple">Next.js Dynamic Route</span>
          <Link href="/users" className="btn btn-secondary btn-sm">
            Lista completă de utilizatori ➔
          </Link>
        </div>
      </div>
    </main>
  );
}