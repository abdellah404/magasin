function Dashboard() {
  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <div className="page-h1">📊 Tableau de bord</div>
          <div className="page-desc">Bienvenue sur votre espace de gestion</div>
        </div>
      </div>
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text2)' }}>
          Dashboard en cours de construction
        </div>
        <div style={{ fontSize: '0.82rem', marginTop: '8px' }}>
          On le complétera après les autres pages
        </div>
      </div>
    </div>
  )
}

export default Dashboard