import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Login.css'

const villes = [
  'Casablanca','Rabat','Marrakech','Fès','Tanger',
  'Agadir','Meknès','Oujda','Kenitra','Tétouan','Autre'
]

function Register() {
  const [prenom,   setPrenom]   = useState('')
  const [nom,      setNom]      = useState('')
  const [shopName, setShopName] = useState('')
  const [city,     setCity]     = useState('Casablanca')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    setError(''); setSuccess('')
    if (!prenom || !nom || !shopName || !email || !password) {
      setError('Veuillez remplir tous les champs obligatoires.')
      return
    }
    setLoading(true)
    try {
      const res  = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom, nom, shopName, city, email, password })
      })
      const data = await res.json()
      if (data.message) {
        setSuccess('Compte créé ! Redirection...')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError(data.error || 'Une erreur est survenue')
      }
    } catch {
      setError('Impossible de contacter le serveur')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-wrap" style={{ maxWidth: '460px' }}>
        <div className="auth-card">

          <div className="auth-logo">
            <div className="auth-logo-icon"><i className="fas fa-store"></i></div>
            <div className="auth-logo-name">Dukan</div>
            <div className="auth-logo-sub">Créer votre espace</div>
          </div>

          <div className="auth-title">Créer un compte</div>
          <div className="auth-sub">Commencez à gérer votre magasin gratuitement</div>

          {error   && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <div className="form-grid form-grid-2 mb-12">
            <div className="form-group">
              <label className="form-label">Prénom <span className="required">*</span></label>
              <input className="form-input" placeholder="Ahmed"
                value={prenom} onChange={e => setPrenom(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Nom <span className="required">*</span></label>
              <input className="form-input" placeholder="Benali"
                value={nom} onChange={e => setNom(e.target.value)} />
            </div>
          </div>

          <div className="form-group mb-12">
            <label className="form-label">Nom du magasin <span className="required">*</span></label>
            <input className="form-input" placeholder="Ex : Épicerie Al Amal"
              value={shopName} onChange={e => setShopName(e.target.value)} />
          </div>

          <div className="form-group mb-12">
            <label className="form-label">Ville <span className="required">*</span></label>
            <select className="form-select" value={city} onChange={e => setCity(e.target.value)}>
              {villes.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>

          <div className="form-group mb-12">
            <label className="form-label">Email <span className="required">*</span></label>
            <input className="form-input" type="email" placeholder="vous@magasin.ma"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="form-group mb-20">
            <label className="form-label">Mot de passe <span className="required">*</span></label>
            <input className="form-input" type="password" placeholder="Min. 6 caractères"
              value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <button className="btn btn-primary w-full" style={{ padding: '11px' }}
            onClick={handleRegister} disabled={loading}>
            {loading
              ? <><i className="fas fa-spinner"></i> Création...</>
              : <><i className="fas fa-check"></i> Créer mon compte</>
            }
          </button>

          <div className="auth-divider">ou</div>

          <div className="auth-link-text">
            Déjà un compte ?{' '}
            <Link to="/login" className="auth-link">Se connecter</Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Register
