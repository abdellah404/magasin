function ModifierFournisseurPopup({ form, setForm, error, villes, fermerModal, enregistrerFourn }) {
  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title"><i className="fas fa-pen"></i> Modifier fournisseur</div>
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
          <button className="btn btn-primary" onClick={enregistrerFourn}><i className="fas fa-check"></i> Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

export default ModifierFournisseurPopup
