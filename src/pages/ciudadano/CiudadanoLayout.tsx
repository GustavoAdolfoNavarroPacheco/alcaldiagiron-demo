import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import CiudadanoSidebar from '../../components/CiudadanoSidebar'
import AdminLoginModal from '../../components/AdminLoginModal'
import Escudo from '../../components/Escudo'
import { SECRETARIAS } from '../../data/secretarias'

const SECTION_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/ciudadano': { title: 'Inicio', subtitle: 'Ventanilla Única y Trámites' },
  '/ciudadano/radicar': { title: 'Radicación de PQRS', subtitle: 'Recepción oficial de solicitudes' },
  '/ciudadano/consultar': { title: 'Consulta de Estado', subtitle: 'Trazabilidad y seguimiento' },
}

export default function CiudadanoLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const location = useLocation()

  const currentSection = (() => {
    if (location.pathname.startsWith('/ciudadano/secretaria/')) {
      const slug = location.pathname.replace('/ciudadano/secretaria/', '')
      const found = SECRETARIAS.find((s) => s.slug === slug)
      if (found) {
        return { title: found.nombre, subtitle: 'Secretaría de Despacho' }
      }
    }
    return (
      SECTION_TITLES[location.pathname] || {
        title: 'Portal Ciudadano',
        subtitle: 'Ventanilla Única',
      }
    )
  })()

  return (
    <div className="flex min-h-screen bg-white">
      {/* Barra lateral izquierda corporativa */}
      <CiudadanoSidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Área de contenido principal */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Cabecera superior institucional corporativa (idéntica a AdminLayout) */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 sm:px-8 py-3.5 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            {/* Botón de navegación móvil */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 md:hidden transition-colors"
              aria-label="Abrir menú de navegación"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>

            {/* Escudo visible en móvil */}
            <div className="flex items-center gap-2 md:hidden">
              <Escudo className="h-7" />
              <span className="text-xs font-semibold text-slate-900">Alcaldía de Girón</span>
            </div>

            {/* Breadcrumb institucional en escritorio */}
            <div className="hidden md:flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium text-slate-400">Alcaldía de Girón</span>
                <span className="text-slate-300">/</span>
                <span className="font-medium text-slate-500">Portal Ciudadano</span>
                <span className="text-slate-300">/</span>
                <h1 className="text-sm font-semibold text-slate-900 tracking-tight">
                  {currentSection.title}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-medium text-slate-900">Atención al Ciudadano</p>
              <p className="text-[10px] text-slate-400">San Juan de Girón · Santander</p>
            </div>
            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-1.5 rounded-md bg-vinotinto px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-vinotinto-dark"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5m5 5H3"
                />
              </svg>
              Iniciar sesión
            </button>
          </div>
        </header>

        {/* Contenido dinámico de las vistas ciudadanas */}
        <main className="mx-auto w-full max-w-7xl flex-1 bg-white px-4 sm:px-8 py-7">
          <Outlet />
        </main>

        {/* Pie de página institucional minimalista */}
        <footer className="border-t border-slate-200 bg-white py-4 px-6 sm:px-8 text-xs text-slate-400">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <p>Alcaldía Municipal de San Juan de Girón · Ventanilla Única y Portal de Trámites</p>
            <p>Monitoreo Oficial según Ley 1755 de 2015 · Vigencia 2026</p>
          </div>
        </footer>
      </div>

      {showLoginModal && <AdminLoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  )
}

