function AjouterProduitPopup({
  form, setForm, error, unites, fournisseurs, fermerModal, enregistrerProduit
}) {
  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title"><i className="fas fa-box"></i> Nouveau produit</div>
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
          <button className="btn btn-primary" onClick={enregistrerProduit}><i className="fas fa-check"></i> Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

export default AjouterProduitPopup
