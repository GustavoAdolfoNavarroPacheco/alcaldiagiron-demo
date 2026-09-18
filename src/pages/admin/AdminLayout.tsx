import { NavLink, Outlet, Link } from 'react-router-dom'
import Escudo from '../../components/Escudo'

const links = [
  { to: '/admin', label: 'Resumen', end: true },
  { to: '/admin/cobro-coactivo', label: 'Cobro Coactivo', end: false },
  { to: '/admin/ventanilla-unica', label: 'Ventanilla Única', end: false },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-paper-dim">
      <aside className="flex w-64 shrink-0 flex-col bg-gradient-ink text-paper">
        <Link to="/" className="group flex items-center gap-3 border-b border-paper/10 px-6 py-5">
          <Escudo className="h-8 w-8 transition-transform duration-300 group-hover:scale-105" />
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold">Gidi</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">Panel funcionario</p>
          </div>
        </Link>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `relative block rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-paper/10 text-paper shadow-[inset_0_0_0_1px_rgba(250,247,239,0.08)]'
                    : 'text-paper/55 hover:translate-x-0.5 hover:bg-paper/5 hover:text-paper/85'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-ocre" />
                  )}
                  {link.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-paper/10 px-6 py-4 text-[11px] leading-relaxed text-paper/40">
          Alcaldía Municipal
          <br />
          San Juan Girón
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-ink/8 bg-paper-card/80 px-8 py-4 backdrop-blur-md">
          <p className="eyebrow">Sesión de demostración</p>
          <Link
            to="/ciudadano"
            className="rounded-full border border-transparent px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-faint transition-all duration-200 hover:border-ink/15 hover:text-ocre-deep"
          >
            Ver panel ciudadano →
          </Link>
        </header>
        <main className="px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
