import { Link } from 'react-router-dom'

export default function CiudadanoInicio() {
  return (
    <div>
      <p className="eyebrow animate-fade-up text-ocre-deep">Ventanilla única</p>
      <h1 className="delay-1 mt-3 max-w-xl animate-fade-up font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
        ¿Qué necesita hacer hoy?
      </h1>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <Link
          to="/ciudadano/radicar"
          className="card-lift delay-2 group flex animate-fade-up flex-col justify-between rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card hover:border-ocre/40 hover:shadow-glow"
        >
          <div>
            <span className="font-mono text-xs uppercase tracking-wide text-ocre-deep/70">01</span>
            <h2 className="mt-2 font-display text-xl font-medium text-ink">
              Radicar una PQRS
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-faint">
              Peticiones, quejas, reclamos, sugerencias o denuncias ante la
              administración municipal. Obtenga su número de radicado al instante.
            </p>
          </div>
          <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ocre-deep">
            Iniciar radicación
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </span>
        </Link>

        <Link
          to="/ciudadano/consultar"
          className="card-lift delay-3 group flex animate-fade-up flex-col justify-between rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card hover:border-girverde/40 hover:shadow-glow-verde"
        >
          <div>
            <span className="font-mono text-xs uppercase tracking-wide text-girverde-deep/70">02</span>
            <h2 className="mt-2 font-display text-xl font-medium text-ink">
              Consultar estado de un trámite
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-faint">
              Ingrese el número de radicado de una PQRS ya presentada para conocer
              si está en proceso, vencida o resuelta.
            </p>
          </div>
          <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-girverde-deep">
            Consultar radicado
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </span>
        </Link>
      </div>

      <div className="delay-4 mt-10 animate-fade-up rounded-xl border border-ink/8 bg-ink/[0.02] py-4 pl-5 pr-4 text-sm leading-relaxed text-ink-faint">
        Recuerde que otros trámites de cartera —como solicitudes de pago o estados
        de cuenta— pueden radicarse también como PQRS dirigida a la Secretaría de
        Hacienda.
      </div>
    </div>
  )
}
