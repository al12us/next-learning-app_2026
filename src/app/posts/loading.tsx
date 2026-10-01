export default function PostsLoading() {
  // Generăm un array cu 2 elemente pentru a mima cardurile de articole
  const skeletons = [1, 2];

  return (
    <main className="app-container">
      <div className="page-header" style={{ marginBottom: '32px' }}>
        {/* Placeholder pentru Titlu H1 */}
        <div style={{ height: '40px', width: '250px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '16px' }} className="skeleton-pulse" />
        {/* Placeholder pentru Subtitlu */}
        <div style={{ height: '20px', width: '60%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} className="skeleton-pulse" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        {skeletons.map((i) => (
          <div key={i} className="glass-card skeleton-pulse" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Image Placeholder */}
            <div style={{ width: '100%', height: '200px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
            
            {/* Title Placeholder */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ height: '24px', width: '40%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
              <div style={{ height: '24px', width: '60px', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px' }} />
            </div>

            {/* Author Placeholder */}
            <div style={{ height: '16px', width: '20%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />

            {/* Content Placeholder */}
            <div style={{ height: '14px', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
            <div style={{ height: '14px', width: '80%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
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
