import { useNavigate } from 'react-router-dom'
import '../styles/Home.css'

function Home() {

  // On récupère les infos sauvegardées au moment du login
  const prenom   = localStorage.getItem('prenom')
  const shopName = localStorage.getItem('shopName')

  const navigate = useNavigate()

  const handleLogout = () => {
    // On supprime tout ce qui est sauvegardé
    localStorage.removeItem('token')
    localStorage.removeItem('prenom')
    localStorage.removeItem('shopName')

    // On redirige vers login
    navigate('/login')
  }

  return (
    <div className="home-page">

      {/* Barre du haut */}
      <div className="home-navbar">
        <div className="home-navbar-left">
          <span className="home-logo">🏪 Dukan</span>
          <span className="home-shopname">{shopName}</span>
        </div>
        <div className="home-navbar-right">
          <span className="home-welcome">Bonjour, {prenom} 👋</span>
          <button className="home-logout-btn" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="home-content">
        <h2>Tableau de bord</h2>
        <p>Bienvenue sur votre espace de gestion 🎉</p>

        {/* Les cartes du dashboard — on les complétera plus tard */}
        <div className="home-cards">
          <div className="home-card">
            <span className="card-icon">👥</span>
            <span className="card-label">Clients</span>
          </div>
          <div className="home-card">
            <span className="card-icon">📦</span>
            <span className="card-label">Produits</span>
          </div>
          <div className="home-card">
            <span className="card-icon">🧾</span>
            <span className="card-label">Ventes</span>
          </div>
          <div className="home-card">
            <span className="card-icon">🚚</span>
            <span className="card-label">Livraisons</span>
          </div>
          <div className="home-card">
            <span className="card-icon">🏭</span>
            <span className="card-label">Fournisseurs</span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Home