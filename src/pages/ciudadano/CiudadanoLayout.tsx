import { NavLink, Outlet, Link } from 'react-router-dom'
import Escudo from '../../components/Escudo'

const tabs = [
  { to: '/ciudadano', label: 'Inicio', end: true },
  { to: '/ciudadano/radicar', label: 'Radicar PQRS', end: false },
  { to: '/ciudadano/consultar', label: 'Consultar estado', end: false },
]

export default function CiudadanoLayout() {
  return (
    <div className="min-h-screen bg-gradient-paper">
      <header className="sticky top-0 z-20 border-b border-ink/8 bg-paper-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4 sm:px-8">
          <Link to="/" className="group flex items-center gap-3">
            <Escudo className="h-9 w-9 transition-transform duration-300 group-hover:scale-105" />
            <div className="leading-tight">
              <p className="font-display text-base font-semibold text-ink">Gidi</p>
              <p className="eyebrow">Alcaldía de Girón</p>
            </div>
          </Link>
          <Link
            to="/admin"
            className="hidden rounded-full border border-transparent px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-faint transition-all duration-200 hover:border-ink/15 hover:text-ocre-deep sm:inline"
          >
            Acceso funcionarios →
          </Link>
        </div>
        <nav className="mx-auto flex max-w-4xl gap-1 px-4 pb-2 sm:px-6">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-ink text-paper shadow-sm'
                    : 'text-ink-faint hover:bg-ink/5 hover:text-ink'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10 sm:px-8 sm:py-14">
        <Outlet />
      </main>

      <footer className="mx-auto max-w-4xl px-6 pb-10 text-xs text-ink-faint sm:px-8">
        Ventanilla Única de Trámites · Alcaldía Municipal San Juan Girón
      </footer>
    </div>
  )
}
