function AjouterLivraisonPopup({
  form, setForm, error, fournisseurs, produits, total, credit,
  fermerModal, enregistrerLivraison
}) {
  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title"><i className="fas fa-truck"></i> Nouvelle livraison</div>
          <button className="modal-close" onClick={fermerModal}><i className="fas fa-times"></i></button>
        </div>
        <div className="modal-body">

          {error && <div className="auth-error mb-14">{error}</div>}

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
                value={credit > 0 ? `${credit.toFixed(2)} MAD` : 'Soldé'} />
            </div>
          </div>

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
          <button className="btn btn-primary" onClick={enregistrerLivraison}>
            <i className="fas fa-check"></i> Enregistrer la livraison
          </button>
        </div>
      </div>
    </div>
  )
}

export default AjouterLivraisonPopup
