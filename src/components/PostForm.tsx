'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState<'title' | 'content' | null>(null);
  const router = useRouter();

  const handleAIGenerate = async (type: 'title' | 'content') => {
    if (!content.trim() && type === 'title') {
      alert("Scrie câteva cuvinte în secțiunea Conținut pentru ca AI-ul să poată genera un titlu!");
      return;
    }
    
    setIsGenerating(type);
    
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: type === 'title' ? content : title || "Next.js", type })
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (type === 'title') setTitle(data.suggestion);
        if (type === 'content') setContent(data.suggestion);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Eroare la conectarea cu Asistentul AI.");
    } finally {
      setIsGenerating(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !content.trim()) return;

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, content }),
      });

      const data = await response.json();
      setMessage(data.message || 'Articolul a fost adăugat cu succes!');

      // Resetare câmpuri formular
      setTitle('');
      setAuthor('');
      setContent('');

      // Notificăm Next.js Server Components să re-randeze lista actualizată
      router.refresh();
    } catch (err) {
      console.error('Eroare la adăugarea articolului:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card-static animate-fade-in" style={{ padding: '28px', marginTop: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ➕ Adaugă Articol Nou <span style={{fontSize: '1rem'}}>✨ cu AI</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Trimite o cerere HTTP <code>POST</code> către <code>/api/posts</code>
          </p>
        </div>
        <span className="badge badge-emerald">Backend API</span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ margin: 0 }}>Titlul Articolului</label>
            <button 
              type="button" 
              onClick={() => handleAIGenerate('title')}
              disabled={isGenerating !== null}
              className="badge badge-purple" 
              style={{ cursor: 'pointer', background: isGenerating === 'title' ? 'rgba(168, 85, 247, 0.4)' : '' }}
            >
              {isGenerating === 'title' ? '⏳ Gândește...' : '✨ Sugerează Titlu AI'}
            </button>
          </div>
          <input
            className="form-input"
            type="text"
            placeholder="Ex: De ce Next.js 16 este atât de rapid..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isGenerating !== null}
          />
        </div>

        <div>
          <label className="form-label">Nume Autor</label>
          <input
            className="form-input"
            type="text"
            placeholder="Ex: Alex Developer"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            disabled={isGenerating !== null}
          />
        </div>

        <div>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ margin: 0 }}>Conținutul Articolului</label>
            <button 
              type="button" 
              onClick={() => handleAIGenerate('content')}
              disabled={isGenerating !== null}
              className="badge badge-indigo" 
              style={{ cursor: 'pointer', background: isGenerating === 'content' ? 'rgba(99, 102, 241, 0.4)' : '' }}
            >
              {isGenerating === 'content' ? '⏳ Gândește...' : '✨ Generează Extindere AI'}
            </button>
          </div>
          <textarea
            className="form-textarea"
            style={{ minHeight: '100px', resize: 'vertical' }}
            placeholder="Scrie câteva rânduri despre subiectul tău (ex: react, next, api, frontend)..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={isGenerating !== null}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || isGenerating !== null}
          className="btn btn-emerald"
          style={{ width: '100%', padding: '12px 20px', fontSize: '1rem', marginTop: '4px' }}
        >
          {isLoading ? '⏳ Se publică articolul...' : '🚀 Publică Articolul'}
        </button>
      </form>

      {/* Mesaj de confirmare */}
      {message && (
        <div
          className="animate-fade-in"
          style={{
            marginTop: '18px',
            padding: '14px 18px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '10px',
            color: '#6ee7b7',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>✅</span>
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}