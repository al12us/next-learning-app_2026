'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/me')
      .then(res => {
        if (!res.ok) throw new Error('Nu ești autentificat');
        return res.json();
      })
      .then(data => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      alert("Imaginea este prea mare! Te rugăm să alegi o imagine sub 2.5MB.");
      return;
    }

    setUploadingAvatar(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Avatar = event.target?.result as string;
      
      try {
        const res = await fetch('/api/me/avatar', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatar: base64Avatar })
        });
        
        const data = await res.json();
        
        if (res.ok) {
          setUser(prev => prev ? { ...prev, avatar: data.avatar } : prev);
        } else {
          alert(data.error || "Eroare la actualizarea imaginii");
        }
      } catch (err) {
        alert("Eroare de rețea.");
      } finally {
        setUploadingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <main className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ color: 'var(--text-secondary)' }}>⏳ Se încarcă profilul...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="app-container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px', maxWidth: '400px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
          <h1 className="page-title" style={{ fontSize: '1.6rem', marginBottom: '12px' }}>Acces restricționat</h1>
          <p className="page-subtitle" style={{ fontSize: '0.9rem', marginBottom: '24px' }}>
            Trebuie să fii autentificat pentru a vizualiza această pagină.
          </p>
          <Link href="/login" className="btn btn-primary" style={{ padding: '10px 20px' }}>
            Mergi la Log In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="app-container animate-fade-in" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <h1 className="page-title">Profilul <span className="gradient-text">Meu</span></h1>
        <p className="page-subtitle">Gestionează datele contului tău</p>
      </div>

      <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Avatar & Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '24px' }}>
          
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleAvatarChange} 
          />

          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: user.avatar ? `url(${user.avatar}) center/cover` : 'var(--gradient-brand)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              fontSize: user.avatar ? '0' : '2rem', color: '#fff', fontWeight: 'bold',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            title="Apasă pentru a schimba poza de profil"
          >
            {!user.avatar && user.name.charAt(0).toUpperCase()}
            
            {/* Suprapunere la hover sau loading */}
            <div style={{
              position: 'absolute', inset: 0,
              background: uploadingAvatar ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              opacity: uploadingAvatar ? 1 : 0,
              transition: 'opacity 0.2s',
              fontSize: '1rem'
            }}
            onMouseOver={(e) => !uploadingAvatar && (e.currentTarget.style.opacity = '1')}
            onMouseOut={(e) => !uploadingAvatar && (e.currentTarget.style.opacity = '0')}
            >
              {uploadingAvatar ? '⏳' : '📷'}
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>{user.name}</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{user.email}</span>
              <span className={`badge ${user.role === 'ADMIN' ? 'badge-rose' : 'badge-indigo'}`} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Date Cont */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID Utilizator</label>
            <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>#{user.id.toString().padStart(4, '0')}</div>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status Cont</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.1rem', fontWeight: '500', color: 'var(--accent-emerald)' }}>
              🟢 Activ
            </div>
          </div>
        </div>

        {/* Secțiune Actiuni */}
        <div style={{ marginTop: '16px', background: 'rgba(15, 23, 42, 0.5)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-bright)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: '600' }}>Securitate</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontWeight: '500' }}>Parolă</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Ultima modificare: la creare</div>
            </div>
            <Link href="/forgot-password" className="btn btn-secondary btn-sm" style={{ padding: '8px 16px' }}>
              Schimbă Parola
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
