function PayerClientPopup({
  venteSelectee, montantClient, setMontantClient, setModalClientOpen, payerClient, fmtDate
}) {
  return (
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
  )
}

export default PayerClientPopup
