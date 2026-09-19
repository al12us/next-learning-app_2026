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
// În Next.js modern, params este un Promise care conține parametrii din URL
interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
    const { id } = await params;

    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

    if (!response.ok) {
        return (<main style={{ padding: '40px', fontFamily: 'system-ui,sans-serif' }}>
            <h2>Utilizatorul cu ID-ul {id} nu a fost  găsit! ❌</h2>
            <Link href="/users">⬅ Înapoi la listă</Link>
        </main>);
    }

    const user: UserDetail = await response.json();
    return (<main style={{ padding: '40px', fontFamily: 'system-ui,sans-serif', maxWidth: '600px' }}>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
            <h1 style={{ marginTop: 0, color: '#0f172a' }}>{user.name}</h1>
            <p style={{ color: '#64748b' }}>@{user.username}</p>

            <hr style={{ borderColor: '#e2e8f0', margin: '20px 0' }} />
            <p><strong>✉️ Email:</strong> {user.email}</p>
            <p><strong>📞 Telefon:</strong> {user.phone}</p>
            <p><strong>🌐 Website:</strong> {user.website}</p>
            <p><strong>🏢 Companie:</strong> {user.company.name} (<em>"{user.company.catchPhrase}"</em>)</p>
            <p><strong>📍 Oraș:</strong> {user.address.city}</p>
            <p><strong>Adresa:</strong> {user.address.street}, {user.address.suite}, {user.address.zipcode}</p>
        </div>
        <div style={{ marginTop: '20px' }}>
            <Link
                href="/users"
                style={{
                    background: '#333',
                    color: '#fff',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    display: 'inline-block'
                }}
            >
                ⬅ Înapoi la lista de utilizatori
            </Link>
        </div>

    </main>)
}