import { Link } from 'react-router-dom'

export default function CiudadanoInicio() {
  return (
    <div className="space-y-8">
      {/* Hero Institucional Corporativo */}
      <section className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Ventanilla Única Digital · Alcaldía de Girón
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Portal de Trámites y <span className="text-vinotinto">Atención Ciudadana</span>
          </h1>

          <p className="mt-2.5 text-sm leading-relaxed text-slate-600 sm:text-base">
            Realice sus solicitudes, peticiones y quejas ante la administración municipal de San Juan de Girón con plena validez jurídica.
            Garantizamos trazabilidad en tiempo real, radicación oficial inmediata y respuesta estricta según los términos de ley.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Trámites oficiales y seguros</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Monitoreo de términos Ley 1755 de 2015</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Sin intermediarios ni costos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tarjetas de Acción Directa */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Acciones Principales</p>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">¿Qué trámite desea gestionar hoy?</h2>
          </div>
          <span className="hidden sm:block text-xs text-slate-400">Seleccione una opción para comenzar</span>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Tarjeta 1: Radicar PQRS */}
          <Link
            to="/ciudadano/radicar"
            className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-vinotinto/10 text-vinotinto group-hover:bg-vinotinto group-hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                  Paso 01
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-vinotinto transition-colors">
                Radicar una PQRS
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Presente peticiones, quejas, reclamos, sugerencias o denuncias dirigidas a cualquiera de las dependencias de la Alcaldía.
              </p>

              <ul className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Generación inmediata de número de radicado oficial</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Asignación directa a la secretaría correspondiente</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Soporte para adjuntar evidencias y documentos</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-vinotinto">
              <span>Iniciar radicación</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Tarjeta 2: Consultar Estado */}
          <Link
            to="/ciudadano/consultar"
            className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                  Paso 02
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                Consultar Estado de Trámite
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Verifique en qué etapa procesal se encuentra su solicitud ingresando su código único de radicado.
              </p>

              <ul className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Consulta pública inmediata sin claves de acceso</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Semáforo de términos de respuesta y días hábiles</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Descarga de oficios de respuesta formalmente firmados</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-slate-700">
              <span>Consultar radicado</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Guía Informativa y Canales Oficiales */}
      <section className="grid gap-5 lg:grid-cols-3">
        {/* Términos Legales */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <svg className="h-4 w-4 text-vinotinto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h4 className="text-sm font-bold text-slate-900">Términos Legales</h4>
          </div>
          <p className="mt-2.5 text-xs text-slate-500 leading-relaxed">
            Plazos máximos estipulados por la ley colombiana para emitir respuesta:
          </p>

          <div className="mt-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <span className="font-medium text-slate-700">Peticiones de interés</span>
              <span className="font-semibold text-vinotinto tabular-nums">15 días hábiles</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <span className="font-medium text-slate-700">Quejas y Reclamos</span>
              <span className="font-semibold text-vinotinto tabular-nums">15 días hábiles</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <span className="font-medium text-slate-700">Sugerencias</span>
              <span className="font-semibold text-vinotinto tabular-nums">15 días hábiles</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <span className="font-medium text-slate-700">Denuncias públicas</span>
              <span className="font-semibold text-vinotinto tabular-nums">30 días hábiles</span>
            </div>
          </div>
        </div>

        {/* Atención Presencial */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <svg className="h-4 w-4 text-dorado-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h4 className="text-sm font-bold text-slate-900">Atención Presencial</h4>
          </div>
          <p className="mt-2.5 text-xs text-slate-500 leading-relaxed">
            Sede principal de la administración municipal:
          </p>

          <div className="mt-3.5 space-y-2.5 text-xs">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
              <p className="font-semibold text-slate-800">Palacio Municipal San Juan de Girón</p>
              <p className="text-slate-500 mt-0.5">Calle 30 No. 25-66, Centro Histórico</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
              <p className="font-semibold text-slate-800">Horarios de Atención</p>
              <p className="text-slate-500 mt-0.5">Lunes a Viernes: 8:00 a.m. - 12:00 m.</p>
              <p className="text-slate-500">y 2:00 p.m. - 6:00 p.m.</p>
            </div>
          </div>
        </div>

        {/* Canales Oficiales */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <h4 className="text-sm font-bold text-slate-900">Canales Oficiales</h4>
          </div>
          <p className="mt-2.5 text-xs text-slate-500 leading-relaxed">
            Comuníquese directamente con atención al ciudadano:
          </p>

          <div className="mt-3.5 space-y-2.5 text-xs">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Conmutador PBX</span>
              <p className="font-mono text-xs font-bold text-slate-800 mt-0.5">+57 (607) 646 3030</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Correo Institucional</span>
              <p className="font-mono text-[11px] font-bold text-slate-800 truncate mt-0.5">contactenos@giron-santander.gov.co</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
