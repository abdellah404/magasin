import { useState, useEffect } from 'react'
import '../styles/Clients.css'
import '../styles/Ventes.css'

function Ventes() {

  // ===== DONNÉES =====
  const [ventes,   setVentes]   = useState([])
  const [clients,  setClients]  = useState([])
  const [produits, setProduits] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  // ===== FORMULAIRE NOUVELLE VENTE =====
  const [form, setForm] = useState({
    clientId:    '',
    dateVente:   new Date().toISOString().split('T')[0],
    mode:        'comptant',
    montantPaye: 0,
    echeance:    '',
  })

  // ===== PANIER =====
  const [lignes,     setLignes]     = useState([])
  const [produitSel, setProduitSel] = useState('')
  const [quantite,   setQuantite]   = useState(1)

  const token = localStorage.getItem('token')

  // Charger les données au démarrage
  useEffect(() => {
    fetchVentes()
    fetchClients()
    fetchProduits()
  }, [])

  // ===== FETCH =====

  const fetchVentes = async () => {
    setLoading(true)
    try {
      const res  = await fetch('http://localhost:3000/ventes', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setVentes(data)
    } catch {
      setError('Erreur de connexion')
    }
    setLoading(false)
  }

  const fetchClients = async () => {
    try {
      const res  = await fetch('http://localhost:3000/clients', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setClients(await res.json())
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
    // Réinitialiser tout le formulaire
    setForm({
      clientId:    '',
      dateVente:   new Date().toISOString().split('T')[0],
      mode:        'comptant',
      montantPaye: 0,
      echeance:    '',
    })
    setLignes([])
    setProduitSel('')
    setQuantite(1)
    setError('')
    setModalOpen(true)
  }

  const fermerModal = () => setModalOpen(false)

  // ===== PANIER =====

  const ajouterLigne = () => {
    if (!produitSel) return

    // Trouver le produit sélectionné
    const produit = produits.find(p => p.id === parseInt(produitSel))
    if (!produit) return

    // Vérifier si le produit est déjà dans le panier
    const dejaPresent = lignes.find(l => l.produit_id === produit.id)

    if (dejaPresent) {
      // Augmenter la quantité existante
      setLignes(lignes.map(l =>
        l.produit_id === produit.id
          ? { ...l, quantite: l.quantite + parseInt(quantite) }
          : l
      ))
    } else {
      // Ajouter une nouvelle ligne au panier
      setLignes([...lignes, {
        produit_id:    produit.id,
        produit_nom:   produit.nom,
        prix_unitaire: parseFloat(produit.prix_unitaire),
        quantite:      parseInt(quantite),
      }])
    }

    // Réinitialiser la sélection
    setProduitSel('')
    setQuantite(1)
  }

  const supprimerLigne = (produitId) => {
    setLignes(lignes.filter(l => l.produit_id !== produitId))
  }

  // ===== CALCULS =====

  // Total du panier
  const total = lignes.reduce((s, l) => s + (l.quantite * l.prix_unitaire), 0)

  // Crédit restant selon le mode de paiement
  const creditRestant = () => {
    if (form.mode === 'comptant') return 0               // tout payé
    if (form.mode === 'credit')   return total            // rien payé
    return Math.max(0, total - parseFloat(form.montantPaye || 0)) // partiel
  }

  // ===== ENREGISTRER =====

  const enregistrerVente = async () => {

    // Vérifications
    if (lignes.length === 0) {
      setError('Ajoutez au moins un produit')
      return
    }
    if (!form.dateVente) {
      setError('La date est obligatoire')
      return
    }
    if (form.mode !== 'comptant' && creditRestant() > 0 && !form.echeance) {
      setError('Entrez une date d\'échéance pour le crédit')
      return
    }

    try {
      await fetch('http://localhost:3000/ventes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          client_id:     form.clientId    || null,
          date_vente:    form.dateVente,
          mode_paiement: form.mode,
          montant_paye:  form.montantPaye,
          echeance:      form.echeance    || null,
          lignes,
        })
      })
      fermerModal()
      fetchVentes()
      fetchProduits() // recharger le stock mis à jour
    } catch {
      setError('Erreur lors de l\'enregistrement')
    }
  }

  const supprimerVente = async (id) => {
    if (!window.confirm('Supprimer cette vente ? Le stock sera restauré.')) return
    await fetch(`http://localhost:3000/ventes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchVentes()
    fetchProduits()
  }

  // ===== UTILITAIRE =====
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-MA') : '—'

  // ===== KPIs =====
  const totalCA       = ventes.reduce((s, v) => s + parseFloat(v.total        || 0), 0)
  const totalEncaisse = ventes.reduce((s, v) => s + parseFloat(v.montant_paye || 0), 0)
  const totalCredit   = ventes.reduce((s, v) => s + parseFloat(v.credit       || 0), 0)
  const nbVentes      = ventes.length

  return (
    <div className="page-wrap">

      {/* ===== HEADER ===== */}
      <div className="page-header">
        <div>
          <div className="page-h1">🛍️ Ventes</div>
          <div className="page-desc">Historique et enregistrement des ventes</div>
        </div>
        <button className="btn btn-primary" onClick={ouvrirModal}>
          ＋ Nouvelle vente
        </button>
      </div>

      {/* ===== KPIs ===== */}
      <div className="kpi-grid kpi-4">
        <div className="kpi" style={{ '--kpi-color': '#b8730a' }}>
          <div className="kpi-label">Chiffre d'affaires</div>
          <div className="kpi-value">
            {totalCA.toFixed(0)}
            <span style={{ fontSize: '1rem' }}> MAD</span>
          </div>
          <div className="kpi-sub">total ventes</div>
        </div>
        <div className="kpi" style={{ '--kpi-color': '#1a7a4a' }}>
          <div className="kpi-label">Encaissé</div>
          <div className="kpi-value">
            {totalEncaisse.toFixed(0)}
            <span style={{ fontSize: '1rem' }}> MAD</span>
          </div>
          <div className="kpi-sub">montant reçu</div>
        </div>
        <div className="kpi" style={{ '--kpi-color': '#c0392b' }}>
          <div className="kpi-label">Crédit en cours</div>
          <div className="kpi-value">
            {totalCredit.toFixed(0)}
            <span style={{ fontSize: '1rem' }}> MAD</span>
          </div>
          <div className="kpi-sub">à recevoir</div>
        </div>
        <div className="kpi" style={{ '--kpi-color': '#1565c0' }}>
          <div className="kpi-label">Transactions</div>
          <div className="kpi-value">{nbVentes}</div>
          <div className="kpi-sub">ventes</div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Toutes les ventes</div>
        </div>
        <div className="card-body table-pad">
          {loading ? (
            <div className="empty">
              <div className="empty-icon">⏳</div>
              <div className="empty-text">Chargement...</div>
            </div>
          ) : ventes.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🛍️</div>
              <div className="empty-text">Aucune vente pour l'instant</div>
              <div className="empty-sub">Cliquez sur + Nouvelle vente</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Produits</th>
                    <th>Total</th>
                    <th>Payé</th>
                    <th>Crédit</th>
                    <th>Échéance</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ventes.map(v => (
                    <tr key={v.id}>
                      <td className="text-muted text-xs text-mono">#{v.id}</td>
                      <td className="text-sm text-muted">{fmtDate(v.date_vente)}</td>
                      <td>
                        <div className="td-main">
                          {v.client_nom || 'Client comptoir'}
                        </div>
                      </td>
                      <td className="text-sm">
                        {v.lignes && v.lignes.map(l =>
                          `${l.produit_nom} ×${l.quantite}`
                        ).join(', ')}
                      </td>
                      <td>
                        <span className="text-mono text-amber fw-bold">
                          {parseFloat(v.total).toFixed(2)} MAD
                        </span>
                      </td>
                      <td>
                        <span className="text-mono text-green">
                          {parseFloat(v.montant_paye).toFixed(2)} MAD
                        </span>
                      </td>
                      <td>
                        {parseFloat(v.credit) > 0
                          ? <span className="text-mono text-red fw-bold">
                              {parseFloat(v.credit).toFixed(2)} MAD
                            </span>
                          : <span className="text-muted">—</span>
                        }
                      </td>
                      <td className="text-sm text-muted">
                        {fmtDate(v.echeance)}
                      </td>
                      <td>
                        {parseFloat(v.credit) > 0
                          ? <span className="badge badge-amber">Partiel</span>
                          : <span className="badge badge-green">Soldé</span>
                        }
                      </td>
                      <td>
                        <button className="btn btn-danger btn-xs"
                          onClick={() => supprimerVente(v.id)}>🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ===== MODAL NOUVELLE VENTE ===== */}
      {modalOpen && (
        <div className="modal-overlay open">
          <div className="modal modal-lg">
            <div className="modal-header">
              <div className="modal-title">🛍️ Nouvelle vente</div>
              <button className="modal-close" onClick={fermerModal}>✕</button>
            </div>
            <div className="modal-body">

              {error && <div className="auth-error mb-14">{error}</div>}

              {/* ===== SECTION : Client + Date ===== */}
              <div className="form-grid form-grid-2 mb-14">
                <div className="form-group">
                  <label className="form-label">Client</label>
                  <select className="form-select"
                    value={form.clientId}
                    onChange={e => setForm({ ...form, clientId: e.target.value })}>
                    <option value="">-- Client comptoir --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.prenom} {c.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date vente</label>
                  <input className="form-input" type="date"
                    value={form.dateVente}
                    onChange={e => setForm({ ...form, dateVente: e.target.value })} />
                </div>
              </div>

              {/* ===== SECTION : Ajouter un produit au panier ===== */}
              <div className="form-grid form-grid-3 mb-14">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Produit</label>
                  <select className="form-select"
                    value={produitSel}
                    onChange={e => setProduitSel(e.target.value)}>
                    <option value="">-- Choisir un produit --</option>
                    {produits.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nom} — {parseFloat(p.prix_unitaire).toFixed(2)} MAD (stock: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Quantité</label>
                  <div className="flex gap-8">
                    <input className="form-input" type="number" min="1"
                      value={quantite}
                      onChange={e => setQuantite(e.target.value)} />
                    <button className="btn btn-primary" onClick={ajouterLigne}>＋</button>
                  </div>
                </div>
              </div>

              {/* ===== SECTION : Liste du panier ===== */}
              <div className="mb-14">
                {lignes.length === 0 ? (
                  <div className="text-muted text-sm" style={{ padding: '8px 0' }}>
                    Aucun produit ajouté.
                  </div>
                ) : (
                  lignes.map(l => (
                    <div key={l.produit_id} className="vente-ligne">
                      <span className="prod-name">
                        {l.produit_nom} × {l.quantite}
                      </span>
                      <span className="prod-prix">
                        {(l.quantite * l.prix_unitaire).toFixed(2)} MAD
                      </span>
                      <span className="del-btn"
                        onClick={() => supprimerLigne(l.produit_id)}>✕</span>
                    </div>
                  ))
                )}
              </div>

              {/* ===== SECTION : Total ===== */}
              <div className="total-box mb-14">
                <span className="fw-bold">Total</span>
                <span className="text-mono text-amber fw-bold">
                  {total.toFixed(2)} MAD
                </span>
              </div>

              {/* ===== SECTION : Mode de paiement ===== */}
              <div className="form-group mb-14">
                <label className="form-label">Mode de paiement</label>
                <select className="form-select"
                  value={form.mode}
                  onChange={e => setForm({ ...form, mode: e.target.value })}>
                  <option value="comptant">Comptant (tout payé)</option>
                  <option value="partiel">Paiement partiel</option>
                  <option value="credit">Tout à crédit</option>
                </select>
              </div>

              {/* Montant payé — seulement si mode partiel */}
              {form.mode === 'partiel' && (
                <div className="form-grid form-grid-2 mb-14">
                  <div className="form-group">
                    <label className="form-label">Montant payé (MAD)</label>
                    <input className="form-input" type="number" min="0"
                      value={form.montantPaye}
                      onChange={e => setForm({ ...form, montantPaye: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Crédit restant</label>
                    <input className="form-input" readOnly
                      style={{ background: 'var(--red-dim)', color: 'var(--red)', fontWeight: 700 }}
                      value={`${creditRestant().toFixed(2)} MAD`} />
                  </div>
                </div>
              )}

              {/* Échéance — seulement si crédit ou partiel */}
              {(form.mode === 'credit' || form.mode === 'partiel') && (
                <div className="form-group">
                  <label className="form-label">Échéance crédit</label>
                  <input className="form-input" type="date"
                    value={form.echeance}
                    onChange={e => setForm({ ...form, echeance: e.target.value })} />
                </div>
              )}

            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={fermerModal}>Annuler</button>
              <button className="btn btn-primary" onClick={enregistrerVente}>
                ✅ Enregistrer la vente
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Ventes