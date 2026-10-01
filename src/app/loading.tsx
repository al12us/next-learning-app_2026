export default function GlobalLoading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        {/* Un spinner CSS simplu creat cu div-uri */}
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(99, 102, 241, 0.2)',
          borderTop: '4px solid var(--accent-indigo)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <span style={{ color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.95rem' }}>
          Se încarcă pagina...
        </span>
      </div>
      
      {/* Injectăm keyframes direct aici pentru animația de spin */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
