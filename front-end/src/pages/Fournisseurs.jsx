import { useState, useEffect } from 'react'
import '../styles/Clients.css'

const villes = [
  'Casablanca','Rabat','Marrakech','Fès','Tanger',
  'Agadir','Meknès','Oujda','Kenitra','Tétouan','Autre'
]

function Fournisseurs() {
  const [fournisseurs, setFournisseurs] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [modalOpen,    setModalOpen]    = useState(false)
  const [editFourn,    setEditFourn]    = useState(null)
  const [error,        setError]        = useState('')
  const [form, setForm] = useState({
    nom: '', ville: 'Casablanca', tel: '', email: '', notes: ''
  })

  const token = localStorage.getItem('token')

  useEffect(() => { fetchFournisseurs() }, [])

  const fetchFournisseurs = async () => {
    setLoading(true)
    try {
      const res  = await fetch('http://localhost:3000/fournisseurs', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setFournisseurs(data)
    } catch {
      setError('Erreur de connexion au serveur')
    }
    setLoading(false)
  }

  const ouvrirModal = (fourn = null) => {
    setEditFourn(fourn)
    setForm(fourn ? {
      nom:   fourn.nom,
      ville: fourn.ville || 'Casablanca',
      tel:   fourn.tel   || '',
      email: fourn.email || '',
      notes: fourn.notes || '',
    } : { nom: '', ville: 'Casablanca', tel: '', email: '', notes: '' })
    setError('')
    setModalOpen(true)
  }

  const fermerModal = () => { setModalOpen(false); setEditFourn(null) }

  const enregistrerFourn = async () => {
    if (!form.nom) {
      setError('Le nom est obligatoire')
      return
    }
    const url    = editFourn
      ? `http://localhost:3000/fournisseurs/${editFourn.id}`
      : 'http://localhost:3000/fournisseurs'
    const method = editFourn ? 'PUT' : 'POST'
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      })
      fermerModal()
      fetchFournisseurs()
    } catch {
      setError('Erreur lors de l\'enregistrement')
    }
  }

  const supprimerFourn = async (id) => {
    if (!window.confirm('Supprimer ce fournisseur ?')) return
    await fetch(`http://localhost:3000/fournisseurs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchFournisseurs()
  }


  const totalFourn = fournisseurs.length
  const totalDette = fournisseurs.reduce((s, f) => s + parseFloat(f.total_dette || 0), 0)
  const fournDette = fournisseurs.filter(f => parseFloat(f.total_dette) > 0).length

  return (
    <div className="page-wrap">


      <div className="page-header">
        <div>
          <div className="page-h1"><i className="fas fa-industry"></i> Fournisseurs</div>
          <div className="page-desc">Gérez vos partenaires</div>
        </div>
        <button className="btn btn-primary" onClick={() => ouvrirModal()}>
          <i className="fas fa-plus"></i> Nouveau fournisseur
        </button>
      </div>


      <div className="kpi-grid kpi-3">
        <div className="kpi" style={{ '--kpi-color': '#1a7a4a' }}>
          <div className="kpi-label">Total fournisseurs</div>
          <div className="kpi-value">{totalFourn}</div>
          <div className="kpi-sub">fournisseurs enregistrés</div>
        </div>
        <div className="kpi" style={{ '--kpi-color': '#c0392b' }}>
          <div className="kpi-label">Dettes en cours</div>
          <div className="kpi-value">
            {totalDette.toFixed(0)}
            <span style={{ fontSize: '1rem' }}> MAD</span>
          </div>
          <div className="kpi-sub">montant à payer</div>
        </div>
        <div className="kpi" style={{ '--kpi-color': '#b8730a' }}>
          <div className="kpi-label">Avec dette</div>
          <div className="kpi-value">{fournDette}</div>
          <div className="kpi-sub">fournisseurs impayés</div>
        </div>
      </div>


      <div className="card">
        <div className="card-header">
          <div className="card-title">Liste des fournisseurs</div>
        </div>
        <div className="card-body table-pad">
          {loading ? (
            <div className="empty">
              <div className="empty-icon"><i className="fas fa-spinner"></i></div>
              <div className="empty-text">Chargement...</div>
            </div>
          ) : fournisseurs.length === 0 ? (
            <div className="empty">
              <div className="empty-icon"><i className="fas fa-industry"></i></div>
              <div className="empty-text">Aucun fournisseur pour l'instant</div>
              <div className="empty-sub">Ajoutez votre premier fournisseur</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Fournisseur</th>
                    <th>Ville</th>
                    <th>Téléphone</th>
                    <th>Email</th>
                    <th>Dette</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fournisseurs.map(f => (
                    <tr key={f.id}>
                      <td><div className="td-main">{f.nom}</div></td>
                      <td className="text-muted text-sm">{f.ville || '—'}</td>
                      <td className="text-muted text-sm">{f.tel   || '—'}</td>
                      <td className="text-muted text-sm">{f.email || '—'}</td>
                      <td>
                        {parseFloat(f.total_dette) > 0
                          ? <span className="text-mono text-red fw-bold">
                              {parseFloat(f.total_dette).toFixed(2)} MAD
                            </span>
                          : <span className="text-muted">Soldé <i className="fas fa-check"></i></span>
                        }
                      </td>
                      <td>
                        <div className="flex gap-8">
                          <button className="btn btn-secondary btn-xs"
                            onClick={() => ouvrirModal(f)}><i className="fas fa-pen"></i></button>
                          <button className="btn btn-danger btn-xs"
                            onClick={() => supprimerFourn(f.id)}><i className="fas fa-trash"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>


      {modalOpen && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">
                {editFourn
                  ? <><i className="fas fa-pen"></i> Modifier fournisseur</>
                  : <><i className="fas fa-industry"></i> Nouveau fournisseur</>
                }
              </div>
              <button className="modal-close" onClick={fermerModal}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">

              {error && <div className="auth-error mb-14">{error}</div>}

              <div className="form-group mb-14">
                <label className="form-label">Nom *</label>
                <input className="form-input" placeholder="Ex : Société Atlas"
                  value={form.nom}
                  onChange={e => setForm({ ...form, nom: e.target.value })} />
              </div>

              <div className="form-grid form-grid-2 mb-14">
                <div className="form-group">
                  <label className="form-label">Ville</label>
                  <select className="form-select" value={form.ville}
                    onChange={e => setForm({ ...form, ville: e.target.value })}>
                    {villes.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input className="form-input" placeholder="+212 5XX XXX XXX"
                    value={form.tel}
                    onChange={e => setForm({ ...form, tel: e.target.value })} />
                </div>
              </div>

              <div className="form-group mb-14">
                <label className="form-label">Email</label>
                <input className="form-input" type="email"
                  placeholder="contact@fournisseur.ma"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Notes (optionnel)</label>
                <textarea className="form-textarea"
                  placeholder="Conditions de paiement, délais livraison..."
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>

            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={fermerModal}>Annuler</button>
              <button className="btn btn-primary" onClick={enregistrerFourn}>
                <i className="fas fa-check"></i> Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Fournisseurs
