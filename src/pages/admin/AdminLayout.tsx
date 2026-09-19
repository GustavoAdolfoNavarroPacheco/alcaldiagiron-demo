import { useState, useMemo } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import Escudo from '../../components/Escudo'
import { SECRETARIAS_GIRON } from '../../data/secretariasData'

const links = [
  {
    to: '/admin',
    label: 'Resumen General',
    end: true,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: '/admin/cobro-coactivo',
    label: 'Cobro Coactivo',
    end: false,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
      </svg>
    ),
  },
  {
    to: '/admin/ventanilla-unica',
    label: 'Ventanilla Única (PQRS)',
    end: false,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
      </svg>
    ),
  },
]

export default function AdminLayout() {
  const [secretariasAbiertas, setSecretariasAbiertas] = useState(true)
  const location = useLocation()
  const esRutaSecretaria = location.pathname.startsWith('/admin/secretarias')

  // Resolver el título del módulo o secretaría activa para la cabecera superior
  const tituloModulo = useMemo(() => {
    const path = location.pathname
    if (path === '/admin') return 'Resumen General Municipal'
    if (path === '/admin/cobro-coactivo') return 'Cobro Coactivo'
    if (path === '/admin/ventanilla-unica') return 'Ventanilla Única (PQRS)'
    if (path === '/admin/secretarias') return 'Directorio de Secretarías'
    if (path.startsWith('/admin/secretarias/')) {
      const slug = path.split('/admin/secretarias/')[1]?.replace(/\/$/, '')
      const sec = SECRETARIAS_GIRON.find((s) => s.slug === slug)
      return sec ? sec.nombre : 'Secretaría de Despacho'
    }
    return 'Panel Administrativo'
  }, [location.pathname])

  return (
    <div className="flex min-h-screen bg-slate-50/70">
      {/* Barra Lateral Institucional Limpia y Desplazable */}
      <aside className="flex w-72 shrink-0 flex-col border-r border-slate-800 bg-[#141212] text-slate-300">
        {/* Cabecera del Sidebar */}
        <Link
          to="/"
          className="flex items-center gap-3 border-b border-white/10 px-5 py-4 transition-colors hover:bg-white/[0.02]"
        >
          <Escudo className="h-8" />
          <div className="leading-tight">
            <p className="text-xs font-semibold text-white">Alcaldía de Girón</p>
            <p className="text-[10px] text-slate-400">Panel Administrativo</p>
          </div>
        </Link>

        {/* Contenedor con Scroll de Menú */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4">
          {/* Navegación por Módulos Centrales */}
          <div>
            <div className="px-4 pb-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Módulos Principales
              </p>
            </div>
            <nav className="space-y-1 px-3">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
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

          {/* Módulo de Secretarías (Desplegable, Sin emojis ni íconos) */}
          <div>
            <div className="flex items-center justify-between px-4 pb-1.5">
              <Link
                to="/admin/secretarias"
                className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                  esRutaSecretaria ? 'text-dorado' : 'text-slate-400 hover:text-white'
                }`}
              >
                Secretarías
              </Link>
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
                <NavLink
                  to="/admin/secretarias"
                  end
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white font-semibold'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`
                  }
                >
                  Directorio General
                </NavLink>

                {/* Las 11 Secretarías Oficiales en Texto Plano */}
                {SECRETARIAS_GIRON.map((sec) => (
                  <NavLink
                    key={sec.slug}
                    to={`/admin/secretarias/${sec.slug}`}
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

        {/* Indicador de Vigencia y Sede */}
        <div className="border-t border-white/10 p-4 text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Vigencia:</span>
            <span className="font-semibold text-slate-200">2026</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">Sede San Juan de Girón</p>
        </div>
      </aside>

      {/* Contenido Principal con Header Dinámico */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-8 py-3.5 backdrop-blur-xs">
          {/* Nombre del Módulo o Secretaría en la barra superior */}
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-slate-400">Alcaldía de Girón</span>
              <span className="text-slate-300">/</span>
              {location.pathname.startsWith('/admin/secretarias/') && (
                <>
                  <Link to="/admin/secretarias" className="font-medium text-slate-500 hover:text-slate-800 transition-colors">
                    Secretarías
                  </Link>
                  <span className="text-slate-300">/</span>
                </>
              )}
              <h1 className="text-sm font-semibold text-slate-900 tracking-tight">
                {tituloModulo}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-medium text-slate-900">Funcionario Administrador</p>
              <p className="text-[10px] text-slate-400">Alcaldía Municipal de Girón</p>
            </div>
            <Link
              to="/ciudadano"
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              Vista Ciudadano →
            </Link>
          </div>
        </header>

        <main className="flex-1 px-8 py-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
