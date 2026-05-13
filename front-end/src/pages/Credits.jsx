import { useState, useEffect } from 'react'

import '../styles/Clients.css'
import '../styles/Credits.css'

function Credits() {


  const [creditsClients, setCreditsClients] = useState([])
  const [dettesFourn,    setDettesFourn]    = useState([])
  const [loading,        setLoading]        = useState(true)

  const [modalClientOpen, setModalClientOpen] = useState(false)
  const [venteSelectee,   setVenteSelectee]   = useState(null)
  const [montantClient,   setMontantClient]   = useState(0)

  const [modalFournOpen, setModalFournOpen] = useState(false)
  const [livSelectee,    setLivSelectee]    = useState(null)
  const [montantFourn,   setMontantFourn]   = useState(0)

  const token = localStorage.getItem('token')

  useEffect(() => { fetchCredits() }, [])



  const fetchCredits = async () => {
    setLoading(true)
    try {
      const res  = await fetch('http://localhost:3000/credits', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setCreditsClients(data.creditsClients || [])
      setDettesFourn(data.dettesFourn       || [])
    } catch {}
    setLoading(false)
  }



  const jRestants = (date) => {
    if (!date) return null
    return Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
  }

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-MA') : '—'


  const ouvrirPayerClient = (vente) => {
    setVenteSelectee(vente)
    setMontantClient(parseFloat(vente.credit))
    setModalClientOpen(true)
  }

  const payerClient = async () => {
    if (!venteSelectee) return
    await fetch(`http://localhost:3000/credits/payer-client/${venteSelectee.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ montant: parseFloat(montantClient) })
    })
    setModalClientOpen(false)
    fetchCredits()
  }


  const ouvrirPayerFourn = (liv) => {
    setLivSelectee(liv)
    setMontantFourn(parseFloat(liv.credit))
    setModalFournOpen(true)
  }

  const payerFourn = async () => {
    if (!livSelectee) return
    await fetch(`http://localhost:3000/credits/payer-fourn/${livSelectee.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ montant: parseFloat(montantFourn) })
    })
    setModalFournOpen(false)
    fetchCredits()
  }


  const badgeStatut = (j) => {
    if (j === null) return <span className="badge badge-blue">En cours</span>
    if (j < 0)      return <span className="badge badge-red"><i className="fas fa-exclamation-circle"></i> Retard</span>
    if (j <= 7)     return <span className="badge badge-amber"><i className="fas fa-exclamation-triangle"></i> Urgent</span>
    return <span className="badge badge-blue">En cours</span>
  }


  const totalARecevoir = creditsClients.reduce((s, v) => s + parseFloat(v.credit || 0), 0)
  const totalAPayer    = dettesFourn.reduce((s, l)   => s + parseFloat(l.credit || 0), 0)
  const balance        = totalARecevoir - totalAPayer
  const totalSoldes    = creditsClients.filter(v => parseFloat(v.credit) === 0).length
                       + dettesFourn.filter(l => parseFloat(l.credit) === 0).length

  return (
    <div className="page-wrap">

      <div className="page-header">
        <div>
          <div className="page-h1"><i className="fas fa-credit-card"></i> Crédits en cours</div>
          <div className="page-desc">Créances clients et dettes fournisseurs</div>
        </div>
      </div>

      <div className="kpi-grid kpi-4">
        <div className="kpi" style={{ '--kpi-color': '#1a7a4a' }}>
          <div className="kpi-label">À recevoir</div>
          <div className="kpi-value">
            {totalARecevoir.toFixed(0)}
            <span style={{ fontSize: '1rem' }}> MAD</span>
          </div>
          <div className="kpi-sub">créances clients</div>
        </div>
        <div className="kpi" style={{ '--kpi-color': '#c0392b' }}>
          <div className="kpi-label">À payer</div>
          <div className="kpi-value">
            {totalAPayer.toFixed(0)}
            <span style={{ fontSize: '1rem' }}> MAD</span>
          </div>
          <div className="kpi-sub">dettes fournisseurs</div>
        </div>
        <div className="kpi" style={{ '--kpi-color': balance >= 0 ? '#1a7a4a' : '#c0392b' }}>
          <div className="kpi-label">Balance nette</div>
          <div className="kpi-value">
            {balance.toFixed(0)}
            <span style={{ fontSize: '1rem' }}> MAD</span>
          </div>
          <div className="kpi-sub">{balance >= 0 ? 'positif' : 'négatif'}</div>
        </div>
        <div className="kpi" style={{ '--kpi-color': '#1565c0' }}>
          <div className="kpi-label">Soldés total</div>
          <div className="kpi-value">{totalSoldes}</div>
          <div className="kpi-sub">crédits remboursés</div>
        </div>
      </div>

      <div className="card mb-14">
        <div className="card-header">
          <div className="card-title"><i className="fas fa-users"></i> Créances clients — Montants à recevoir</div>
        </div>
        <div className="card-body table-pad">
          {loading ? (
            <div className="empty">
              <div className="empty-icon"><i className="fas fa-spinner"></i></div>
              <div className="empty-text">Chargement...</div>
            </div>
          ) : creditsClients.length === 0 ? (
            <div className="empty" style={{ padding: '30px' }}>
              <div className="empty-icon"><i className="fas fa-check-circle"></i></div>
              <div className="empty-text">Aucun crédit client en cours</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Tél.</th>
                    <th>Date vente</th>
                    <th>Total</th>
                    <th>Payé</th>
                    <th>Reste à payer</th>
                    <th>Échéance</th>
                    <th>Statut</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {creditsClients.map(v => {
                    const j = jRestants(v.echeance)
                    return (
                      <tr key={v.id}>
                        <td>
                          <div className="td-main">
                            {v.client_nom || 'Client comptoir'}
                          </div>
                        </td>
                        <td className="text-muted text-sm">{v.client_tel || '—'}</td>
                        <td className="text-muted text-sm">{fmtDate(v.date_vente)}</td>
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
                          <span className="text-mono text-red fw-bold">
                            {parseFloat(v.credit).toFixed(2)} MAD
                          </span>
                        </td>
                        <td className="text-sm text-muted">
                          {fmtDate(v.echeance)}
                        </td>
                        <td>{badgeStatut(j)}</td>
                        <td>
                          <button className="btn btn-green btn-xs"
                            onClick={() => ouvrirPayerClient(v)}>
                            <i className="fas fa-credit-card"></i> Payer
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fas fa-industry"></i> Dettes fournisseurs — Montants à payer</div>
        </div>
        <div className="card-body table-pad">
          {loading ? (
            <div className="empty">
              <div className="empty-icon"><i className="fas fa-spinner"></i></div>
              <div className="empty-text">Chargement...</div>
            </div>
          ) : dettesFourn.length === 0 ? (
            <div className="empty" style={{ padding: '30px' }}>
              <div className="empty-icon"><i className="fas fa-check-circle"></i></div>
              <div className="empty-text">Aucune dette fournisseur</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Fournisseur</th>
                    <th>Produit reçu</th>
                    <th>Date livraison</th>
                    <th>Total</th>
                    <th>Payé</th>
                    <th>Reste à payer</th>
                    <th>Échéance</th>
                    <th>Statut</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dettesFourn.map(l => {
                    const j = jRestants(l.echeance)
                    return (
                      <tr key={l.id}>
                        <td>
                          <div className="td-main">{l.fournisseur_nom}</div>
                        </td>
                        <td className="text-sm">{l.produit_nom} ×{l.quantite}</td>
                        <td className="text-muted text-sm">{fmtDate(l.date_livraison)}</td>
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
                          <span className="text-mono text-red fw-bold">
                            {parseFloat(l.credit).toFixed(2)} MAD
                          </span>
                        </td>
                        <td className="text-sm text-muted">
                          {fmtDate(l.echeance)}
                        </td>
                        <td>{badgeStatut(j)}</td>
                        <td>
                          <button className="btn btn-secondary btn-xs"
                            onClick={() => ouvrirPayerFourn(l)}>
                            <i className="fas fa-credit-card"></i> Payer
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modalClientOpen && venteSelectee && (
        <div className="modal-overlay open">
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <div className="modal-title"><i className="fas fa-credit-card"></i> Paiement client</div>
              <button className="modal-close" onClick={() => setModalClientOpen(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">

              <div className="payer-info mb-14">
                <div className="fw-bold mb-8">
                  {venteSelectee.client_nom || 'Client comptoir'}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Restant dû :</span>
                  <span className="text-red fw-bold">
                    {parseFloat(venteSelectee.credit).toFixed(2)} MAD
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-4">
                  <span className="text-muted">Échéance :</span>
                  <span>{fmtDate(venteSelectee.echeance)}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Montant reçu (MAD)</label>
                <input className="form-input" type="number" min="0"
                  max={venteSelectee.credit}
                  value={montantClient}
                  onChange={e => setMontantClient(e.target.value)} />
              </div>

            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary"
                onClick={() => setModalClientOpen(false)}>Annuler</button>
              <button className="btn btn-green" onClick={payerClient}>
                <i className="fas fa-check"></i> Enregistrer paiement
              </button>
            </div>
          </div>
        </div>
      )}

      {modalFournOpen && livSelectee && (
        <div className="modal-overlay open">
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <div className="modal-title"><i className="fas fa-credit-card"></i> Paiement fournisseur</div>
              <button className="modal-close" onClick={() => setModalFournOpen(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">

              <div className="payer-info mb-14">
                <div className="fw-bold mb-8">{livSelectee.fournisseur_nom}</div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Restant dû :</span>
                  <span className="text-red fw-bold">
                    {parseFloat(livSelectee.credit).toFixed(2)} MAD
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-4">
                  <span className="text-muted">Échéance :</span>
                  <span>{fmtDate(livSelectee.echeance)}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Montant payé (MAD)</label>
                <input className="form-input" type="number" min="0"
                  max={livSelectee.credit}
                  value={montantFourn}
                  onChange={e => setMontantFourn(e.target.value)} />
              </div>

            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary"
                onClick={() => setModalFournOpen(false)}>Annuler</button>
              <button className="btn btn-green" onClick={payerFourn}>
                <i className="fas fa-check"></i> Enregistrer paiement
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  )
}

export default Credits
