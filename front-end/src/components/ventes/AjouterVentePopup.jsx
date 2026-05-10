function AjouterVentePopup({
  form, setForm, error, clients, produits, produitSel, setProduitSel,
  quantite, setQuantite, ajouterLigne, lignes, supprimerLigne,
  total, creditRestant, fermerModal, enregistrerVente
}) {
  return (
    <div className="modal-overlay open">
      <div className="modal modal-lg">
        <div className="modal-header">
          <div className="modal-title"><i className="fas fa-shopping-cart"></i> Nouvelle vente</div>
          <button className="modal-close" onClick={fermerModal}><i className="fas fa-times"></i></button>
        </div>
        <div className="modal-body">

          {error && <div className="auth-error mb-14">{error}</div>}

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
                <button className="btn btn-primary" onClick={ajouterLigne}><i className="fas fa-plus"></i></button>
              </div>
            </div>
          </div>

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
                    onClick={() => supprimerLigne(l.produit_id)}><i className="fas fa-times"></i></span>
                </div>
              ))
            )}
          </div>

          <div className="total-box mb-14">
            <span className="fw-bold">Total</span>
            <span className="text-mono text-amber fw-bold">
              {total.toFixed(2)} MAD
            </span>
          </div>

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
            <i className="fas fa-check"></i> Enregistrer la vente
          </button>
        </div>
      </div>
    </div>
  )
}

export default AjouterVentePopup
