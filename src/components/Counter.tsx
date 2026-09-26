'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="glass-card-static" style={{ padding: '24px', maxWidth: '420px', margin: '24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
          Exemplu Client Component:
        </span>
        <span className="badge badge-purple">
          State Interactiv
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          minWidth: '60px',
          textAlign: 'center',
          color: count > 0 ? '#34d399' : count < 0 ? '#f87171' : 'var(--text-primary)',
          background: 'rgba(15, 23, 42, 0.8)',
          padding: '8px 16px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)'
        }}>
          {count}
        </div>
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Aprecieri / Likes 👍</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Starea este gestionată local în React Client</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          className="btn btn-emerald btn-sm"
          onClick={() => setCount(count + 1)}
        >
          👍 Adaugă Like
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => setCount(count - 1)}
        >
          👎 Scade
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setCount(0)}
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}