import { useState } from 'react'
import { addTramiteSecretaria, nextTramiteRadicado } from '../../../data/storage'

export default function SecretariaDesarrolloView() {
  const [cedulaConsulta, setCedulaConsulta] = useState('63541289')
  const [resultadoSubsidio, setResultadoSubsidio] = useState<{
    nombre: string
    programa: string
    estado: string
    cicloPago: string
    puntoPago: string
    codigo: string
  } | null>(null)

  function handleConsultarSubsidio(e: React.FormEvent) {
    e.preventDefault()
    const codigo = nextTramiteRadicado('SUB-SOC')
    const hoy = new Date().toISOString().slice(0, 10)

    addTramiteSecretaria('desarrollo-social', {
      id: `soc-${Date.now()}`,
      radicado: codigo,
      titulo: 'Verificación Subsidio Adulto Mayor / Colombia Mayor',
      solicitante: 'Esperanza Gómez de Mantilla',
      documentoSolicitante: cedulaConsulta,
      fecha: hoy,
      estado: 'Aprobado',
      prioridad: 'Media',
      tipoTramite: 'Subsidio Social Adulto Mayor',
      descripcion: `Validación de giro para cédula ${cedulaConsulta}. Punto de cobro autorizado asignado en Efecty Parque Principal.`,
    })

    setResultadoSubsidio({
      nombre: 'Esperanza Gómez de Mantilla',
      programa: 'Programa Colombia Mayor · Girón',
      estado: 'Beneficiario Activo - Giro Disponible',
      cicloPago: 'Ciclo 09 - Septiembre 2026',
      puntoPago: 'Efecty Parque Principal Girón (Calle 30)',
      codigo,
    })
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Cabecera de Desarrollo Social */}
      <section className="relative overflow-hidden rounded-3xl border border-ink/8 bg-paper-card p-6 sm:p-10 shadow-card">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-vinotinto/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-dorado/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-vinotinto/15 bg-vinotinto-soft px-3.5 py-1 text-xs font-semibold text-vinotinto">
            <span className="h-1.5 w-1.5 rounded-full bg-vinotinto" />
            Secretaría de Desarrollo Social · Propuesta Técnica IA 05
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Secretaría de Desarrollo Social
          </h1>

          <p className="mt-3 text-base leading-relaxed text-ink-faint">
            Atención integral a población vulnerable, registro y liquidación de participaciones de la Mesa de Víctimas, y gestión de subsidios del Adulto Mayor en Girón.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ink-faint pt-4 border-t border-ink/5">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>(607) 646 3030 Ext. 225</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              </svg>
              <span>desarrollosocial@giron-santander.gov.co</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Casa de la Cultura y Desarrollo Social, Girón</span>
            </div>
          </div>
        </div>
      </section>

      {/* Módulo 1: Mesa de Víctimas & Módulo 2: Subsidios Adulto Mayor */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          {/* Consulta de beneficios y subsidios */}
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-4">
            <div>
              <span className="eyebrow text-vinotinto">Programas de Inclusión</span>
              <h2 className="font-display text-xl font-bold text-ink">
                Consulta de Subsidios (Adulto Mayor y Vulnerabilidad)
              </h2>
              <p className="text-xs text-ink-faint mt-1">
                Verifique si tiene giros disponibles del programa Colombia Mayor o apoyos municipales de alimentación.
              </p>
            </div>

            <form onSubmit={handleConsultarSubsidio} className="flex gap-2">
              <input
                required
                value={cedulaConsulta}
                onChange={(e) => setCedulaConsulta(e.target.value)}
                placeholder="Ingrese número de cédula..."
                className="field font-mono text-xs flex-1"
              />
              <button type="submit" className="btn-vinotinto text-xs px-5">
                Consultar Estado
              </button>
            </form>

            {resultadoSubsidio && (
              <div className="rounded-xl bg-paper p-4 border border-ink/8 space-y-2 text-xs animate-fade-in">
                <div className="flex justify-between items-center pb-2 border-b border-ink/5">
                  <span className="font-semibold text-ink">{resultadoSubsidio.nombre}</span>
                  <span className="font-mono text-[10px] font-bold text-girverde-deep bg-girverde/10 px-2 py-0.5 rounded">
                    {resultadoSubsidio.estado}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-ink-faint block">Programa:</span>
                    <span className="font-medium text-ink">{resultadoSubsidio.programa}</span>
                  </div>
                  <div>
                    <span className="text-ink-faint block">Periodo de Pago:</span>
                    <span className="font-medium text-ink">{resultadoSubsidio.cicloPago}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-ink/5">
                    <span className="text-ink-faint block">Punto Autorizado de Cobro:</span>
                    <span className="font-semibold text-vinotinto">{resultadoSubsidio.puntoPago}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mesa Municipal de Víctimas (Propuesta 05) */}
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-4">
            <div>
              <span className="eyebrow text-vinotinto">Propuesta Técnica 05</span>
              <h3 className="font-display font-semibold text-base text-ink">
                Mesa Municipal de Participación Efectiva de Víctimas
              </h3>
              <p className="text-xs text-ink-faint mt-1">
                Trazabilidad y liquidación transparente de valores reconocidos para representantes y delegados del conflicto armado en Girón.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-paper border border-ink/5">
                <div>
                  <p className="font-semibold text-ink">Sesión Ordinaria No. 04 - Mesa de Víctimas</p>
                  <p className="text-ink-faint text-[11px]">Enfoque de proyectos productivos y retornos rurales</p>
                </div>
                <span className="font-mono text-[10px] text-girverde-deep bg-girverde/10 px-2 py-0.5 rounded font-bold">
                  Acta Liquidada
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-paper border border-ink/5">
                <div>
                  <p className="font-semibold text-ink">Sesión Extraordinaria No. 02 - Plan de Acción Territorial</p>
                  <p className="text-ink-faint text-[11px]">Asignación presupuestal y subsidios de subsistencia</p>
                </div>
                <span className="font-mono text-[10px] text-girverde-deep bg-girverde/10 px-2 py-0.5 rounded font-bold">
                  Acta Liquidada
                </span>
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-5 shadow-card text-xs space-y-3">
            <h4 className="font-display font-semibold text-sm text-ink">Centros Vida del Adulto Mayor</h4>
            <p className="text-ink-faint leading-relaxed">
              La Alcaldía de Girón cuenta con sedes de Centro Vida que brindan alimentación, actividades físicas y chequeo médico preventivo:
            </p>
            <ul className="space-y-1.5 text-ink-soft">
              <li>· Centro Vida Sede Principal (Parque Principal)</li>
              <li>· Centro Vida El Poblado</li>
              <li>· Centro Vida Nuevo Girón</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
