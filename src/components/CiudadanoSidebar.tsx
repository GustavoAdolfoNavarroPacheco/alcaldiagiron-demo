import { useState, useEffect, useMemo } from 'react'
import { NavLink, useLocation, Link } from 'react-router-dom'
import Escudo from './Escudo'
import { SECRETARIAS } from '../data/secretarias'

interface CiudadanoSidebarProps {
  isMobileOpen: boolean
  onCloseMobile: () => void
}

interface NavItemConfig {
  to: string
  label: string
  badge: string
  description: string
  exact?: boolean
  icon: (props: { className?: string; isActive?: boolean }) => JSX.Element
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    to: '/ciudadano',
    label: 'Inicio',
    badge: '01',
    description: 'Portal de trámites',
    exact: true,
    icon: ({ className = 'h-5 w-5', isActive }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={isActive ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
        <path d="M9 21v-6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6" />
      </svg>
    ),
  },
  {
    to: '/ciudadano/radicar',
    label: 'Radicar PQRS',
    badge: '02',
    description: 'Petición o queja',
    exact: false,
    icon: ({ className = 'h-5 w-5', isActive }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={isActive ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="12" x2="12" y2="18" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  },
  {
    to: '/ciudadano/consultar',
    label: 'Consultar Estado',
    badge: '03',
    description: 'Seguimiento por radicado',
    exact: false,
    icon: ({ className = 'h-5 w-5', isActive }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={isActive ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.2" y2="16.2" />
        <path d="m8.5 11 1.8 1.8 3.7-3.7" />
      </svg>
    ),
  },
]

const ITEM_HEIGHT = 52 // Altura en px de cada elemento
const ITEM_GAP = 8 // Espacio vertical en px entre elementos

export default function CiudadanoSidebar({ isMobileOpen, onCloseMobile }: CiudadanoSidebarProps) {
  const location = useLocation()

  // Persistencia de estado colapsado en localStorage
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('giron_citizen_sidebar_collapsed')
      return stored === 'true'
    } catch {
      return false
    }
  })

  // Control del desplegable de Secretarías
  const isCurrentRouteSecretaria = location.pathname.startsWith('/ciudadano/secretaria')
  const [isSecretariasOpen, setIsSecretariasOpen] = useState(() => isCurrentRouteSecretaria)

  useEffect(() => {
    if (isCurrentRouteSecretaria) {
      setIsSecretariasOpen(true)
    }
  }, [isCurrentRouteSecretaria])

  useEffect(() => {
    try {
      localStorage.setItem('giron_citizen_sidebar_collapsed', String(isCollapsed))
    } catch {
      // ignore
    }
  }, [isCollapsed])

  // Cálculo del índice activo para la animación de desplazamiento de los 3 apartados principales
  const activeIndex = useMemo(() => {
    const currentPath = location.pathname
    return NAV_ITEMS.findIndex((item) => {
      if (item.exact) {
        return currentPath === item.to || currentPath === `${item.to}/`
      }
      return currentPath.startsWith(item.to)
    })
  }, [location.pathname])

