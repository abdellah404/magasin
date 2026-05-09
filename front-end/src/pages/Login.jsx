import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Login.css'

function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const res  = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (data.token) {
        localStorage.setItem('token',    data.token)
        localStorage.setItem('prenom',   data.prenom)
        localStorage.setItem('shopName', data.shopName)
        navigate('/credits')
      } else {
        setError(data.error || 'Email ou mot de passe incorrect')
      }
    } catch {
      setError('Impossible de contacter le serveur')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-wrap">
        <div className="auth-card">

          <div className="auth-logo">
            <div className="auth-logo-icon">🏪</div>
            <div className="auth-logo-name">Dukan</div>
            <div className="auth-logo-sub">Gestion Magasin Maroc</div>
          </div>

          <div className="auth-title">Bon retour !</div>
          <div className="auth-sub">Connectez-vous à votre espace magasin</div>

          {error && <div className="auth-error">{error}</div>}

          <div className="form-group mb-12">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="vous@magasin.ma"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="form-group mb-20">
            <label className="form-label">Mot de passe</label>
            <input className="form-input" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>

          <button className="btn btn-primary w-full" style={{ padding: '11px' }}
            onClick={handleLogin} disabled={loading}>
            {loading ? '⏳ Connexion...' : '🔐 Se connecter'}
          </button>

          <div className="auth-divider">ou</div>

          <div className="auth-link-text">
            Pas encore de compte ?{' '}
            <Link to="/register" className="auth-link">Créer un compte</Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login