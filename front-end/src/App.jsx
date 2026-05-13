import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout       from './components/Layout'
import Login        from './pages/Login'
import Register     from './pages/Register'
import Clients      from './pages/Clients'
import Fournisseurs from './pages/Fournisseurs'
import Produits     from './pages/Produits'
import Ventes       from './pages/Ventes'
import Livraisons   from './pages/Livraisons'
import Credits      from './pages/Credits'
import Parametres   from './pages/Parametres'

function App() {
  const token = localStorage.getItem('token')

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/clients" element={
          token ? <Layout><Clients /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/fournisseurs" element={
          token ? <Layout><Fournisseurs /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/produits" element={
          token ? <Layout><Produits /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/ventes" element={
          token ? <Layout><Ventes /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/livraisons" element={
          token ? <Layout><Livraisons /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/credits" element={
          token ? <Layout><Credits /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/parametres" element={
          token ? <Layout><Parametres /></Layout> : <Navigate to="/login" />
        } />


        <Route path="*" element={<Navigate to={token ? '/credits' : '/login'} />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App