  return (
    <>
      {/* Backdrop overlay para pantallas móviles */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Contenedor principal del Sidebar: FIJO verticalmente en escritorio (sticky top-0 h-screen) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-ink/8 bg-paper-card/95 backdrop-blur-md shadow-card transition-[width,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)] md:sticky md:top-0 md:h-screen md:max-h-screen md:overflow-hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Cabecera del Sidebar con Escudo e Identidad Institucional (fija) */}
        <div className="flex-none flex h-20 items-center justify-between border-b border-ink/8 px-4">
          <Link
            to="/ciudadano"
            className={`group flex items-center gap-3 overflow-hidden transition-all duration-300 ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
            title="Alcaldía de Girón - Portal Ciudadano"
          >
            <div className="relative shrink-0">
              <Escudo className="h-10 transition-transform duration-300 group-hover:scale-105" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-300">
                <p className="font-display text-sm font-semibold leading-tight text-ink truncate">
                  Alcaldía de Girón
                </p>
                <span className="inline-block font-mono text-[10px] uppercase tracking-[0.16em] text-vinotinto font-medium">
                  Portal Ciudadano
                </span>
              </div>
            )}
          </Link>

          {/* Botón de cierre en móvil */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink md:hidden"
            aria-label="Cerrar barra lateral"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Cuerpo de navegación con scroll interno independiente */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {/* SECCIÓN 1: Trámites principales con Indicador Deslizante Suave */}
          <div>
            <div className="mb-2 px-3">
              {!isCollapsed ? (
                <p className="eyebrow text-[10px] text-ink-faint/70">
                  Trámites y Servicios
                </p>
              ) : (
                <div className="h-3 border-b border-ink/5 mx-auto w-6" />
              )}
            </div>

            {/* Contenedor relativo para el riel y cápsula deslizante */}
            <nav className="relative" aria-label="Menú principal de trámites">
              {/* Cápsula activa con animación suave de traslación vertical */}
              {activeIndex >= 0 && (
                <div
                  className="absolute inset-x-0 rounded-xl bg-gradient-vinotinto shadow-glow-vinotinto transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] pointer-events-none"
                  style={{
                    height: `${ITEM_HEIGHT}px`,
                    transform: `translateY(${activeIndex * (ITEM_HEIGHT + ITEM_GAP)}px)`,
                  }}
                >
                  {/* Riel / Acento dorado institucional en el lateral */}
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-dorado shadow-glow-dorado" />
                </div>
              )}

              {/* Lista de enlaces principales */}
              <div className="relative space-y-2">
                {NAV_ITEMS.map((item, index) => {
                  const isActive = activeIndex === index
                  const IconComponent = item.icon

                  return (
                    <div key={item.to} className="relative group">
                      <NavLink
                        to={item.to}
                        end={item.exact}
                        onClick={() => {
                          if (isMobileOpen) onCloseMobile()
                        }}
                        className={`relative z-10 flex h-[52px] items-center rounded-xl px-3 transition-colors duration-200 ${
                          isActive
                            ? 'text-white'
                            : 'text-ink-soft hover:text-ink hover:bg-ink/[0.04]'
                        } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 ${
                              isActive
                                ? 'text-dorado-light scale-105'
                                : 'text-ink-faint group-hover:text-vinotinto'
                            }`}
                          >
                            <IconComponent className="h-5 w-5" isActive={isActive} />
                          </div>

                          {!isCollapsed && (
                            <div className="min-w-0 leading-tight">
                              <p className="text-sm font-medium truncate">{item.label}</p>
                              <p
                                className={`text-[11px] truncate ${
                                  isActive ? 'text-paper/75' : 'text-ink-faint/70'
                                }`}
                              >
                                {item.description}
                              </p>
                            </div>
                          )}
                        </div>

                        {!isCollapsed && (
                          <span
                            className={`font-mono text-[10px] tracking-wider rounded-md px-1.5 py-0.5 transition-colors ${
                              isActive
                                ? 'bg-white/15 text-dorado-light font-semibold'
                                : 'text-ink-faint/50 group-hover:text-ink-faint'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </NavLink>

                      {/* Tooltip flotante accesible al estar colapsado */}
                      {isCollapsed && (
                        <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 hidden md:group-hover:flex items-center rounded-lg border border-ink/10 bg-ink px-3 py-1.5 text-xs font-medium text-paper shadow-card animate-fade-in whitespace-nowrap">
                          <span>{item.label}</span>
                          <span className="ml-2 font-mono text-[10px] text-dorado">
                            {item.badge}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </nav>
          </div>

          {/* SECCIÓN 2: Desplegable de Secretarías (11 apartados) */}
          <div className="pt-2 border-t border-ink/8">
            <div className="mb-2 px-3">
              {!isCollapsed ? (
                <p className="eyebrow text-[10px] text-ink-faint/70">
                  Dependencias
                </p>
              ) : (
                <div className="h-2" />
              )}
            </div>

            {/* Vista Expandida del botón desplegable */}
            {!isCollapsed ? (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setIsSecretariasOpen((prev) => !prev)}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-colors ${
                    isCurrentRouteSecretaria
                      ? 'bg-vinotinto/10 text-vinotinto'
                      : 'text-ink-soft hover:bg-ink/[0.04] hover:text-ink'
                  }`}
                  aria-expanded={isSecretariasOpen}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-vinotinto/10 text-vinotinto">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 21h18" />
                        <path d="M5 21V7l7-4 7 4v14" />
                        <path d="M9 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v11H9V10z" />
                      </svg>
                    </div>
                    <span className="truncate font-semibold text-xs text-ink">
                      Secretarías
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="rounded-md bg-vinotinto/10 px-1.5 py-0.5 text-[10px] font-mono text-vinotinto font-semibold">
                      11
                    </span>
                    <svg
                      className={`h-4 w-4 text-ink-faint transition-transform duration-200 ${
                        isSecretariasOpen ? 'rotate-180 text-vinotinto' : ''
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {/* Sublista desplegable animada con las 11 secretarías */}
                {isSecretariasOpen && (
                  <div className="mt-1 space-y-0.5 pl-2 border-l-2 border-vinotinto/20 ml-3 animate-fade-in">
                    {SECRETARIAS.map((sec) => {
                      const isSecActive = location.pathname === `/ciudadano/secretaria/${sec.slug}`
                      return (
                        <NavLink
                          key={sec.id}
                          to={`/ciudadano/secretaria/${sec.slug}`}
                          onClick={() => {
                            if (isMobileOpen) onCloseMobile()
                          }}
                          className={`group flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors duration-150 ${
                            isSecActive
                              ? 'bg-vinotinto-soft text-vinotinto font-semibold shadow-sm'
                              : 'text-ink-soft hover:bg-ink/[0.04] hover:text-vinotinto'
                          }`}
                          title={sec.nombre}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full shrink-0 transition-colors ${
                              isSecActive ? 'bg-vinotinto' : 'bg-ink/25 group-hover:bg-vinotinto'
                            }`}
                          />
                          <span className="truncate text-[11px] leading-snug">
                            {sec.nombre}
                          </span>
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Vista Colapsada del botón de Secretarías con Menú Flyout Flotante */
              <div className="relative group flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsCollapsed(false)}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                    isCurrentRouteSecretaria
                      ? 'bg-vinotinto text-white shadow-glow-vinotinto'
                      : 'text-ink-faint hover:bg-ink/5 hover:text-vinotinto'
                  }`}
                  title="Secretarías de Despacho (11)"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 21h18" />
                    <path d="M5 21V7l7-4 7 4v14" />
                    <path d="M9 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v11H9V10z" />
                  </svg>
                </button>

                {/* Flyout Popover flotante en modo colapsado para acceso directo */}
                <div className="pointer-events-none absolute left-full top-0 ml-3 z-50 hidden md:group-hover:pointer-events-auto md:group-hover:block w-72 rounded-2xl border border-ink/10 bg-paper-card p-3 shadow-card animate-fade-in">
                  <div className="flex items-center justify-between border-b border-ink/8 pb-2 px-1 mb-2">
                    <span className="font-display font-semibold text-xs text-ink">
                      Secretarías de Despacho
                    </span>
                    <span className="font-mono text-[10px] text-vinotinto bg-vinotinto/10 px-1.5 py-0.5 rounded font-bold">
                      11
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-0.5 scrollbar-thin">
                    {SECRETARIAS.map((sec) => (
                      <NavLink
                        key={sec.id}
                        to={`/ciudadano/secretaria/${sec.slug}`}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-ink-soft hover:bg-vinotinto-soft hover:text-vinotinto transition-colors"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-vinotinto/40 shrink-0" />
                        <span className="truncate text-[11px]">{sec.nombre}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sección inferior con botón de repliegue y datos de Girón (fija) */}
        <div className="flex-none border-t border-ink/8 p-3 space-y-1.5">
          {/* Botón de alternar colapso (visible en escritorio) */}
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className={`hidden md:flex w-full items-center rounded-xl p-2.5 text-ink-faint transition-all duration-200 hover:bg-ink/5 hover:text-ink ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}
            title={isCollapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'}
            aria-label={isCollapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'}
          >
            <div className="flex items-center gap-3">
              <svg
                className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                  isCollapsed ? 'rotate-180 text-vinotinto' : ''
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 3v18" />
                <path d="m14 9-3 3 3 3" />
              </svg>
              {!isCollapsed && (
                <span className="text-xs font-medium">Contraer menú</span>
              )}
            </div>
            {!isCollapsed && (
              <span className="font-mono text-[10px] uppercase text-ink-faint/60">Tab</span>
            )}
          </button>

          {/* Enlace de regreso a la portada */}
          <Link
            to="/"
            className={`flex items-center rounded-xl p-2.5 text-ink-faint transition-all duration-200 hover:bg-ink/5 hover:text-ink ${
              isCollapsed ? 'justify-center' : 'gap-3'
            }`}
            title="Volver a la portada principal"
          >
            <svg
              className="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            {!isCollapsed && (
              <span className="text-xs font-medium truncate">Portada principal</span>
            )}
          </Link>
        </div>
      </aside>
    </>
  )
}
