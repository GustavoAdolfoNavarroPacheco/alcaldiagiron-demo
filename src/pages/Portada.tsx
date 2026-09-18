import { Link } from 'react-router-dom'
import Escudo from '../components/Escudo'

export default function Portada() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-ink text-paper">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #FAF7EF 1px, transparent 0)', backgroundSize: '24px 24px' }}
      />
      <div className="absolute -right-32 -top-32 h-96 w-96 animate-float-slow rounded-full bg-ocre/20 blur-3xl" />
      <div
        className="absolute -bottom-40 -left-24 h-96 w-96 animate-float-slow rounded-full bg-girverde/20 blur-3xl"
        style={{ animationDelay: '2.5s' }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10 sm:px-10">
        <header className="flex animate-fade-up items-center gap-3">
          <Escudo className="h-12 drop-shadow-[0_2px_8px_rgba(201,138,30,0.35)]" />
          <div>
            <p className="eyebrow text-paper/60">Municipio de Girón · Santander</p>
            <p className="font-display text-lg font-semibold">Alcaldía de Girón</p>
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center py-16">
          <p className="delay-1 eyebrow animate-fade-up text-ocre-light">
            Plataforma unificada de gestión municipal
          </p>
          <h1 className="delay-2 mt-4 max-w-3xl animate-fade-up text-balance font-display text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl">
            Un solo registro para lo que hoy vive repartido en{' '}
            <span className="bg-gradient-ocre bg-clip-text italic text-transparent">quince años</span>{' '}
            de sistemas distintos.
          </h1>
          <p className="delay-3 mt-6 max-w-xl animate-fade-up text-balance font-sans text-lg leading-relaxed text-paper/70">
            La Alcaldía de Girón reemplaza el trámite fragmentado por un expediente único: la misma
            información de cartera y PQRS, vista desde la ventanilla del ciudadano y
            desde el escritorio del funcionario.
          </p>

          <div className="delay-4 mt-12 grid animate-fade-up gap-5 sm:grid-cols-2">
            <Link
              to="/ciudadano"
              className="card-lift group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-paper/15 bg-paper/[0.04] p-7 backdrop-blur-sm hover:border-ocre/50 hover:shadow-glow"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ocre-light/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div>
                <span className="eyebrow text-paper/50">Acceso público</span>
                <h2 className="mt-3 font-display text-2xl font-medium">Panel Ciudadano</h2>
                <p className="mt-2 text-sm leading-relaxed text-paper/60">
                  Radique una PQRS o consulte el estado de una solicitud con su número
                  de radicado.
                </p>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ocre-light">
                Entrar como ciudadano
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </span>
            </Link>

            <Link
              to="/admin"
              className="card-lift group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-paper/15 bg-paper/[0.04] p-7 backdrop-blur-sm hover:border-girverde-light/50 hover:shadow-glow-verde"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-girverde-light/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div>
                <span className="eyebrow text-paper/50">Acceso funcionarios</span>
                <h2 className="mt-3 font-display text-2xl font-medium">Panel Administrador</h2>
                <p className="mt-2 text-sm leading-relaxed text-paper/60">
                  Cobro coactivo, ventanilla única y auditoría de términos en un solo
                  tablero.
                </p>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-girverde-light">
                Entrar como funcionario
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </span>
            </Link>
          </div>
        </main>

        <footer className="border-t border-paper/10 py-6 text-xs text-paper/40">
          Demo funcional · datos simulados almacenados en este navegador
        </footer>
      </div>
    </div>
  )
}
