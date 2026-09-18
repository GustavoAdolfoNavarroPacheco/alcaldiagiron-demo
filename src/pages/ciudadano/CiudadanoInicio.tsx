import { Link } from 'react-router-dom'

export default function CiudadanoInicio() {
  return (
    <div className="space-y-10">
      {/* Hero institucional con mensaje de bienvenida y contexto */}
      <section className="relative overflow-hidden rounded-3xl border border-ink/8 bg-paper-card p-6 sm:p-10 shadow-card">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-vinotinto/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-dorado/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-vinotinto/15 bg-vinotinto-soft px-3.5 py-1 text-xs font-semibold text-vinotinto">
            <span className="h-1.5 w-1.5 rounded-full bg-vinotinto animate-pulse" />
            Ventanilla Única Digital · Alcaldía de Girón
          </div>

          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-tight">
            Portal de Trámites y <span className="text-vinotinto">Atención Ciudadana</span>
          </h1>

          <p className="mt-4 text-base leading-relaxed text-ink-faint sm:text-lg">
            Realice sus solicitudes, peticiones y quejas ante la administración municipal de San Juan Girón.
            Garantizamos trazabilidad en tiempo real, sello de radicación oficial y respuesta dentro de los términos legales.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6 pt-2 border-t border-ink/5 text-xs text-ink-faint">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-girverde-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Trámites 100% seguros y oficiales</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-ocre-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Monitoreo de términos Ley 1755 de 2015</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>Sin intermediarios ni costos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tarjetas de acción principales con distribución balanceada */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="eyebrow text-vinotinto">Acciones Rápidas</p>
            <h2 className="font-display text-2xl font-semibold text-ink">¿Qué trámite desea gestionar?</h2>
          </div>
          <span className="hidden sm:block font-mono text-xs text-ink-faint/70">Seleccione una opción para iniciar</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Tarjeta 1: Radicar PQRS */}
          <Link
            to="/ciudadano/radicar"
            className="card-lift group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-ink/8 bg-paper-card p-6 sm:p-8 shadow-card hover:border-vinotinto/30"
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-vinotinto/5 transition-transform duration-500 group-hover:scale-150" />

            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-vinotinto-soft text-vinotinto transition-colors duration-300 group-hover:bg-vinotinto group-hover:text-white">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="12" x2="12" y2="18" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                </div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-vinotinto bg-vinotinto/10 px-2.5 py-1 rounded-md">
                  Paso 01
                </span>
              </div>

              <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
                Radicar una PQRS
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-faint">
                Presente peticiones, quejas, reclamos, sugerencias o denuncias dirigidas a cualquier secretaría de la Alcaldía.
              </p>

              <ul className="mt-5 space-y-2 border-t border-ink/5 pt-4 text-xs text-ink-soft">
                <li className="flex items-center gap-2">
                  <svg className="h-3.5 w-3.5 text-girverde-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Generación inmediata de número de radicado oficial</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-3.5 w-3.5 text-girverde-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Asignación directa a la secretaría o dependencia responsable</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-3.5 w-3.5 text-girverde-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Soporte para adjuntar soportes y documentos probatorios</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-ink/5 pt-4">
              <span className="font-mono text-xs uppercase tracking-wide text-vinotinto font-semibold group-hover:underline">
                Iniciar radicación
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-vinotinto-soft text-vinotinto transition-all duration-300 group-hover:translate-x-1 group-hover:bg-vinotinto group-hover:text-white">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Tarjeta 2: Consultar Estado */}
          <Link
            to="/ciudadano/consultar"
            className="card-lift group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-ink/8 bg-paper-card p-6 sm:p-8 shadow-card hover:border-girverde/30"
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-girverde/5 transition-transform duration-500 group-hover:scale-150" />

            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-girverde/10 text-girverde-deep transition-colors duration-300 group-hover:bg-girverde group-hover:text-white">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <path d="m9 11 2 2 4-4" />
                  </svg>
                </div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-girverde-deep bg-girverde/10 px-2.5 py-1 rounded-md">
                  Paso 02
                </span>
              </div>

              <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
                Consultar Estado de Trámite
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-faint">
                Verifique en qué etapa va su solicitud ingresando su código alfanumérico de radicado.
              </p>

              <ul className="mt-5 space-y-2 border-t border-ink/5 pt-4 text-xs text-ink-soft">
                <li className="flex items-center gap-2">
                  <svg className="h-3.5 w-3.5 text-girverde-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Consulta inmediata sin necesidad de registro previo</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-3.5 w-3.5 text-girverde-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Semáforo de términos de respuesta y días restantes</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-3.5 w-3.5 text-girverde-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Visualización de respuesta oficial y constancias</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-ink/5 pt-4">
              <span className="font-mono text-xs uppercase tracking-wide text-girverde-deep font-semibold group-hover:underline">
                Rastrear radicado
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-girverde/10 text-girverde-deep transition-all duration-300 group-hover:translate-x-1 group-hover:bg-girverde group-hover:text-white">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Panel informativo inferior: Guía ciudadana y canales oficiales */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Términos legales de respuesta */}
        <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card">
          <div className="flex items-center gap-2.5 text-ink">
            <svg className="h-5 w-5 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <h4 className="font-display font-semibold text-base">Términos Legales</h4>
          </div>
          <p className="mt-2 text-xs text-ink-faint leading-relaxed">
            Plazos máximos estipulados por la ley colombiana para emitir respuesta:
          </p>

          <div className="mt-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between rounded-lg bg-paper p-2.5 border border-ink/5">
              <span className="font-medium text-ink">Peticiones de interés</span>
              <span className="font-mono font-semibold text-vinotinto">15 días hábiles</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-paper p-2.5 border border-ink/5">
              <span className="font-medium text-ink">Quejas y Reclamos</span>
              <span className="font-mono font-semibold text-vinotinto">15 días hábiles</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-paper p-2.5 border border-ink/5">
              <span className="font-medium text-ink">Sugerencias y propuestas</span>
              <span className="font-mono font-semibold text-vinotinto">15 días hábiles</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-paper p-2.5 border border-ink/5">
              <span className="font-medium text-ink">Denuncias públicas</span>
              <span className="font-mono font-semibold text-vinotinto">30 días hábiles</span>
            </div>
          </div>
        </div>

        {/* Canales y Horarios de Atención */}
        <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card">
          <div className="flex items-center gap-2.5 text-ink">
            <svg className="h-5 w-5 text-ocre-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <h4 className="font-display font-semibold text-base">Atención Presencial</h4>
          </div>
          <p className="mt-2 text-xs text-ink-faint leading-relaxed">
            Sede principal de la administración municipal:
          </p>

          <div className="mt-4 space-y-3 text-xs text-ink-soft">
            <div>
              <p className="font-semibold text-ink">Palacio Municipal Girón</p>
              <p className="text-ink-faint">Calle 30 No. 25-66, Centro Histórico</p>
            </div>
            <div>
              <p className="font-semibold text-ink">Horario de Atención</p>
              <p className="text-ink-faint">Lunes a Viernes: 8:00 a.m. a 12:00 m.</p>
              <p className="text-ink-faint">y 2:00 p.m. a 6:00 p.m.</p>
            </div>
            <div className="rounded-lg bg-dorado/10 p-2 text-[11px] text-ocre-deep font-medium border border-dorado/20">
              Ventanilla Única habilitada permanentemente
            </div>
          </div>
        </div>

        {/* Contacto y Soporte */}
        <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card">
          <div className="flex items-center gap-2.5 text-ink">
            <svg className="h-5 w-5 text-girverde-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <h4 className="font-display font-semibold text-base">Líneas Oficiales</h4>
          </div>
          <p className="mt-2 text-xs text-ink-faint leading-relaxed">
            Comuníquese directamente con atención al ciudadano:
          </p>

          <div className="mt-4 space-y-3 text-xs text-ink-soft">
            <div className="rounded-lg bg-paper p-2.5 border border-ink/5">
              <span className="block text-[10px] uppercase tracking-wider text-ink-faint">Conmutador PBX</span>
              <span className="font-mono text-sm font-semibold text-ink">+57 (607) 646 3030</span>
            </div>
            <div className="rounded-lg bg-paper p-2.5 border border-ink/5">
              <span className="block text-[10px] uppercase tracking-wider text-ink-faint">Correo Institucional</span>
              <span className="font-mono text-xs font-semibold text-ink truncate block">
                contactenos@giron-santander.gov.co
              </span>
            </div>
            <p className="text-[11px] text-ink-faint">
              Notificaciones judiciales y trámites administrativos.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
