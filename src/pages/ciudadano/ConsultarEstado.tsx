import { useState, type FormEvent } from 'react'
import type { EstadoPQRS, PQRS } from '../../types'
import { getPQRS } from '../../data/storage'
import { formatFecha, diasRestantes } from '../../data/format'

function estadoActual(pqrs: PQRS): EstadoPQRS {
  if (pqrs.estado === 'Resuelta') return 'Resuelta'
  return diasRestantes(pqrs.fechaLimite) < 0 ? 'Vencida' : 'En proceso'
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
  const [buscado, setBuscado] = useState<PQRS | null | undefined>(undefined)

  const allPQRS = getPQRS()
  const sampleRadicados = allPQRS.slice(0, 3).map((p) => p.radicado)

  function handleSearch(radicadoToSearch: string) {
    const clean = radicadoToSearch.trim().toLowerCase()
    if (!clean) return
    const encontrado = allPQRS.find((p) => p.radicado.toLowerCase() === clean)
    setBuscado(encontrado ?? null)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    handleSearch(radicado)
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Encabezado y buscador principal */}
      <section className="rounded-3xl border border-ink/8 bg-paper-card p-6 sm:p-10 shadow-card">
        <div className="max-w-3xl">
          <span className="eyebrow text-vinotinto font-semibold">Trazabilidad y Transparencia</span>
          <h1 className="mt-2 font-display text-2xl sm:text-4xl font-bold text-ink">
            Consultar Estado de un Trámite
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-faint">
            Ingrese el número oficial de radicado para consultar en tiempo real el avance, dependencia responsable y término legal de su solicitud.
          </p>
        </div>

        {/* Barra de búsqueda interactiva */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              value={radicado}
              onChange={(e) => setRadicado(e.target.value)}
              placeholder="Ej. PQRS-2026-000118"
              className="field pl-10 font-mono text-sm uppercase tracking-wide"
            />
          </div>
          <button type="submit" className="btn-vinotinto px-7 py-2.5 text-xs">
            Consultar Radicado
          </button>
        </form>

        {/* Acceso rápido a radicados de ejemplo para pruebas inmediatas */}
        {sampleRadicados.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-ink-faint/70 font-medium">Ejemplos para consulta rápida:</span>
            {sampleRadicados.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setRadicado(sample)
                  handleSearch(sample)
                }}
                className="font-mono text-[11px] rounded-lg border border-ink/10 bg-paper px-2.5 py-1 text-ink transition-colors hover:border-vinotinto hover:text-vinotinto hover:bg-vinotinto-soft"
              >
                {sample}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Distribución balanceada de 2 columnas (8 + 4) */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Columna Principal: Resultado o Guía de Proceso */}
        <div className="lg:col-span-8 space-y-6">
          {/* Mensaje de no encontrado */}
          {buscado === null && (
            <div className="rounded-2xl border border-semaforo-rojo/30 bg-semaforo-rojo/5 p-6 shadow-card">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-semaforo-rojo/10 text-semaforo-rojo">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base text-ink">Radicado no encontrado</h3>
                  <p className="mt-1 text-xs text-ink-faint leading-relaxed">
                    No se encontró ninguna solicitud registrada bajo el código{' '}
                    <span className="font-mono font-semibold text-ink">{radicado}</span>.
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-ink-faint list-disc list-inside">
                    <li>Verifique que el formato sea exacto (ej. <span className="font-mono">PQRS-2026-XXXXXX</span>).</li>
                    <li>Si radicó hace pocos minutos en ventanilla física, el sistema puede tardar en sincronizar.</li>
                    <li>Si requiere soporte directo, comuníquese al conmutador <strong>(607) 646 3030</strong>.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Expediente del radicado encontrado */}
          {buscado && (
            <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 sm:p-8 shadow-card space-y-6">
              {/* Cabecera del expediente */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/8 pb-5">
                <div>
                  <span className="font-mono text-xs text-ink-faint uppercase tracking-wider">
                    Expediente Oficial
                  </span>
                  <h2 className="font-mono text-2xl font-bold text-ink mt-0.5">
                    {buscado.radicado}
                  </h2>
                  <p className="font-display text-lg font-medium text-vinotinto mt-1">
                    {buscado.asunto}
                  </p>
                </div>

                {(() => {
                  const est = estadoActual(buscado)
                  const cfg = ESTADO_CONFIG[est]
                  return (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 font-mono text-xs font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {cfg.label}
                    </span>
                  )
                })()}
              </div>

              {/* Barra de progreso visual del trámite */}
              <div className="rounded-xl bg-paper p-5 border border-ink/5">
                <p className="text-xs font-semibold text-ink mb-3">Línea de Vida del Trámite</p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="space-y-1.5">
                    <div className="h-2 rounded-full bg-girverde" />
                    <span className="font-medium text-ink block">1. Radicación</span>
                    <span className="font-mono text-[10px] text-ink-faint">{formatFecha(buscado.fechaRadicacion)}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 rounded-full bg-vinotinto" />
                    <span className="font-medium text-ink block">2. En Trámite</span>
                    <span className="text-[10px] text-ink-faint">{buscado.dependencia}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className={`h-2 rounded-full ${buscado.estado === 'Resuelta' ? 'bg-girverde' : 'bg-ink/15'}`} />
                    <span className="font-medium text-ink block">3. Respuesta</span>
                    <span className="text-[10px] text-ink-faint">
                      {buscado.fechaRespuesta ? formatFecha(buscado.fechaRespuesta) : 'Pendiente'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grilla detallada de datos administrativos */}
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-ink/5 bg-paper p-5 text-xs">
                <div>
                  <dt className="text-ink-faint">Tipo de Solicitud</dt>
                  <dd className="font-semibold text-ink text-sm mt-0.5">{buscado.tipo}</dd>
                </div>
                <div>
                  <dt className="text-ink-faint">Dependencia a Cargo</dt>
                  <dd className="font-semibold text-ink text-sm mt-0.5">{buscado.dependencia}</dd>
                </div>
                <div>
                  <dt className="text-ink-faint">Peticionario Registrado</dt>
                  <dd className="font-medium text-ink mt-0.5">{buscado.solicitante}</dd>
                </div>
                <div>
                  <dt className="text-ink-faint">Documento de Identidad</dt>
                  <dd className="font-mono text-ink mt-0.5">{buscado.documentoSolicitante}</dd>
                </div>
                <div>
                  <dt className="text-ink-faint">Fecha de Radicación</dt>
                  <dd className="font-mono text-ink mt-0.5">{formatFecha(buscado.fechaRadicacion)}</dd>
                </div>
                <div>
                  <dt className="text-ink-faint">Fecha Límite Legal</dt>
                  <dd className="font-mono font-semibold text-vinotinto mt-0.5">{formatFecha(buscado.fechaLimite)}</dd>
                </div>

                {buscado.fechaRespuesta && (
                  <div className="sm:col-span-2 pt-3 border-t border-ink/5">
                    <dt className="text-ink-faint">Fecha de Respuesta Oficial</dt>
                    <dd className="font-mono font-semibold text-girverde-deep text-sm mt-0.5">
                      {formatFecha(buscado.fechaRespuesta)}
                    </dd>
                  </div>
                )}

                {buscado.archivoAdjunto && (
                  <div className="sm:col-span-2 pt-2 border-t border-ink/5">
                    <dt className="text-ink-faint">Soporte Adjunto por el Peticionario</dt>
                    <dd className="font-mono text-xs text-ink mt-0.5 flex items-center gap-1.5">
                      <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      </svg>
                      {buscado.archivoAdjunto}
                    </dd>
                  </div>
                )}
              </dl>

              {/* Acciones para el expediente */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-ghost text-xs"
                >
                  <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  Imprimir Constancia
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBuscado(undefined)
                    setRadicado('')
                  }}
                  className="font-mono text-xs text-vinotinto hover:underline"
                >
                  Nueva consulta →
                </button>
              </div>
            </div>
          )}

          {/* Guía informativa de proceso cuando no hay búsqueda activa */}
          {buscado === undefined && (
            <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 sm:p-8 shadow-card space-y-6">
              <div className="border-b border-ink/5 pb-4">
                <h3 className="font-display font-semibold text-lg text-ink">
                  ¿Cómo funciona el ciclo de atención de una PQRS?
                </h3>
                <p className="text-xs text-ink-faint mt-1">
                  Cada solicitud radicada en la Alcaldía de Girón cumple con el siguiente procedimiento normativo:
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 text-xs">
                <div className="rounded-xl bg-paper p-4 border border-ink/5 space-y-2">
                  <span className="font-mono font-bold text-xs text-vinotinto bg-vinotinto/10 px-2 py-0.5 rounded">
                    Fase 1
                  </span>
                  <h4 className="font-semibold text-ink text-sm">Recepción Oficial</h4>
                  <p className="text-ink-faint leading-relaxed">
                    Se genera el sello de tiempo digital y se asigna el radicado único para salvaguardar los derechos del ciudadano.
                  </p>
                </div>

                <div className="rounded-xl bg-paper p-4 border border-ink/5 space-y-2">
                  <span className="font-mono font-bold text-xs text-ocre-deep bg-dorado/15 px-2 py-0.5 rounded">
                    Fase 2
                  </span>
                  <h4 className="font-semibold text-ink text-sm">Reparto y Trámite</h4>
                  <p className="text-ink-faint leading-relaxed">
                    La dependencia correspondiente analiza la documentación, hace visitas técnicas o prepara la resolución jurídica.
                  </p>
                </div>

                <div className="rounded-xl bg-paper p-4 border border-ink/5 space-y-2">
                  <span className="font-mono font-bold text-xs text-girverde-deep bg-girverde/15 px-2 py-0.5 rounded">
                    Fase 3
                  </span>
                  <h4 className="font-semibold text-ink text-sm">Notificación Final</h4>
                  <p className="text-ink-faint leading-relaxed">
                    Se expide la respuesta formal de fondo y queda disponible en la plataforma para consulta y descarga.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Columna Lateral: Panel de Ayuda y Semáforo Normativo (4 columnas) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Significado del semáforo institucional */}
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-4">
            <h3 className="font-display font-semibold text-sm text-ink">Semáforo de Términos Legales</h3>
            <p className="text-xs text-ink-faint">
              Estados en los que puede figurar una solicitud según el cumplimiento de plazos:
            </p>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-semaforo-amarillo/30 bg-semaforo-amarillo/5 p-3">
                <div className="flex items-center gap-2 font-semibold text-semaforo-amarillo">
                  <span className="h-2.5 w-2.5 rounded-full bg-semaforo-amarillo" />
                  <span>En Proceso</span>
                </div>
                <p className="text-ink-faint mt-1 text-[11px] leading-relaxed">
                  La petición se encuentra dentro de los 15 o 30 días hábiles concedidos por la ley.
                </p>
              </div>

              <div className="rounded-xl border border-semaforo-verde/30 bg-semaforo-verde/5 p-3">
                <div className="flex items-center gap-2 font-semibold text-semaforo-verde">
                  <span className="h-2.5 w-2.5 rounded-full bg-semaforo-verde" />
                  <span>Resuelta</span>
                </div>
                <p className="text-ink-faint mt-1 text-[11px] leading-relaxed">
                  La administración municipal ha emitido la respuesta de fondo formal.
                </p>
              </div>

              <div className="rounded-xl border border-semaforo-rojo/30 bg-semaforo-rojo/5 p-3">
                <div className="flex items-center gap-2 font-semibold text-semaforo-rojo">
                  <span className="h-2.5 w-2.5 rounded-full bg-semaforo-rojo" />
                  <span>Término Vencido</span>
                </div>
                <p className="text-ink-faint mt-1 text-[11px] leading-relaxed">
                  Se ha superado el plazo legal. Da lugar a requerimiento prioritario o acción de tutela.
                </p>
              </div>
            </div>
          </div>

          {/* Dónde encontrar el radicado */}
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-3 text-xs">
            <h3 className="font-display font-semibold text-sm text-ink">¿Dónde ubicar su radicado?</h3>
            <p className="text-ink-faint leading-relaxed">
              El número de radicado se encuentra en la esquina superior del comprobante emitido tras radicar:
            </p>
            <div className="rounded-lg bg-paper p-3 border border-ink/5 font-mono text-center text-xs text-vinotinto font-semibold">
              PQRS-2026-XXXXXX
            </div>
            <p className="text-[11px] text-ink-faint">
              Si radicó presencialmente, figura en la etiqueta adhesiva entregada en ventanilla única.
            </p>
          </div>

          {/* Contacto directo con personería */}
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-3 text-xs">
            <h3 className="font-display font-semibold text-sm text-ink">Vigilancia y Control</h3>
            <p className="text-ink-faint leading-relaxed">
              La <strong>Personería Municipal de San Juan Girón</strong> vigila el estricto cumplimiento de los términos de respuesta a los ciudadanos.
            </p>
            <div className="pt-2 border-t border-ink/5">
              <span className="text-ink-faint block">Atención ciudadana:</span>
              <span className="font-mono font-semibold text-ink">+57 (607) 646 3030 Ext. 102</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
