import Link from 'next/link';

interface User {
    id: number;
    name: string;
    email: string;
    company: {
        name: string;
    };

}
export default async function UsersPage() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const users: User[] = await response.json();
    return (<main style={{ padding: '40px', fontFamily: 'system-ui,sans-serif' }}>
        <h1>Lista Utlizatori (Data Fetching pe Server) 👥</h1>
        <p>Aceste date au fost descărcate și randate direct de serverul Next.js: </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '16px', margin: '20px 0' }}>
            {users.map((user) => (
                <div key={user.id} style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#0f172a' }}>{user.name}</h3>
                    <p style={{ margin: '0 0 4px 0', color: '#64748b' }}>✉️ {user.email}</p>
                    <p style={{ margin: '0', color: '#64748b', fontSize: '0.9rem' }}>🏢 {user.company.name}</p>
                    <Link 
                        href={`/users/${user.id}`} 
                        style={{ display: 'inline-block', marginTop: '12px', color: '#0070f3', textDecoration: 'none', fontWeight: '600' }}
                    >
                        Vezi detalii complete ➔
                    </Link>
                </div>))
            }

        </div>
        <Link href="/" style={{ background: '#333', color: '#fff', padding: '10px 16px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>
            ⬅ Înapoi Acasă
        </Link>
    </main>);
}