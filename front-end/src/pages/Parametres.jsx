import { useState, useEffect } from 'react'
import '../styles/Clients.css'

const villes = [
  'Casablanca','Rabat','Marrakech','Fès','Tanger',
  'Agadir','Meknès','Oujda','Kenitra','Tétouan','Autre'
]

function Parametres() {


  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')
  const [error,   setError]   = useState('')


  const [form, setForm] = useState({
    prenom:    '',
    nom:       '',
    shop_name: '',
    city:      'Casablanca',
  })


  const [formPwd, setFormPwd] = useState({
    ancien_password:  '',
    nouveau_password: '',
  })

  const token = localStorage.getItem('token')

  useEffect(() => { fetchParametres() }, [])



  const fetchParametres = async () => {
    setLoading(true)
    try {
      const res  = await fetch('http://localhost:3000/parametres', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setForm({
        prenom:    data.prenom    || '',
        nom:       data.nom       || '',
        shop_name: data.shop_name || '',
        city:      data.city      || 'Casablanca',
      })
    } catch {}
    setLoading(false)
  }



  const enregistrerInfos = async () => {
    setError(''); setSuccess('')
    if (!form.prenom || !form.nom || !form.shop_name) {
      setError('Prénom, nom et nom du magasin sont obligatoires')
      return
    }
    try {
      const res  = await fetch('http://localhost:3000/parametres', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify(form)
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setSuccess('Informations mises à jour')

        localStorage.setItem('prenom',   form.prenom)
        localStorage.setItem('shopName', form.shop_name)
      }
    } catch {
      setError('Erreur de connexion')
    }
  }



  const changerMotDePasse = async () => {
    setError(''); setSuccess('')

    if (!formPwd.ancien_password || !formPwd.nouveau_password) {
      setError('Remplissez les deux champs mot de passe')
      return
    }
    if (formPwd.nouveau_password.length < 6) {
      setError('Le nouveau mot de passe doit avoir au moins 6 caractères')
      return
    }

    try {
      const res  = await fetch('http://localhost:3000/parametres', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({
          ...form,
          ancien_password:  formPwd.ancien_password,
          nouveau_password: formPwd.nouveau_password,
        })
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setSuccess('Mot de passe changé')
        setFormPwd({ ancien_password: '', nouveau_password: '' })
      }
    } catch {
      setError('Erreur de connexion')
    }
  }

  if (loading) return (
    <div className="empty" style={{ marginTop: 60 }}>
      <div className="empty-icon"><i className="fas fa-spinner"></i></div>
      <div className="empty-text">Chargement...</div>
    </div>
  )

  return (
    <div className="page-wrap">


      <div className="page-header">
        <div>
          <div className="page-h1"><i className="fas fa-cog"></i> Paramètres</div>
          <div className="page-desc">Gérez les informations de votre compte</div>
        </div>
      </div>


      {error   && <div className="auth-error mb-14">{error}</div>}
      {success && <div className="auth-success mb-14">{success}</div>}


      <div className="card mb-14">
        <div className="card-header">
          <div className="card-title"><i className="fas fa-store"></i> Informations du magasin</div>
        </div>
        <div className="card-body">


          <div className="form-grid form-grid-2 mb-14">
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input className="form-input" placeholder="Ahmed"
                value={form.prenom}
                onChange={e => setForm({ ...form, prenom: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Nom</label>
              <input className="form-input" placeholder="Benali"
                value={form.nom}
                onChange={e => setForm({ ...form, nom: e.target.value })} />
            </div>
          </div>


          <div className="form-group mb-14">
            <label className="form-label">Nom du magasin</label>
            <input className="form-input" placeholder="Ex : Épicerie Al Amal"
              value={form.shop_name}
              onChange={e => setForm({ ...form, shop_name: e.target.value })} />
          </div>


          <div className="form-group mb-14">
            <label className="form-label">Ville</label>
            <select className="form-select" value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })}>
              {villes.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>

          <button className="btn btn-primary" onClick={enregistrerInfos}>
            <i className="fas fa-save"></i> Enregistrer les informations
          </button>

        </div>
      </div>


      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fas fa-lock"></i> Changer le mot de passe</div>
        </div>
        <div className="card-body">

          <div className="form-group mb-14">
            <label className="form-label">Ancien mot de passe</label>
            <input className="form-input" type="password" placeholder="••••••••"
              value={formPwd.ancien_password}
              onChange={e => setFormPwd({ ...formPwd, ancien_password: e.target.value })} />
          </div>

          <div className="form-group mb-14">
            <label className="form-label">Nouveau mot de passe</label>
            <input className="form-input" type="password" placeholder="Min. 6 caractères"
              value={formPwd.nouveau_password}
              onChange={e => setFormPwd({ ...formPwd, nouveau_password: e.target.value })} />
          </div>

          <button className="btn btn-primary" onClick={changerMotDePasse}>
            <i className="fas fa-lock"></i> Changer le mot de passe
          </button>

        </div>
      </div>

    </div>
  )
}

export default Parametres
