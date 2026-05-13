import { useState , useEffect} from 'react'
import AjouterClientPopup from '../components/clients/AjouterClientPopup'
import ModifierClientPopup from '../components/clients/ModifierClientPopup'
import '../styles/Clients.css'

function Clients() {
  const [clients,    setClients]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [modalOpen,  setModalOpen]  = useState(false)
  const [editClient, setEditClient] = useState(null)
  const [error,      setError]      = useState('')
  const [form, setForm] = useState({
    prenom: '', nom: '', tel: '', adresse: '', limite_credit: 0
  })

  const token = localStorage.getItem('token')

  useEffect(() => { getClients() }, [])



  const getClients = async () => { 
    setLoading(true)
    try {
      const res  = await fetch('http://localhost:3000/clients', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setClients(data)
    } catch {
      setError('Erreur de connexion au serveur')
    }
    setLoading(false)
  }
  


  const ouvrirModal = (client = null) => {
    setEditClient(client)
    setForm(client ? {
      prenom:        client.prenom,
      nom:           client.nom,
      tel:           client.tel           || '',
      adresse:       client.adresse       ||   '',
      limite_credit: client.limite_credit || 0,
    } : { prenom: '', nom: '', tel: '', adresse: '', limite_credit: 0 })
    setError('')
    setModalOpen(true)
  }

  

  const fermerModal = () => { setModalOpen(false); setEditClient(null) }

  const enregistrerClient = async () => {
    if (!form.prenom || !form.nom) {
      setError('Prénom et nom sont obligatoires')
      return
    }
    const url    = editClient
      ? `http://localhost:3000/clients/${editClient.id}`
      : 'http://localhost:3000/clients'
    const method = editClient ? 'PUT' : 'POST'
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      })
      fermerModal()
      getClients()
    } catch {
      setError('Erreur lors de l\'enregistrement')
    }
  }

  const supprimerClient = async (id) => {
    if (!window.confirm('Supprimer ce client ?')) return
    await fetch(`http://localhost:3000/clients/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    getClients()
  }

  const totalClients  = clients.length
  const totalCredit   = clients.reduce((s, c) => s + parseFloat(c.total_credit || 0), 0)
  const clientsCredit = clients.filter(c => parseFloat(c.total_credit) > 0).length

  return (
    <div className="page-wrap">

      <div className="page-header">
        <div>
          <div className="page-h1"><i className="fas fa-users"></i> Clients</div>
          <div className="page-desc">Carnet de clients</div>
        </div>
        <button className="btn btn-primary" onClick={() => ouvrirModal()}>
          <i className="fas fa-plus"></i> Nouveau client
        </button>
      </div>

      <div className="kpi-grid kpi-3">
        <div className="kpi" style={{ '--kpi-color': '#1a7a4a' }}>
          <div className="kpi-label">Total clients</div>
          <div className="kpi-value">{totalClients}</div>
          <div className="kpi-sub">clients enregistrés</div>
        </div>
        <div className="kpi" style={{ '--kpi-color': '#c0392b' }}>
          <div className="kpi-label">Crédit en cours</div>
          <div className="kpi-value">
            {totalCredit.toFixed(2)}
            <span style={{ fontSize: '1rem' }}> MAD</span>
          </div>
          <div className="kpi-sub">montant à recevoir</div>
        </div>
        <div className="kpi" style={{ '--kpi-color': '#b8730a' }}>
          <div className="kpi-label">Clients à crédit</div>
          <div className="kpi-value">{clientsCredit}</div>
          <div className="kpi-sub">avec solde impayé</div>
        </div>
      </div>






      <div className="card">
        <div className="card-header">
          <div className="card-title">Liste des clients</div>
        </div>
        <div className="card-body table-pad">
          {loading ? (
            <div className="empty">
              <div className="empty-icon"><i className="fas fa-spinner"></i></div>
              <div className="empty-text">Chargement...</div>
            </div>
          ) : clients.length === 0 ? (
            <div className="empty">
              <div className="empty-icon"><i className="fas fa-users"></i></div>
              <div className="empty-text">Aucun client pour l'instant</div>
              <div className="empty-sub">Ajoutez votre premier client</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Téléphone</th>
                    <th>Ville</th>
                    <th>Crédit actuel</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(c => (
                    <tr key={c.id}>
                      <td><div className="td-main">{c.prenom} {c.nom}</div></td>
                      <td className="text-muted text-sm">{c.tel     || '—'}</td>
                      <td className="text-muted text-sm">{c.adresse || '—'}</td>
                      <td>
                        {parseFloat(c.total_credit) > 0
                          ? <span className="text-mono text-red fw-bold">
                              {parseFloat(c.total_credit).toFixed(2)} MAD
                            </span>
                          : <span className="text-muted">Soldé <i className="fas fa-check"></i></span>
                        }
                      </td>
                      <td>
                        <div className="flex gap-8">
                          <button className="btn btn-secondary btn-xs"
                            onClick={() => ouvrirModal(c)}><i className="fas fa-pen"></i></button>
                          <button className="btn btn-danger btn-xs"
                            onClick={() => supprimerClient(c.id)}><i className="fas fa-trash"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>


      
      {modalOpen && !editClient && (
        <AjouterClientPopup
          form={form}
          setForm={setForm}
          error={error}
          fermerModal={fermerModal}
          enregistrerClient={enregistrerClient}
        />
      )}
      

      
      {modalOpen && editClient && (
        <ModifierClientPopup
          form={form}
          setForm={setForm}
          error={error}
          fermerModal={fermerModal}
          enregistrerClient={enregistrerClient}
        />
      )}    
      

    </div>
  )
}

export default Clients
