import { useState, type FormEvent } from 'react'
import type { EstadoPQRS, PQRS } from '../../types'
import type { TramiteSecretaria } from '../../types/secretarias'
import { getPQRS, findExpedienteCiudadano } from '../../data/storage'
import { SECRETARIAS_GIRON } from '../../data/secretariasData'
import { formatFecha, diasRestantes } from '../../data/format'

export interface ExpedienteVisual {
  radicado: string
  tipo: string
  asunto: string
  solicitante: string
  documentoSolicitante: string
  fechaRadicacion: string
  fechaLimite: string
  fechaRespuesta?: string | null
  estado: EstadoPQRS
  dependencia: string
  archivoAdjunto?: string | null
  respuestaOficial?: string
}

function estadoActual(exp: ExpedienteVisual): EstadoPQRS {
  if (exp.estado === 'Resuelta') return 'Resuelta'
  return diasRestantes(exp.fechaLimite) < 0 ? 'Vencida' : 'En proceso'
}

const ESTADO_CONFIG: Record<EstadoPQRS, { label: string; bg: string; text: string; border: string; desc: string }> = {
  'En proceso': {
    label: 'En Proceso',
    bg: 'bg-semaforo-amarillo/10',
    text: 'text-semaforo-amarillo',
    border: 'border-semaforo-amarillo/30',
    desc: 'Dentro del término legal de estudio y respuesta.',
  },
  Vencida: {
    label: 'Término Vencido',
    bg: 'bg-semaforo-rojo/10',
    text: 'text-semaforo-rojo',
    border: 'border-semaforo-rojo/30',
    desc: 'Ha superado los días hábiles previstos por la Ley 1755.',
  },
  Resuelta: {
    label: 'Resuelta y Notificada',
    bg: 'bg-semaforo-verde/10',
    text: 'text-semaforo-verde',
    border: 'border-semaforo-verde/30',
    desc: 'Trámite finalizado con pronunciamiento de fondo.',
  },
}

