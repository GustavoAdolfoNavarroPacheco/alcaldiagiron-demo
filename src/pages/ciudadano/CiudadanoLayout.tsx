import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import CiudadanoSidebar from '../../components/CiudadanoSidebar'
import Escudo from '../../components/Escudo'
import { SECRETARIAS } from '../../data/secretarias'

const SECTION_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/ciudadano': { title: 'Inicio', subtitle: 'Ventanilla Única y Trámites' },
  '/ciudadano/radicar': { title: 'Radicación de PQRS', subtitle: 'Recepción oficial de solicitudes' },
  '/ciudadano/consultar': { title: 'Consulta de Estado', subtitle: 'Trazabilidad y seguimiento' },
}

export default function CiudadanoLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
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
    <div className="flex min-h-screen bg-gradient-paper">
      {/* Barra lateral izquierda retraíble */}
      <CiudadanoSidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Área de contenido principal */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Cabecera superior del portal */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-ink/8 bg-paper-card/85 px-4 sm:px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Botón menú para dispositivos móviles */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink/10 bg-paper text-ink transition-colors hover:bg-ink/5 md:hidden"
              aria-label="Abrir menú de navegación"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>

            {/* Escudo visible en móvil cuando la barra lateral está oculta */}
            <div className="flex items-center gap-2 md:hidden">
              <Escudo className="h-8" />
              <span className="font-display text-xs font-semibold text-ink">Alcaldía de Girón</span>
            </div>

            {/* Título de sección en escritorio */}
            <div className="hidden md:block">
              <p className="eyebrow text-vinotinto">{currentSection.subtitle}</p>
              <h1 className="font-display text-lg font-semibold text-ink leading-tight">
                {currentSection.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="group inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-paper/60 px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-faint transition-all duration-200 hover:border-vinotinto/30 hover:bg-vinotinto-soft hover:text-vinotinto"
            >
              <span>Acceso funcionarios</span>
              <svg
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </header>

        {/* Contenido dinámico de las rutas hijas */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-8 sm:py-10">
          <Outlet />
        </main>

        {/* Pie de página institucional */}
        <footer className="border-t border-ink/8 py-6 px-6 sm:px-8 text-center text-xs text-ink-faint bg-paper/40">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>Ventanilla Única de Trámites · Alcaldía Municipal San Juan Girón</p>
            <p className="font-mono text-[11px] text-ink-faint/70">Atención ciudadana y radicación</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

