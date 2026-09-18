import { useParams, Link } from 'react-router-dom'
import { SECRETARIAS } from '../../data/secretarias'
import SecretariaSaludView from './SecretariaSaludView'

export default function SecretariaDetalle() {
  const { slug } = useParams<{ slug: string }>()
  const secretaria = SECRETARIAS.find((s) => s.slug === slug)

  if (!secretaria) {
    return (
      <div className="rounded-2xl border border-ink/8 bg-paper-card p-8 text-center shadow-card">
        <h2 className="font-display text-xl font-semibold text-ink">Secretaría no encontrada</h2>
        <p className="mt-2 text-sm text-ink-faint">
          La dependencia solicitada no figura en la estructura actual del portal.
        </p>
        <Link to="/ciudadano" className="btn-vinotinto mt-6 inline-block text-xs">
          Volver al Inicio
        </Link>
      </div>
    )
  }

  // Renderizado del módulo interactivo completo para la Secretaría de Salud
  if (slug === 'secretaria-salud') {
    return <SecretariaSaludView />
  }

  // Vista estructurada con base en el documento técnico de IA para las demás dependencias
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Cabecera institucional de la dependencia */}
      <section className="relative overflow-hidden rounded-3xl border border-ink/8 bg-paper-card p-6 sm:p-10 shadow-card">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-vinotinto/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-dorado/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-vinotinto/15 bg-vinotinto-soft px-3.5 py-1 text-xs font-semibold text-vinotinto">
            <span className="h-1.5 w-1.5 rounded-full bg-vinotinto" />
            Secretaría de Despacho · Alcaldía de Girón
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {secretaria.nombre}
          </h1>

          <p className="mt-3 text-base leading-relaxed text-ink-faint">
            {secretaria.descripcion}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ink-faint pt-4 border-t border-ink/5">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{secretaria.canales.telefono}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>{secretaria.canales.correo}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{secretaria.canales.ubicacion}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Propuestas Técnicas de IA asignadas según el Catálogo oficial de Campuslands */}
      <section className="space-y-4">
        <div>
          <span className="eyebrow text-vinotinto">Alcance Técnico Designado</span>
          <h2 className="font-display text-2xl font-bold text-ink">
            Soluciones de Inteligencia Artificial para esta Secretaría
          </h2>
          <p className="text-xs text-ink-faint mt-1">
            Módulos y componentes del catálogo de 13 propuestas técnicas preparados para su implementación progresiva:
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {secretaria.propuestasPDF.map((propuesta) => (
            <div
              key={propuesta.numero + propuesta.titulo}
              className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-4 hover:border-vinotinto/30 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-vinotinto bg-vinotinto/10 px-2.5 py-0.5 rounded">
                    {propuesta.numero}
                  </span>
                  <h3 className="font-display font-semibold text-lg text-ink mt-2">
                    {propuesta.titulo}
                  </h3>
                </div>
                <span className="rounded-md bg-paper border border-ink/10 px-2 py-0.5 font-mono text-[10px] text-ink-faint">
                  {propuesta.sistemas}
                </span>
              </div>

              <div className="space-y-2 border-t border-ink/5 pt-3">
                <p className="text-[11px] font-semibold text-ink uppercase tracking-wider">
                  Módulos de la Solución:
                </p>
                <ul className="space-y-1.5 text-xs text-ink-soft">
                  {propuesta.modulos.map((m) => (
                    <li key={m} className="flex items-start gap-2">
                      <svg className="h-3.5 w-3.5 text-girverde-deep shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tarjeta de estado de desarrollo 1 a 1 y acciones */}
      <section className="rounded-2xl border border-dashed border-vinotinto/25 bg-vinotinto-soft/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-vinotinto font-semibold">
            <span className="h-2 w-2 rounded-full bg-vinotinto animate-ping" />
            <span>Fase de desarrollo individual (1 a 1)</span>
          </div>
          <p className="text-sm font-display font-medium text-ink">
            ¿Desea radicar un trámite o solicitud formal dirigida a esta secretaría?
          </p>
          <p className="text-xs text-ink-faint">
            Puede utilizar la Ventanilla Única para radicar peticiones, quejas o reclamos de competencia de {secretaria.nombre}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/ciudadano/radicar"
            className="btn-vinotinto text-xs"
          >
            Radicar PQRS ante esta dependencia
          </Link>
          <Link
            to="/ciudadano"
            className="btn-ghost text-xs"
          >
            Volver a Inicio
          </Link>
        </div>
      </section>
    </div>
  )
}
