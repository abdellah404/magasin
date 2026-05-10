function ModifierClientPopup({ form, setForm, error, fermerModal, enregistrerClient }) {
  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title"><i className="fas fa-pen"></i> Modifier client</div>
          <button className="modal-close" onClick={fermerModal}><i className="fas fa-times"></i></button>
        </div>
        <div className="modal-body">

          {error && <div className="auth-error mb-14">{error}</div>}

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
            <label className="form-label">Téléphone</label>
            <input className="form-input" placeholder="+212 6XX XXX XXX"
              value={form.tel}
              onChange={e => setForm({ ...form, tel: e.target.value })} />
          </div>

          <div className="form-group mb-14">
            <label className="form-label">Ville / Quartier (optionnel)</label>
            <input className="form-input" placeholder="Ex: Hay Mohammadi..."
              value={form.adresse}
              onChange={e => setForm({ ...form, adresse: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Limite crédit (MAD)</label>
            <input className="form-input" type="number" min="0"
              value={form.limite_credit}
              onChange={e => setForm({ ...form, limite_credit: e.target.value })} />
          </div>

        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={fermerModal}>Annuler</button>
          <button className="btn btn-primary" onClick={enregistrerClient}><i className="fas fa-check"></i> Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

export default ModifierClientPopup
