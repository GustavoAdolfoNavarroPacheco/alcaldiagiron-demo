import { useState } from 'react'
import { addTramiteSecretaria, nextTramiteRadicado } from '../../../data/storage'

export default function SecretariaPlaneacionView() {
  const [predial, setPredial] = useState('01-02-0045-0012-000')
  const [certificadoGenerado, setCertificadoGenerado] = useState<{
    codigo: string
    estrato: number
    direccion: string
    propietario: string
  } | null>(null)

  function handleGenerarCertificado(e: React.FormEvent) {
    e.preventDefault()
    const codigo = nextTramiteRadicado('ESTRAT-GIR')
    const hoy = new Date().toISOString().slice(0, 10)

    addTramiteSecretaria('planeacion', {
      id: `pla-${Date.now()}`,
      radicado: codigo,
      titulo: 'Certificado de Estratificación Socioeconómica (Estrato 3)',
      solicitante: 'Carlos Eduardo Ramírez Flórez',
      documentoSolicitante: 'Ref. Predial: ' + predial,
      fecha: hoy,
      estado: 'Aprobado',
      prioridad: 'Baja',
      tipoTramite: 'Certificación de Estratificación',
      descripcion: `Expedición de estratificación para el predio con cédula catastral ${predial}.`,
    })

    setCertificadoGenerado({
      codigo,
      estrato: 3,
      direccion: 'Carrera 25 No. 30-15, Casco Urbano, Girón',
      propietario: 'Carlos Eduardo Ramírez Flórez',
    })
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Cabecera de Planeación */}
      <section className="relative overflow-hidden rounded-3xl border border-ink/8 bg-paper-card p-6 sm:p-10 shadow-card">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-vinotinto/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-dorado/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-vinotinto/15 bg-vinotinto-soft px-3.5 py-1 text-xs font-semibold text-vinotinto">
            <span className="h-1.5 w-1.5 rounded-full bg-vinotinto" />
            Secretaría de Planeación · Propuesta Técnica IA 04
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Secretaría de Planeación
          </h1>

          <p className="mt-3 text-base leading-relaxed text-ink-faint">
            Expedición digital e inmediata del Certificado de Estratificación Socioeconómica con validación QR, atención Sisbén IV y seguimiento al banco de proyectos de inversión.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ink-faint pt-4 border-t border-ink/5">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>(607) 646 3030 Ext. 230</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              </svg>
              <span>planeacion@giron-santander.gov.co</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Palacio Municipal, Segundo Piso</span>
            </div>
          </div>
        </div>
      </section>

      {/* Certificado de Estratificación Digital con QR */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="eyebrow text-vinotinto">Trámite Gratuito Inmediato</span>
            <h2 className="font-display text-2xl font-bold text-ink">
              Certificado de Estratificación Socioeconómica
            </h2>
            <p className="text-xs text-ink-faint mt-1">
              Genere el certificado oficial exigido para solicitud de subsidios de servicios públicos domiciliarios o matrículas de educación superior.
            </p>
          </div>

          <form onSubmit={handleGenerarCertificado} className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">
                Número de Referencia Catastral o Código Predial Nacional *
              </label>
              <input
                required
                value={predial}
                onChange={(e) => setPredial(e.target.value)}
                placeholder="Ej. 01-02-0045-0012-000"
                className="field font-mono text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button type="submit" className="btn-vinotinto text-xs px-6">
                Generar Certificado Oficial Digital
              </button>
            </div>
          </form>

          {/* Comprobante generado */}
          {certificadoGenerado && (
            <div className="rounded-2xl border-2 border-vinotinto/30 bg-paper-card p-6 shadow-card space-y-4 animate-fade-in text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-girverde/10 px-3 py-1 font-mono text-[11px] font-bold text-girverde-deep">
                Certificado Auténtico con Firma Digital
              </div>

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-ink/15 bg-white p-2 shadow-sm">
                <svg className="h-full w-full text-ink" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="4" y="4" width="4" height="4" />
                  <rect x="14" y="2" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="16" y="4" width="4" height="4" />
                  <rect x="2" y="14" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="4" y="16" width="4" height="4" />
                  <rect x="13" y="13" width="7" height="7" />
                </svg>
              </div>

              <p className="font-mono text-xs font-bold text-vinotinto">{certificadoGenerado.codigo}</p>

              <dl className="text-left text-xs space-y-1.5 bg-paper p-4 rounded-xl border border-ink/5">
                <div className="flex justify-between">
                  <span className="text-ink-faint">Estrato Socioeconómico:</span>
                  <span className="font-bold text-vinotinto text-sm">Estrato {certificadoGenerado.estrato}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Dirección Certificada:</span>
                  <span className="font-medium text-ink truncate max-w-[200px]">{certificadoGenerado.direccion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Titular Catastral:</span>
                  <span className="font-medium text-ink">{certificadoGenerado.propietario}</span>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => window.print()}
                className="btn-vinotinto text-xs w-full"
              >
                Descargar / Imprimir Certificado
              </button>
            </div>
          )}
        </div>

        {/* Sisbén IV Girón */}
        <aside className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-5 shadow-card text-xs space-y-3">
            <h3 className="font-display font-semibold text-sm text-ink">Sisbén IV en San Juan de Girón</h3>
            <p className="text-ink-faint leading-relaxed">
              La oficina de Sisbén atiende presencialmente de lunes a viernes en jornada continua.
            </p>
            <div className="p-3 bg-paper rounded-xl border border-ink/5 space-y-1">
              <span className="font-semibold text-ink block">Clasificaciones Nacionales:</span>
              <p className="text-[11px] text-ink-faint">Grupo A (Pobreza extrema), Grupo B (Pobreza moderada), Grupo C (Vulnerable), Grupo D (No vulnerable).</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
