import { useState, useEffect } from 'react'
import '../styles/Clients.css'

const unites = ['Sac', 'Bidon', 'Boîte', 'Kg', 'Litre', 'Pièce', 'Carton', 'Bouteille']

function Produits() {
  const [produits,     setProduits]     = useState([])
  const [fournisseurs, setFournisseurs] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [modalOpen,    setModalOpen]    = useState(false)
  const [editProduit,  setEditProduit]  = useState(null)
  const [error,        setError]        = useState('')
  const [form, setForm] = useState({
    nom: '', prix_unitaire: '', stock: 0,
    seuil_alerte: 0, unite: 'Sac',
    fournisseur_id: '', description: ''
  })

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchProduits()
    fetchFournisseurs()
  }, [])

  const fetchProduits = async () => {
    setLoading(true)
    try {
      const res  = await fetch('http://localhost:3000/produits', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setProduits(data)
    } catch {
      setError('Erreur de connexion au serveur')
    }
    setLoading(false)
  }

  const fetchFournisseurs = async () => {
    try {
      const res  = await fetch('http://localhost:3000/fournisseurs', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setFournisseurs(data)
    } catch {}
  }

  const ouvrirModal = (produit = null) => {
    setEditProduit(produit)
    setForm(produit ? {
      nom:            produit.nom,
      prix_unitaire:  produit.prix_unitaire,
      stock:          produit.stock,
      seuil_alerte:   produit.seuil_alerte,
      unite:          produit.unite,
      fournisseur_id: produit.fournisseur_id || '',
      description:    produit.description   || '',
    } : {
      nom: '', prix_unitaire: '', stock: 0,
      seuil_alerte: 0, unite: 'Sac',
      fournisseur_id: '', description: ''
    })
    setError('')
    setModalOpen(true)
  }

  const fermerModal = () => { setModalOpen(false); setEditProduit(null) }

  const enregistrerProduit = async () => {
    if (!form.nom || !form.prix_unitaire || !form.unite) {
      setError('Nom, prix et unité sont obligatoires')
      return
    }
    const url    = editProduit
      ? `http://localhost:3000/produits/${editProduit.id}`
      : 'http://localhost:3000/produits'
    const method = editProduit ? 'PUT' : 'POST'
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      })
      fermerModal()
      fetchProduits()
    } catch {
      setError('Erreur lors de l\'enregistrement')
    }
  }

  const supprimerProduit = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return
    await fetch(`http://localhost:3000/produits/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchProduits()
  }


  const totalProduits = produits.length
  const stockBas      = produits.filter(p => p.seuil_alerte > 0 && p.stock <= p.seuil_alerte).length
  const valeurStock   = produits.reduce((s, p) => s + (p.stock * parseFloat(p.prix_unitaire || 0)), 0)

  return (
    <div className="page-wrap">


      <div className="page-header">
        <div>
          <div className="page-h1"><i className="fas fa-box"></i> Produits & Stock</div>
          <div className="page-desc">Gérez votre inventaire</div>
        </div>
        <button className="btn btn-primary" onClick={() => ouvrirModal()}>
          <i className="fas fa-plus"></i> Nouveau produit
        </button>
      </div>


      <div className="kpi-grid kpi-3">
        <div className="kpi" style={{ '--kpi-color': '#1a7a4a' }}>
          <div className="kpi-label">Total produits</div>
          <div className="kpi-value">{totalProduits}</div>
          <div className="kpi-sub">articles en catalogue</div>
        </div>
        <div className="kpi" style={{ '--kpi-color': '#c0392b' }}>
          <div className="kpi-label">Stock bas</div>
          <div className="kpi-value">{stockBas}</div>
          <div className="kpi-sub">produits sous le seuil</div>
        </div>
        <div className="kpi" style={{ '--kpi-color': '#1565c0' }}>
          <div className="kpi-label">Valeur stock</div>
          <div className="kpi-value">
            {valeurStock.toFixed(0)}
            <span style={{ fontSize: '1rem' }}> MAD</span>
          </div>
          <div className="kpi-sub">valeur totale inventaire</div>
        </div>
      </div>


      {stockBas > 0 && (
        <div className="alert alert-amber mb-14">
          <div className="alert-icon"><i className="fas fa-exclamation-triangle"></i></div>
          <div>
            <div className="alert-title">{stockBas} produit(s) en stock bas</div>
            <div className="alert-text">Pensez à réapprovisionner ces articles</div>
          </div>
        </div>
      )}


      <div className="card">
        <div className="card-header">
          <div className="card-title">Liste des produits</div>
        </div>
        <div className="card-body table-pad">
          {loading ? (
            <div className="empty">
              <div className="empty-icon"><i className="fas fa-spinner"></i></div>
              <div className="empty-text">Chargement...</div>
            </div>
          ) : produits.length === 0 ? (
            <div className="empty">
              <div className="empty-icon"><i className="fas fa-box"></i></div>
              <div className="empty-text">Aucun produit pour l'instant</div>
              <div className="empty-sub">Ajoutez votre premier produit</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Prix unitaire</th>
                    <th>Stock</th>
                    <th>Unité</th>
                    <th>Fournisseur</th>
                    <th>État</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {produits.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className="td-main">{p.nom}</div>
                        {p.description && (
                          <div className="td-sub">{p.description}</div>
                        )}
                      </td>
                      <td>
                        <span className="text-mono text-amber">
                          {parseFloat(p.prix_unitaire).toFixed(2)} MAD
                        </span>
                      </td>
                      <td><strong>{p.stock}</strong></td>
                      <td className="text-muted text-sm">{p.unite}</td>
                      <td className="text-muted text-sm">
                        {p.fournisseur_nom || '—'}
                      </td>
                      <td>
                        {p.seuil_alerte > 0 && p.stock <= p.seuil_alerte
                          ? <span className="badge badge-red"><i className="fas fa-exclamation-triangle"></i> Stock bas</span>
                          : <span className="badge badge-green"><i className="fas fa-check"></i> OK</span>
                        }
                      </td>
                      <td>
                        <div className="flex gap-8">
                          <button className="btn btn-secondary btn-xs"
                            onClick={() => ouvrirModal(p)}><i className="fas fa-pen"></i></button>
                          <button className="btn btn-danger btn-xs"
                            onClick={() => supprimerProduit(p.id)}><i className="fas fa-trash"></i></button>
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
                {editProduit
                  ? <><i className="fas fa-pen"></i> Modifier produit</>
                  : <><i className="fas fa-box"></i> Nouveau produit</>
                }
              </div>
              <button className="modal-close" onClick={fermerModal}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">

              {error && <div className="auth-error mb-14">{error}</div>}

              <div className="form-group mb-14">
                <label className="form-label">Nom du produit *</label>
                <input className="form-input" placeholder="Ex : Farine 25kg"
                  value={form.nom}
                  onChange={e => setForm({ ...form, nom: e.target.value })} />
              </div>

              <div className="form-grid form-grid-3 mb-14">
                <div className="form-group">
                  <label className="form-label">Prix (MAD) *</label>
                  <input className="form-input" type="number" min="0" placeholder="0.00"
                    value={form.prix_unitaire}
                    onChange={e => setForm({ ...form, prix_unitaire: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input className="form-input" type="number" min="0" placeholder="0"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Seuil alerte</label>
                  <input className="form-input" type="number" min="0" placeholder="0"
                    value={form.seuil_alerte}
                    onChange={e => setForm({ ...form, seuil_alerte: e.target.value })} />
                </div>
              </div>

              <div className="form-grid form-grid-2 mb-14">
                <div className="form-group">
                  <label className="form-label">Unité *</label>
                  <select className="form-select" value={form.unite}
                    onChange={e => setForm({ ...form, unite: e.target.value })}>
                    {unites.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Fournisseur</label>
                  <select className="form-select" value={form.fournisseur_id}
                    onChange={e => setForm({ ...form, fournisseur_id: e.target.value })}>
                    <option value="">-- Aucun --</option>
                    {fournisseurs.map(f => (
                      <option key={f.id} value={f.id}>{f.nom}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description (optionnel)</label>
                <textarea className="form-textarea"
                  placeholder="Notes sur le produit..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={fermerModal}>Annuler</button>
              <button className="btn btn-primary" onClick={enregistrerProduit}>
                <i className="fas fa-check"></i> Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Produits
