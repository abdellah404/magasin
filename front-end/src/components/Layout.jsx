import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/Layout.css'

const titles = {
  '/dashboard':    'Tableau de bord',
  '/ventes':       'Ventes',
  '/credits':      'Crédits en cours',
  '/produits':     'Produits & Stock',
  '/clients':      'Clients',
  '/fournisseurs': 'Fournisseurs',
  '/parametres':   'Paramètres',
}

function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const shopName = localStorage.getItem('shopName') || 'Mon Magasin'
  const prenom   = localStorage.getItem('prenom')   || ''

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('prenom')
    localStorage.removeItem('shopName')
    navigate('/login')
  }

  const isActive = (path) =>
    location.pathname === path ? 'nav-link active' : 'nav-link'

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">🏪</div>
          <div>
            <div className="logo-text">Dukan</div>
            <div className="logo-sub">Gestion Magasin</div>
          </div>
        </div>

        <nav className="nav">
          <div className="nav-section">
            <div className="nav-label">Principal</div>
            <div className={isActive('/dashboard')} onClick={() => navigate('/dashboard')}>
              <span className="nav-icon">📊</span> Tableau de bord
            </div>
            <div className={isActive('/ventes')} onClick={() => navigate('/ventes')}>
              <span className="nav-icon">🛍️</span> Ventes
            </div>
            <div className={isActive('/credits')} onClick={() => navigate('/credits')}>
              <span className="nav-icon">💳</span> Crédits
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-label">Stock & Personnes</div>
            <div className={isActive('/produits')} onClick={() => navigate('/produits')}>
              <span className="nav-icon">📦</span> Produits & Stock
            </div>
            <div className={isActive('/clients')} onClick={() => navigate('/clients')}>
              <span className="nav-icon">👥</span> Clients
            </div>
            <div className={isActive('/fournisseurs')} onClick={() => navigate('/fournisseurs')}>
              <span className="nav-icon">🏭</span> Fournisseurs
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-label">Gestion</div>
            <div className={isActive('/parametres')} onClick={() => navigate('/parametres')}>
              <span className="nav-icon">💾</span> Paramètres
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="shop-name">{shopName}</div>
          <div className="shop-city">Maroc 🇲🇦</div>
          <div className="logout-btn" onClick={handleLogout}>🚪 Déconnexion</div>
        </div>

      </aside>

      {/* MAIN */}
      <main className="main">
        <header className="topbar">
          <div className="topbar-title">{titles[location.pathname] || 'Dukan'}</div>
          <div className="topbar-right">
            <div className="notif-btn" onClick={() => navigate('/credits')}>🔔</div>
            <span className="text-muted text-sm">👋 {prenom}</span>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/ventes')}>
              ＋ Nouvelle vente
            </button>
          </div>
        </header>
        <div className="content">
          {children}
        </div>
      </main>

    </div>
  )
}

export default Layout