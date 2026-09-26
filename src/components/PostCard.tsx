'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  author: string;
  content: string;
}

export default function PostCard({ post }: { post: Post }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [isLoading, setIsLoading] = useState(false);

  // ─── ȘTERGERE ───────────────────────────────────────────────
  const handleDelete = async () => {
    if (!confirm(`Sigur vrei să ștergi articolul "${post.title}"?`)) return;
    setIsLoading(true);

    try {
      await fetch('/api/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: post.id }),
      });

      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── ACTUALIZARE ────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsLoading(true);

    try {
      await fetch('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: post.id, title, content }),
      });

      setIsEditing(false);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="glass-card" style={{ padding: '24px' }}>
      {isEditing ? (
        // ── Modul Editare ──
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label className="form-label">Titlul Articolului</label>
            <input
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titlu articol..."
            />
          </div>

          <div>
            <label className="form-label">Conținut</label>
            <textarea
              className="form-textarea"
              style={{ minHeight: '90px', resize: 'vertical' }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Conținutul..."
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              onClick={handleUpdate}
              disabled={isLoading}
              className="btn btn-primary btn-sm"
            >
              {isLoading ? '⏳ Se salvează...' : '✅ Salvează Modificările'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setTitle(post.title);
                setContent(post.content);
              }}
              className="btn btn-ghost btn-sm"
            >
              ✖ Anulează
            </button>
          </div>
        </div>
      ) : (
        // ── Modul Vizualizare ──
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
              {title}
            </h2>
            <span className="badge badge-indigo" style={{ textTransform: 'none', flexShrink: 0 }}>
              ID #{post.id}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span>✍️ Autor: <strong style={{ color: '#c7d2fe' }}>{post.author}</strong></span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
            {content}
          </p>

          <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-warning btn-sm"
            >
              ✏️ Editează
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="btn btn-danger btn-sm"
            >
              {isLoading ? '⏳ Se șterge...' : '🗑️ Șterge'}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
