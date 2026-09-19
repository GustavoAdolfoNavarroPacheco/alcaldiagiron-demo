import { Route, Routes } from 'react-router-dom'
import Portada from './pages/Portada'
import CiudadanoLayout from './pages/ciudadano/CiudadanoLayout'
import CiudadanoInicio from './pages/ciudadano/CiudadanoInicio'
import RadicarPQRS from './pages/ciudadano/RadicarPQRS'
import ConsultarEstado from './pages/ciudadano/ConsultarEstado'
import AdminLayout from './pages/admin/AdminLayout'
import AdminResumen from './pages/admin/AdminResumen'
import CobroCoactivo from './pages/admin/CobroCoactivo'
import VentanillaUnica from './pages/admin/VentanillaUnica'
import SecretariasIndex from './pages/admin/SecretariasIndex'
import SecretariaDashboard from './pages/admin/SecretariaDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Portada />} />

      <Route path="/ciudadano" element={<CiudadanoLayout />}>
        <Route index element={<CiudadanoInicio />} />
        <Route path="radicar" element={<RadicarPQRS />} />
        <Route path="consultar" element={<ConsultarEstado />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminResumen />} />
        <Route path="cobro-coactivo" element={<CobroCoactivo />} />
        <Route path="ventanilla-unica" element={<VentanillaUnica />} />
        <Route path="secretarias" element={<SecretariasIndex />} />
        <Route path="secretarias/:slug" element={<SecretariaDashboard />} />
      </Route>
    </Routes>
  )
}
