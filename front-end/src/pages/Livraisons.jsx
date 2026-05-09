import { useState, useEffect } from 'react'
import '../styles/Clients.css'

function Livraisons() {

  // ===== DONNÉES =====
  const [livraisons,   setLivraisons]   = useState([])
  const [fournisseurs, setFournisseurs] = useState([])
  const [produits,     setProduits]     = useState([])
  const [loading,      setLoading]      = useState(true)
  const [modalOpen,    setModalOpen]    = useState(false)
  const [error,        setError]        = useState('')

  // ===== FORMULAIRE =====
  const [form, setForm] = useState({
    fournisseur_id: '',
    produit_id:     '',
    date_livraison: new Date().toISOString().split('T')[0],
    quantite:       1,
    prix_unitaire:  '',
    montant_paye:   0,
    echeance:       '',
  })

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchLivraisons()
    fetchFournisseurs()
    fetchProduits()
  }, [])

  // ===== FETCH =====

  const fetchLivraisons = async () => {
    setLoading(true)
    try {
      const res  = await fetch('http://localhost:3000/livraisons', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setLivraisons(data)
    } catch {
      setError('Erreur de connexion')
    }
    setLoading(false)
  }

  const fetchFournisseurs = async () => {
    try {
      const res  = await fetch('http://localhost:3000/fournisseurs', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFournisseurs(await res.json())
    } catch {}
  }

  const fetchProduits = async () => {
    try {
      const res  = await fetch('http://localhost:3000/produits', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProduits(await res.json())
    } catch {}
  }

  // ===== MODAL =====

  const ouvrirModal = () => {
    setForm({
      fournisseur_id: '',
      produit_id:     '',
      date_livraison: new Date().toISOString().split('T')[0],
      quantite:       1,
      prix_unitaire:  '',
      montant_paye:   0,
      echeance:       '',
    })
    setError('')
    setModalOpen(true)
  }

  const fermerModal = () => setModalOpen(false)

  // ===== CALCULS =====

  // Total de la livraison
  const total = (form.quantite * parseFloat(form.prix_unitaire || 0))

  // Crédit restant
  const credit = Math.max(0, total - parseFloat(form.montant_paye || 0))

  // ===== ENREGISTRER =====

  const enregistrerLivraison = async () => {

    // Vérifications
    if (!form.fournisseur_id) { setError('Choisissez un fournisseur'); return }
    if (!form.produit_id)     { setError('Choisissez un produit');     return }
    if (!form.prix_unitaire)  { setError('Entrez le prix unitaire');   return }
    if (credit > 0 && !form.echeance) {
      setError('Entrez une date d\'échéance pour le crédit')
      return
    }

    try {
      await fetch('http://localhost:3000/livraisons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      })
      fermerModal()
      fetchLivraisons()
      fetchProduits() // recharger le stock mis à jour
    } catch {
      setError('Erreur lors de l\'enregistrement')
    }
  }

  const supprimerLivraison = async (id) => {
    if (!window.confirm('Supprimer cette livraison ? Le stock sera réduit.')) return
    await fetch(`http://localhost:3000/livraisons/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchLivraisons()
    fetchProduits()
  }

  // ===== UTILITAIRE =====
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-MA') : '—'

  // ===== KPIs =====
  const totalLivraisons = livraisons.length
  const totalDettes     = livraisons.reduce((s, l) => s + parseFloat(l.credit       || 0), 0)
  const totalAchats     = livraisons.reduce((s, l) => s + parseFloat(l.total        || 0), 0)
  const livAvecDette    = livraisons.filter(l => parseFloat(l.credit) > 0).length

  return (
    <div className="page-wrap">

      {/* ===== HEADER ===== */}
      <div className="page-header">
        <div>
          <div className="page-h1">🚚 Livraisons</div>
          <div className="page-desc">Réceptions fournisseurs et gestion des dettes</div>
        </div>
        <button className="btn btn-primary" onClick={ouvrirModal}>
          ＋ Nouvelle livraison
        </button>
      </div>

      {/* ===== KPIs ===== */}
      <div className="kpi-grid kpi-4">
        <div className="kpi" style={{ '--kpi-color': '#1565c0' }}>
          <div className="kpi-label">Total livraisons</div>
          <div className="kpi-value">{totalLivraisons}</div>
          <div className="kpi-sub">réceptions</div>
        </div>
        <div className="kpi" style={{ '--kpi-color': '#b8730a' }}>
          <div className="kpi-label">Total achats</div>
          <div className="kpi-value">
            {totalAchats.toFixed(0)}
            <span style={{ fontSize: '1rem' }}> MAD</span>
          </div>
          <div className="kpi-sub">valeur reçue</div>
        </div>
        <div className="kpi" style={{ '--kpi-color': '#c0392b' }}>
          <div className="kpi-label">Dettes en cours</div>
          <div className="kpi-value">
            {totalDettes.toFixed(0)}
            <span style={{ fontSize: '1rem' }}> MAD</span>
          </div>
          <div className="kpi-sub">à payer aux fournisseurs</div>
        </div>
        <div className="kpi" style={{ '--kpi-color': '#b8730a' }}>
          <div className="kpi-label">Avec dette</div>
          <div className="kpi-value">{livAvecDette}</div>
          <div className="kpi-sub">livraisons impayées</div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Toutes les livraisons</div>
        </div>
        <div className="card-body table-pad">
          {loading ? (
            <div className="empty">
              <div className="empty-icon">⏳</div>
              <div className="empty-text">Chargement...</div>
            </div>
          ) : livraisons.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🚚</div>
              <div className="empty-text">Aucune livraison pour l'instant</div>
              <div className="empty-sub">Enregistrez votre première livraison</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Fournisseur</th>
                    <th>Produit reçu</th>
                    <th>Quantité</th>
                    <th>Total</th>
                    <th>Payé</th>
                    <th>Dette</th>
                    <th>Échéance</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {livraisons.map(l => (
                    <tr key={l.id}>
                      <td className="text-muted text-xs text-mono">#{l.id}</td>
                      <td className="text-sm text-muted">{fmtDate(l.date_livraison)}</td>
                      <td><div className="td-main">{l.fournisseur_nom}</div></td>
                      <td className="text-sm">{l.produit_nom} ({l.produit_unite})</td>
                      <td><strong>{l.quantite}</strong></td>
                      <td>
                        <span className="text-mono text-amber fw-bold">
                          {parseFloat(l.total).toFixed(2)} MAD
                        </span>
                      </td>
                      <td>
                        <span className="text-mono text-green">
                          {parseFloat(l.montant_paye).toFixed(2)} MAD
                        </span>
                      </td>
                      <td>
                        {parseFloat(l.credit) > 0
                          ? <span className="text-mono text-red fw-bold">
                              {parseFloat(l.credit).toFixed(2)} MAD
                            </span>
                          : <span className="text-muted">—</span>
                        }
                      </td>
                      <td className="text-sm text-muted">{fmtDate(l.echeance)}</td>
                      <td>
                        {parseFloat(l.credit) > 0
                          ? <span className="badge badge-amber">Dette</span>
                          : <span className="badge badge-green">Soldé</span>
                        }
                      </td>
                      <td>
                        <button className="btn btn-danger btn-xs"
                          onClick={() => supprimerLivraison(l.id)}>🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ===== MODAL NOUVELLE LIVRAISON ===== */}
      {modalOpen && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">📦 Nouvelle livraison</div>
              <button className="modal-close" onClick={fermerModal}>✕</button>
            </div>
            <div className="modal-body">

              {error && <div className="auth-error mb-14">{error}</div>}

              {/* ===== SECTION : Fournisseur + Date ===== */}
              <div className="form-grid form-grid-2 mb-14">
                <div className="form-group">
                  <label className="form-label">Fournisseur *</label>
                  <select className="form-select"
                    value={form.fournisseur_id}
                    onChange={e => setForm({ ...form, fournisseur_id: e.target.value })}>
                    <option value="">-- Choisir --</option>
                    {fournisseurs.map(f => (
                      <option key={f.id} value={f.id}>{f.nom}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date livraison *</label>
                  <input className="form-input" type="date"
                    value={form.date_livraison}
                    onChange={e => setForm({ ...form, date_livraison: e.target.value })} />
                </div>
              </div>

              {/* ===== SECTION : Produit ===== */}
              <div className="form-group mb-14">
                <label className="form-label">Produit livré *</label>
                <select className="form-select"
                  value={form.produit_id}
                  onChange={e => setForm({ ...form, produit_id: e.target.value })}>
                  <option value="">-- Choisir un produit --</option>
                  {produits.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nom} — stock actuel : {p.stock} {p.unite}
                    </option>
                  ))}
                </select>
              </div>

              {/* ===== SECTION : Quantité + Prix ===== */}
              <div className="form-grid form-grid-3 mb-14">
                <div className="form-group">
                  <label className="form-label">Quantité reçue *</label>
                  <input className="form-input" type="number" min="1"
                    value={form.quantite}
                    onChange={e => setForm({ ...form, quantite: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Prix unitaire (MAD) *</label>
                  <input className="form-input" type="number" min="0" placeholder="0.00"
                    value={form.prix_unitaire}
                    onChange={e => setForm({ ...form, prix_unitaire: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Total</label>
                  <input className="form-input" readOnly
                    style={{ fontWeight: 700, color: 'var(--amber)' }}
                    value={total > 0 ? `${total.toFixed(2)} MAD` : '—'} />
                </div>
              </div>

              {/* ===== SECTION : Paiement ===== */}
              <div className="form-grid form-grid-2 mb-14">
                <div className="form-group">
                  <label className="form-label">Payé maintenant (MAD)</label>
                  <input className="form-input" type="number" min="0"
                    value={form.montant_paye}
                    onChange={e => setForm({ ...form, montant_paye: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Dette restante</label>
                  <input className="form-input" readOnly
                    style={{
                      background:  credit > 0 ? 'var(--red-dim)'  : 'var(--green-dim)',
                      color:       credit > 0 ? 'var(--red)'      : 'var(--green)',
                      fontWeight:  700,
                    }}
                    value={credit > 0 ? `${credit.toFixed(2)} MAD` : 'Soldé ✅'} />
                </div>
              </div>

              {/* ===== SECTION : Échéance — seulement si dette ===== */}
              {credit > 0 && (
                <div className="form-group">
                  <label className="form-label">Échéance remboursement</label>
                  <input className="form-input" type="date"
                    value={form.echeance}
                    onChange={e => setForm({ ...form, echeance: e.target.value })} />
                </div>
              )}

            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={fermerModal}>Annuler</button>
              <button className="btn btn-primary"   onClick={enregistrerLivraison}>
                ✅ Enregistrer la livraison
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Livraisons