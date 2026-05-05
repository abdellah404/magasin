import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout    from './components/Layout'
import Login     from './pages/Login'
import Register  from './pages/Register'
import Dashboard from './pages/Dashboard'
import Clients   from './pages/Clients'

function App() {
  const token = localStorage.getItem('token')

  return (
    <BrowserRouter>
      <Routes>

        {/* Pages publiques */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages protégées */}
        <Route path="/dashboard" element={
          token ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/clients" element={
          token ? <Layout><Clients /></Layout> : <Navigate to="/login" />
        } />

        {/* Redirection */}
        <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App