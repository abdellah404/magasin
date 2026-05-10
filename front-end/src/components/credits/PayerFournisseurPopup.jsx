function PayerFournisseurPopup({
  livSelectee, montantFourn, setMontantFourn, setModalFournOpen, payerFourn, fmtDate
}) {
  return (
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
  )
}

export default PayerFournisseurPopup
