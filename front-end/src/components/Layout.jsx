import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/Layout.css'

const titles = {
  '/credits':      'Crédits en cours',
  '/ventes':       'Ventes',
  '/produits':     'Produits & Stock',
  '/clients':      'Clients',
  '/fournisseurs': 'Fournisseurs',
  '/livraisons':   'Livraisons',
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

      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon"><i className="fas fa-store"></i></div>
          <div>
            <div className="logo-text">TrackSales</div>
            <div className="logo-sub">Gestion Magasin</div>
          </div>
        </div>

        <nav className="nav">

          <div className="nav-section">
            <div className="nav-label">Principal</div>
            <div className={isActive('/credits')} onClick={() => navigate('/credits')}>
              <span className="nav-icon"><i className="fas fa-credit-card"></i></span> Crédits
            </div>
            <div className={isActive('/ventes')} onClick={() => navigate('/ventes')}>
              <span className="nav-icon"><i className="fas fa-shopping-cart"></i></span> Ventes
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-label">Stock & Personnes</div>
            <div className={isActive('/produits')} onClick={() => navigate('/produits')}>
              <span className="nav-icon"><i className="fas fa-box"></i></span> Produits & Stock
            </div>
            <div className={isActive('/clients')} onClick={() => navigate('/clients')}>
              <span className="nav-icon"><i className="fas fa-users"></i></span> Clients
            </div>
            <div className={isActive('/fournisseurs')} onClick={() => navigate('/fournisseurs')}>
              <span className="nav-icon"><i className="fas fa-industry"></i></span> Fournisseurs
            </div>
            <div className={isActive('/livraisons')} onClick={() => navigate('/livraisons')}>
              <span className="nav-icon"><i className="fas fa-truck"></i></span> Livraisons
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-label">Gestion</div>
            <div className={isActive('/parametres')} onClick={() => navigate('/parametres')}>
              <span className="nav-icon"><i className="fas fa-cog"></i></span> Paramètres
            </div>
          </div>

        </nav>

        <div className="sidebar-footer">
          <div className="shop-name">{shopName}</div>
          <div className="shop-city"><i className="fas fa-map-marker-alt"></i> Maroc</div>
          <div className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Déconnexion
          </div>
        </div>

      </aside>

      {/* ===== MAIN ===== */}
      <main className="main">
        <header className="topbar">
          <div className="topbar-title">{titles[location.pathname] || 'Dukan'}</div>
          <div className="topbar-right">
            <div className="notif-btn" onClick={() => navigate('/credits')}>
              <i className="fas fa-bell"></i>
            </div>
            <span className="text-muted text-sm"><i className="fas fa-user"></i> {prenom}</span>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/ventes')}>
              <i className="fas fa-plus"></i> Nouvelle vente
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
