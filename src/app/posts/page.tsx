import Link from 'next/link';
import PostForm from '@/components/PostForm';
import PostCard from '@/components/PostCard';

interface Post {
  id: number;
  title: string;
  author: string;
  content: string;
}

export default async function PostsPage() {
  // Citim din PROPRIUL nostru API de Backend
  const response = await fetch('http://localhost:3000/api/posts', {
    cache: 'no-store', // Date mereu proaspete (nu din cache static)
  });

  const posts: Post[] = await response.json();

  return (
    <main className="app-container animate-fade-in" style={{ maxWidth: '840px' }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-emerald">CRUD API & Server Component</span>
        </div>
        <h1 className="page-title">
          Blog & Articole 📝
        </h1>
        <p className="page-subtitle">
          Listă randată pe server prin apelarea rutei interne <code>/api/posts</code>. Modificările sunt reflectate instant prin <code>router.refresh()</code>.
        </p>
      </div>

      {/* Lista de Articole */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        {posts.length === 0 ? (
          <div className="glass-card-static" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📭</div>
            <p>Nu există niciun articol publicat încă. Folosește formularul de mai jos pentru a crea primul articol!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* Formularul de Adăugare Articol */}
      <PostForm />

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '24px', marginTop: '36px' }}>
        <Link href="/" className="btn btn-ghost">
          ⬅ Înapoi la Acasă
        </Link>
      </div>
    </main>
  );
}