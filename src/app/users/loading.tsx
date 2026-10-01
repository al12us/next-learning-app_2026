export default function UsersLoading() {
  const skeletons = Array(6).fill(0); // 6 carduri de profil

  return (
    <main className="app-container">
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <div style={{ height: '40px', width: '300px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '16px' }} className="skeleton-pulse" />
        <div style={{ height: '20px', width: '50%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} className="skeleton-pulse" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {skeletons.map((_, i) => (
          <div key={i} className="glass-card skeleton-pulse" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Avatar circular */}
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <div style={{ height: '18px', width: '70%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                <div style={{ height: '14px', width: '50%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
               <div style={{ height: '36px', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
               <div style={{ height: '36px', width: '100%', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px' }} />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .skeleton-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </main>
  );
}
