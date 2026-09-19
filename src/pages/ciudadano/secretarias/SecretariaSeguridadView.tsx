import { useState } from 'react'
import CustomSelect from '../../../components/CustomSelect'
import { addTramiteSecretaria, nextTramiteRadicado } from '../../../data/storage'

const TIPOS_QUERELLA = [
  'Perturbación a la tranquilidad (Ruido excesivo o actividades molestas)',
  'Conflictos de linderos, muros divisorios o humedades',
  'Tenencia inadecuada de mascotas y caninos de manejo especial',
  'Ocupación indebida de espacio público o andenes',
]

const INSPECCIONES_GIRON = [
  { value: 'insp-1', label: 'Inspección Primera de Policía (Centro Histórico)' },
  { value: 'insp-2', label: 'Inspección Segunda de Policía (El Poblado)' },
  { value: 'insp-3', label: 'Inspección Tercera de Policía (Nuevo Girón)' },
]

export default function SecretariaSeguridadView() {
  const [tipoQuerella, setTipoQuerella] = useState(TIPOS_QUERELLA[0])
  const [inspeccion, setInspeccion] = useState('insp-1')
  const [querellante, setQuerellante] = useState('')
  const [querellado, setQuerellado] = useState('')
  const [hechos, setHechos] = useState('')
  const [querellaRadicada, setQuerellaRadicada] = useState<string | null>(null)

  function handleRadicarQuerella(e: React.FormEvent) {
    e.preventDefault()
    const codigo = nextTramiteRadicado('QRL-POL')
    const hoy = new Date().toISOString().slice(0, 10)
    addTramiteSecretaria('seguridad-gestion-riesgo', {
      id: `seg-${Date.now()}`,
      radicado: codigo,
      titulo: `Querella Policiva: ${tipoQuerella}`,
      solicitante: querellante.trim() || 'Ciudadano Querellante',
      documentoSolicitante: 'Cédula en expediente',
      fecha: hoy,
      estado: 'En Trámite',
      prioridad: 'Alta',
      tipoTramite: 'Querella Policiva / Convivencia',
      descripcion: `Contra: ${querellado || 'Sujeto Indeterminado'}. Hechos: ${hechos}. Asignada a: ${inspeccion}.`,
    })
    setQuerellaRadicada(codigo)
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Cabecera de Seguridad */}
      <section className="relative overflow-hidden rounded-3xl border border-ink/8 bg-paper-card p-6 sm:p-10 shadow-card">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-vinotinto/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-dorado/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-vinotinto/15 bg-vinotinto-soft px-3.5 py-1 text-xs font-semibold text-vinotinto">
            <span className="h-1.5 w-1.5 rounded-full bg-vinotinto" />
            Secretaría de Seguridad y Convivencia · Propuesta Técnica IA 07
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Secretaría de Seguridad, Convivencia y Gestión del Riesgo
          </h1>

          <p className="mt-3 text-base leading-relaxed text-ink-faint">
            Recepción y reparto de querellas policivas ciudadanas, resolución de conflictos de convivencia ante comisarías e inspecciones, y monitoreo de alertas de riesgo en Girón.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ink-faint pt-4 border-t border-ink/5">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>(607) 646 3030 Ext. 180</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              </svg>
              <span>seguridad@giron-santander.gov.co</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-semaforo-rojo">
              <span>Línea 123 Emergencias y Policía Nacional</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sistema de Radicación y Reparto de Querellas Policivas */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <div>
            <span className="eyebrow text-vinotinto">Propuesta Técnica 07</span>
            <h2 className="font-display text-2xl font-bold text-ink">
              Reparto y Radicación de Querella Policiva
            </h2>
            <p className="text-xs text-ink-faint mt-1">
              Diligencie los hechos para someter su caso a mediación o audiencia de conciliación ante la Inspección de Policía competente de Girón.
            </p>
          </div>

          {querellaRadicada ? (
            <div className="rounded-2xl border border-girverde/30 bg-girverde/5 p-6 shadow-card space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-girverde text-white">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-ink">Querella Asignada por Reparto</h3>
                  <p className="text-xs text-ink-faint">
                    Código de Expediente: <span className="font-mono font-bold text-ink">{querellaRadicada}</span>
                  </p>
                </div>
              </div>
              <p className="text-xs text-ink-soft leading-relaxed">
                El caso ha sido asignado al despacho de la inspección seleccionada. Ambas partes serán citadas a audiencia de mediación policial dentro de los 10 días hábiles siguientes conforme a la Ley 1801 de 2016 (Código Nacional de Policía).
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuerellaRadicada(null)
                  setHechos('')
                }}
                className="btn-vinotinto text-xs"
              >
                Radicar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleRadicarQuerella} className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">
                  Motivo de Convivencia Ciudadana *
                </label>
                <CustomSelect
                  value={tipoQuerella}
                  onChange={setTipoQuerella}
                  options={TIPOS_QUERELLA}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">
                  Inspección de Policía por Jurisdicción *
                </label>
                <CustomSelect
                  value={inspeccion}
                  onChange={setInspeccion}
                  options={INSPECCIONES_GIRON}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-ink mb-1.5">
                    Nombre del Solicitante / Afectado *
                  </label>
                  <input
                    required
                    value={querellante}
                    onChange={(e) => setQuerellante(e.target.value)}
                    className="field text-xs"
                    placeholder="Ej. Andrés Felipe Suárez"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1.5">
                    Nombre o Dirección de la Persona Querellada *
                  </label>
                  <input
                    required
                    value={querellado}
                    onChange={(e) => setQuerellado(e.target.value)}
                    className="field text-xs"
                    placeholder="Ej. Vecino Casa 14 / Calle 28 #25-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">
                  Descripción y Hechos que Motivan la Queja *
                </label>
                <textarea
                  required
                  rows={4}
                  value={hechos}
                  onChange={(e) => setHechos(e.target.value)}
                  placeholder="Relate fechas, horarios y afectaciones a la tranquilidad o convivencia..."
                  className="field text-xs resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button type="submit" className="btn-vinotinto text-xs px-6">
                  Radicar y Asignar por Reparto
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Panel de Alertas Tempranas de Gestión del Riesgo */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-5 shadow-card space-y-3">
            <h3 className="font-display font-semibold text-sm text-ink flex items-center gap-2">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>Alertas Tempranas de Riesgo</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-girverde/10 border border-girverde/20">
                <span className="font-semibold text-girverde-deep block">Río de Oro: Nivel Normal</span>
                <span className="text-[11px] text-ink-faint">Caudal monitoreado por estaciones telemétricas.</span>
              </div>
              <div className="p-3 rounded-xl bg-girverde/10 border border-girverde/20">
                <span className="font-semibold text-girverde-deep block">Quebrada Las Nieves: Estable</span>
                <span className="text-[11px] text-ink-faint">Limpieza de cauces y jarillones completada.</span>
              </div>
              <div className="p-3 rounded-xl bg-semaforo-amarillo/15 border border-semaforo-amarillo/30">
                <span className="font-semibold text-semaforo-amarillo block">Laderas: Alerta Preventiva</span>
                <span className="text-[11px] text-ink-faint">Vigilancia en sectores de ladera durante temporada de lluvias.</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
