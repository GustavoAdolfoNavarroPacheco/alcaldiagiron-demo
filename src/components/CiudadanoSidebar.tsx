import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import Escudo from './Escudo'
import { SECRETARIAS } from '../data/secretarias'

interface CiudadanoSidebarProps {
  isMobileOpen: boolean
  onCloseMobile: () => void
}

const mainLinks = [
  {
    to: '/ciudadano',
    label: 'Inicio del Portal',
    end: true,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: '/ciudadano/radicar',
    label: 'Radicar PQRS',
    end: false,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    to: '/ciudadano/consultar',
    label: 'Consultar Estado',
    end: false,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
]

export default function CiudadanoSidebar({ isMobileOpen, onCloseMobile }: CiudadanoSidebarProps) {
  const location = useLocation()
  const esRutaSecretaria = location.pathname.startsWith('/ciudadano/secretaria')
  const [secretariasAbiertas, setSecretariasAbiertas] = useState(true)

  useEffect(() => {
    if (esRutaSecretaria) {
      setSecretariasAbiertas(true)
    }
  }, [esRutaSecretaria])

  return (
    <>
      {/* Backdrop overlay para móvil */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Barra Lateral Institucional Limpia */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-slate-800 bg-[#141212] text-slate-300 transition-transform duration-300 md:static md:translate-x-0 md:h-screen md:sticky md:top-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Cabecera del Sidebar con Identidad Institucional */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <Link
            to="/ciudadano"
            onClick={onCloseMobile}
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <Escudo className="h-8" />
            <div className="leading-tight">
              <p className="text-xs font-semibold text-white">Alcaldía de Girón</p>
              <p className="text-[10px] text-slate-400">Portal Ciudadano</p>
            </div>
          </Link>

          {/* Botón cerrar para móvil */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        {/* Contenedor con Scroll de Menú */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4">
          {/* Trámites Centrales */}
          <div>
            <div className="px-4 pb-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Trámites Principales
              </p>
            </div>
            <nav className="space-y-1 px-3">
              {mainLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white font-semibold'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={isActive ? 'text-dorado' : 'text-slate-500'}>{link.icon}</span>
                      <span className="flex-1">{link.label}</span>
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-dorado" />}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Módulo de Secretarías (Desplegable Limpio) */}
          <div>
            <div className="flex items-center justify-between px-4 pb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Secretarías ({SECRETARIAS.length})
              </span>
              <button
                type="button"
                onClick={() => setSecretariasAbiertas(!secretariasAbiertas)}
                className="text-xs text-slate-500 hover:text-slate-300 px-1"
                aria-label="Alternar listado de secretarías"
              >
                {secretariasAbiertas ? '−' : '+'}
              </button>
            </div>

            {secretariasAbiertas && (
              <div className="space-y-0.5 px-3">
                {SECRETARIAS.map((sec) => (
                  <NavLink
                    key={sec.id}
                    to={`/ciudadano/secretaria/${sec.slug}`}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-1.5 text-[11px] font-medium leading-tight transition-colors ${
                        isActive
                          ? 'bg-white/10 text-dorado font-semibold border-l-2 border-dorado pl-2.5'
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      }`
                    }
                  >
                    {sec.nombre}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Institucional del Sidebar */}
        <div className="border-t border-white/10 p-4 text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Vigencia:</span>
            <span className="font-semibold text-slate-200">2026</span>
          </div>
          <p className="text-[10px] text-slate-500">Sede San Juan de Girón</p>

          <div className="pt-2 border-t border-white/5">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white transition-colors"
            >
              <span>←</span>
              <span>Portada Principal</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