export default function ConsultarEstado() {
  const [radicado, setRadicado] = useState('')
  const [buscado, setBuscado] = useState<ExpedienteVisual | null | undefined>(undefined)

  const allPQRS = getPQRS()
  const sampleRadicados = [
    allPQRS[0]?.radicado,
    allPQRS[1]?.radicado,
    'AUD-SALUD-2026-1045',
    'EST-HAC-2026-4521',
  ].filter(Boolean) as string[]

  function handleSearch(radicadoToSearch: string) {
    const clean = radicadoToSearch.trim().toLowerCase()
    if (!clean) return

    const res = findExpedienteCiudadano(clean)
    if (!res) {
      setBuscado(null)
      return
    }

    if (res.tipo === 'pqrs') {
      const p = res.datos as PQRS
      setBuscado({
        radicado: p.radicado,
        tipo: p.tipo,
        asunto: p.asunto,
        solicitante: p.solicitante,
        documentoSolicitante: p.documentoSolicitante,
        fechaRadicacion: p.fechaRadicacion,
        fechaLimite: p.fechaLimite,
        fechaRespuesta: p.fechaRespuesta,
        estado: p.estado,
        dependencia: p.dependencia,
        archivoAdjunto: p.archivoAdjunto,
        respuestaOficial: p.respuestaOficial,
      })
    } else {
      const t = res.datos as TramiteSecretaria & { secretariaSlug?: string }
      const secInfo = SECRETARIAS_GIRON.find((s) => s.slug === t.secretariaSlug)
      const nombreSec = secInfo ? secInfo.nombre : 'Secretaría de Despacho'

      const estadoMapeado: EstadoPQRS =
        t.estado === 'Aprobado' || t.estado === 'Finalizado'
          ? 'Resuelta'
          : 'En proceso'

      setBuscado({
        radicado: t.radicado,
        tipo: t.tipoTramite,
        asunto: t.titulo,
        solicitante: t.solicitante,
        documentoSolicitante: t.documentoSolicitante,
        fechaRadicacion: t.fecha,
        fechaLimite: t.fecha,
        fechaRespuesta: estadoMapeado === 'Resuelta' ? t.fecha : null,
        estado: estadoMapeado,
        dependencia: nombreSec,
        archivoAdjunto: 'Constancia_Oficial_FirmaDigital.pdf',
        respuestaOficial:
          t.respuestaOficial ??
          (t.estado === 'Aprobado'
            ? 'Trámite validado, certificado y aprobado en el despacho de la dependencia.'
            : undefined),
      })
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    handleSearch(radicado)
  }

  return (
    <div className="space-y-6">
      {/* Encabezado y buscador principal */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
        <div className="max-w-3xl">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Trazabilidad y Control</span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Consultar Estado de un Trámite
          </h1>
          <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
            Ingrese el número oficial de radicado para verificar en tiempo real la etapa procesal, dependencia a cargo y término legal de respuesta.
          </p>
        </div>

        {/* Barra de búsqueda interactiva */}
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col sm:flex-row gap-2.5 max-w-2xl">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              value={radicado}
              onChange={(e) => setRadicado(e.target.value)}
              placeholder="Ej. PQRS-2026-000118"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 font-mono text-xs text-slate-900 uppercase tracking-wide placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-vinotinto px-5 py-2 text-xs font-semibold text-white hover:bg-vinotinto-deep transition-colors shadow-2xs"
          >
            Consultar Radicado
          </button>
        </form>

        {/* Acceso rápido a radicados de ejemplo para pruebas inmediatas */}
        {sampleRadicados.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs border-t border-slate-100 pt-3">
            <span className="text-slate-400 text-[11px] font-medium">Ejemplos para consulta rápida:</span>
            {sampleRadicados.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setRadicado(sample)
                  handleSearch(sample)
                }}
                className="font-mono text-[11px] rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 hover:bg-white"
              >
                {sample}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Distribución balanceada de 2 columnas (8 + 4) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Columna Principal: Resultado o Guía de Proceso */}
        <div className="lg:col-span-8 space-y-6">
          {/* Mensaje de no encontrado */}
          {buscado === null && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-5 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Radicado no encontrado</h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    No se encontró ninguna solicitud registrada bajo el código{' '}
                    <span className="font-mono font-semibold text-slate-900">{radicado}</span>.
                  </p>
                  <ul className="mt-2.5 space-y-1 text-xs text-slate-500 list-disc list-inside">
                    <li>Verifique que el formato sea exacto (ej. <span className="font-mono">PQRS-2026-XXXXXX</span>).</li>
                    <li>Si radicó recientemente en ventanilla física, el trámite puede tomar unos minutos en sincronizarse.</li>
                    <li>Para asistencia institucional directa, comuníquese al conmutador <strong>(607) 646 3030</strong>.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Expediente del radicado encontrado */}
          {buscado && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
              {/* Cabecera del expediente */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Expediente Oficial
                  </span>
                  <h2 className="font-mono text-xl font-bold text-slate-900 mt-0.5">
                    {buscado.radicado}
                  </h2>
                  <p className="text-sm font-medium text-vinotinto mt-1">
                    {buscado.asunto}
                  </p>
                </div>

                {(() => {
                  const est = estadoActual(buscado)
                  const cfg = ESTADO_CONFIG[est]
                  return (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1 font-mono text-xs font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {cfg.label}
                    </span>
                  )
                })()}
              </div>

              {/* Barra de progreso visual del trámite */}
              <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs font-semibold text-slate-800 mb-3">Línea de Vida del Trámite</p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="space-y-1.5">
                    <div className="h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-slate-800 block text-[11px]">1. Radicación</span>
                    <span className="font-mono text-[10px] text-slate-500">{formatFecha(buscado.fechaRadicacion)}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 rounded-full bg-vinotinto" />
                    <span className="font-semibold text-slate-800 block text-[11px]">2. En Trámite</span>
                    <span className="text-[10px] text-slate-500 truncate block">{buscado.dependencia}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className={`h-2 rounded-full ${buscado.estado === 'Resuelta' ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    <span className="font-semibold text-slate-800 block text-[11px]">3. Respuesta</span>
                    <span className="text-[10px] text-slate-500">
                      {buscado.fechaRespuesta ? formatFecha(buscado.fechaRespuesta) : 'Pendiente'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grilla detallada de datos administrativos */}
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-slate-100 bg-slate-50/70 p-4 text-xs">
                <div>
                  <dt className="text-slate-400 font-medium">Tipo de Solicitud</dt>
                  <dd className="font-semibold text-slate-900 mt-0.5">{buscado.tipo}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Dependencia a Cargo</dt>
                  <dd className="font-semibold text-slate-900 mt-0.5">{buscado.dependencia}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Peticionario Registrado</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">{buscado.solicitante}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Documento de Identidad</dt>
                  <dd className="font-mono text-slate-800 mt-0.5">{buscado.documentoSolicitante}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Fecha de Radicación</dt>
                  <dd className="font-mono text-slate-800 mt-0.5">{formatFecha(buscado.fechaRadicacion)}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Fecha Límite Legal</dt>
                  <dd className="font-mono font-semibold text-vinotinto mt-0.5">{formatFecha(buscado.fechaLimite)}</dd>
                </div>

                {buscado.fechaRespuesta && (
                  <div className="sm:col-span-2 pt-2.5 border-t border-slate-200">
                    <dt className="text-slate-400 font-medium">Fecha de Respuesta Oficial</dt>
                    <dd className="font-mono font-semibold text-emerald-600 mt-0.5">
                      {formatFecha(buscado.fechaRespuesta)}
                    </dd>
                  </div>
                )}

                {buscado.archivoAdjunto && (
                  <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                    <dt className="text-slate-400 font-medium">Soporte Adjunto</dt>
                    <dd className="font-mono text-xs text-slate-700 mt-0.5 flex items-center gap-1.5">
                      <svg className="h-4 w-4 text-vinotinto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      {buscado.archivoAdjunto}
                    </dd>
                  </div>
                )}
              </dl>

              {/* Respuesta Oficial y Concepto de la Administración */}
              {buscado.respuestaOficial && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs space-y-2.5 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                      <span className="font-bold text-emerald-950 uppercase tracking-wider text-[10px]">
                        Notificación y Concepto de la Secretaría a Cargo
                      </span>
                    </div>
                    <span className="rounded bg-emerald-100/80 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-800">
                      Acto Notificado
                    </span>
                  </div>
                  <div className="rounded-lg border border-emerald-200/70 bg-white p-3 text-slate-800 leading-relaxed text-xs">
                    {buscado.respuestaOficial}
                  </div>
                </div>
              )}

              {/* Acciones para el expediente */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Imprimir Constancia
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBuscado(undefined)
                    setRadicado('')
                  }}
                  className="text-xs font-semibold text-vinotinto hover:underline"
                >
                  Nueva consulta →
                </button>
              </div>
            </div>
          )}

          {/* Guía informativa de proceso cuando no hay búsqueda activa */}
          {buscado === undefined && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Ciclo de Atención y Términos de una PQRS
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cada requerimiento ciudadano cumple con el siguiente procedimiento normativo:
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 text-xs">
                <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-100 space-y-1.5">
                  <span className="font-mono font-bold text-[10px] text-vinotinto bg-vinotinto/10 px-2 py-0.5 rounded">
                    Fase 01
                  </span>
                  <h4 className="font-bold text-slate-900">Recepción Oficial</h4>
                  <p className="text-slate-500 leading-relaxed text-[11px]">
                    Se genera el sello cronológico digital y se expide el radicado único para control formal.
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-100 space-y-1.5">
                  <span className="font-mono font-bold text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    Fase 02
                  </span>
                  <h4 className="font-bold text-slate-900">Reparto y Trámite</h4>
                  <p className="text-slate-500 leading-relaxed text-[11px]">
                    La dependencia técnica analiza la documentación, hace visitas o proyecta la resolución.
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-100 space-y-1.5">
                  <span className="font-mono font-bold text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Fase 03
                  </span>
                  <h4 className="font-bold text-slate-900">Notificación Final</h4>
                  <p className="text-slate-500 leading-relaxed text-[11px]">
                    Se emite la respuesta formal de fondo con firma digital y se notifica al peticionario.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Columna Lateral: Panel de Ayuda y Semáforo Normativo (4 columnas) */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Significado del semáforo institucional */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Semáforo de Términos</h3>
            <p className="text-xs text-slate-500">
              Estados en los que puede figurar una solicitud según el calendario legal:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3">
                <div className="flex items-center gap-1.5 font-bold text-amber-800 text-xs">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>En Proceso</span>
                </div>
                <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                  Dentro del plazo legal de 15 o 30 días hábiles concedido por la Ley 1755.
                </p>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Resuelta</span>
                </div>
                <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                  La administración municipal ha emitido pronunciamiento formal de fondo.
                </p>
              </div>

              <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-3">
                <div className="flex items-center gap-1.5 font-bold text-rose-800 text-xs">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span>Término Vencido</span>
                </div>
                <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                  Plazo legal superado sin pronunciamiento. Amerita prioridad inmediata.
                </p>
              </div>
            </div>
          </div>

          {/* Dónde encontrar el radicado */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2.5 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">¿Dónde ubicar su radicado?</h3>
            <p className="text-slate-500 leading-relaxed">
              El número de radicado figura en la parte superior del comprobante oficial:
            </p>
            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100 font-mono text-center text-xs text-vinotinto font-bold">
              PQRS-2026-XXXXXX
            </div>
            <p className="text-[11px] text-slate-400">
              Si radicó en ventanilla física, consulte el adhesivo adherido a su copia.
            </p>
          </div>

          {/* Contacto directo con personería */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2.5 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Vigilancia y Control</h3>
            <p className="text-slate-500 leading-relaxed">
              La <strong>Personería Municipal de San Juan de Girón</strong> vigila el cumplimiento de los términos de ley.
            </p>
            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 text-[11px] block">Línea de Atención:</span>
              <span className="font-mono font-bold text-slate-800 text-xs">+57 (607) 646 3030 Ext. 102</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
