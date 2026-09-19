import { useState } from 'react'
import CustomSelect from '../../../components/CustomSelect'

const TRAMITES_URBANISTICOS = [
  { value: 'uso-suelo', label: 'Concepto y Certificado de Uso de Suelo', tiempo: '5 días hábiles' },
  { value: 'norma-demarcacion', label: 'Concepto de Norma Urbanística y Demarcación', tiempo: '8 días hábiles' },
  { value: 'licencia-construccion', label: 'Aprobación de Planos y Licencia de Construcción', tiempo: '15 días hábiles' },
]

const SECTORES_GIRON = [
  'Centro Histórico (Monumento Nacional)',
  'El Poblado (Comuna 1)',
  'Rincón de Girón (Comuna 2)',
  'Bellavista y San Antonio',
  'Nuevo Girón y Portal Campestre',
  'Zona Rural / Acapulco',
]

export default function SecretariaOrdenamientoView() {
  const [tramite, setTramite] = useState('uso-suelo')
  const [sector, setSector] = useState(SECTORES_GIRON[0])
  const [direccion, setDireccion] = useState('Carrera 25 No. 30-15')
  const [actividadPropuesta, setActividadPropuesta] = useState('Restaurante y cafetería típica')
  const [resultadoPredictamen, setResultadoPredictamen] = useState<{
    permitido: boolean
    norma: string
    requisitos: string[]
    codigoSolicitud: string
  } | null>(null)

  function handlePreclasificar(e: React.FormEvent) {
    e.preventDefault()
    const esCentro = sector.includes('Centro Histórico')

    setResultadoPredictamen({
      permitido: true,
      norma: esCentro
        ? 'EOT Girón - Zona de Conservación Histórica (Uso compatible de servicios gastronómicos bajo condiciones de fachada colonial).'
        : 'EOT Girón - Zona Mixta de Comercio y Servicios Tipo 1 (Totalmente Permitido).',
      requisitos: esCentro
        ? [
            'Certificado de Libertad y Tradición (menor a 30 días)',
            'Paz y Salvo de Impuesto Predial 2026',
            'Autorización del Consejo Municipal de Patrimonio para adecuaciones de fachada',
          ]
        : [
            'Certificado de Libertad y Tradición (menor a 30 días)',
            'Paz y Salvo de Impuesto Predial 2026',
            'Plano básico de localización catastral',
          ],
      codigoSolicitud: `SOT-PRE-${Date.now().toString().slice(-6)}`,
    })
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Cabecera de Ordenamiento */}
      <section className="relative overflow-hidden rounded-3xl border border-ink/8 bg-paper-card p-6 sm:p-10 shadow-card">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-vinotinto/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-dorado/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-vinotinto/15 bg-vinotinto-soft px-3.5 py-1 text-xs font-semibold text-vinotinto">
            <span className="h-1.5 w-1.5 rounded-full bg-vinotinto" />
            Secretaría de Ordenamiento Territorial · Propuesta Técnica IA 07
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Secretaría de Ordenamiento Territorial
          </h1>

          <p className="mt-3 text-base leading-relaxed text-ink-faint">
            Catálogo digital de trámites urbanísticos, asistente interactivo de preclasificación de uso de suelo conforme al EOT y gestión de licencias.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ink-faint pt-4 border-t border-ink/5">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>(607) 646 3030 Ext. 240</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              </svg>
              <span>ordenamiento@giron-santander.gov.co</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Palacio Municipal, Tercer Piso</span>
            </div>
          </div>
        </div>
      </section>

      {/* Asistente de Preclasificación de Trámites Urbanísticos */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="eyebrow text-vinotinto">Propuesta Técnica 07</span>
            <h2 className="font-display text-2xl font-bold text-ink">
              Asistente de Uso de Suelo y Trámites EOT
            </h2>
            <p className="text-xs text-ink-faint mt-1">
              Consulte previamente la viabilidad normativa de su proyecto comercial o residencial y obtenga la lista exacta de requisitos exigidos por el municipio.
            </p>
          </div>

          <form onSubmit={handlePreclasificar} className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Trámite Requerido *</label>
              <CustomSelect
                value={tramite}
                onChange={setTramite}
                options={TRAMITES_URBANISTICOS}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">Sector o Barrio de Girón *</label>
                <CustomSelect
                  value={sector}
                  onChange={setSector}
                  options={SECTORES_GIRON}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">Dirección del Predio *</label>
                <input
                  required
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="field text-xs"
                  placeholder="Ej. Carrera 25 No. 30-15"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Actividad Comercial o Destinación *</label>
              <input
                required
                value={actividadPropuesta}
                onChange={(e) => setActividadPropuesta(e.target.value)}
                className="field text-xs"
                placeholder="Ej. Restaurante, droguería, consultorio, vivienda bifamiliar..."
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button type="submit" className="btn-vinotinto text-xs px-6">
                Consultar Viabilidad Normativa
              </button>
            </div>
          </form>
        </div>

        {/* Panel de resultado de preclasificación */}
        <aside className="lg:col-span-5 space-y-6">
          {resultadoPredictamen ? (
            <div className="rounded-2xl border border-girverde/30 bg-paper-card p-6 shadow-card space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-ink/8 pb-3">
                <span className="font-mono text-xs text-girverde-deep bg-girverde/10 px-2.5 py-0.5 rounded font-bold">
                  Pre-dictamen: Viable
                </span>
                <span className="font-mono text-xs text-ink-faint">{resultadoPredictamen.codigoSolicitud}</span>
              </div>

              <div className="space-y-1">
                <h4 className="font-display font-semibold text-sm text-ink">Evaluación Normativa EOT</h4>
                <p className="text-xs text-ink-soft leading-relaxed bg-paper p-3 rounded-xl border border-ink/5">
                  {resultadoPredictamen.norma}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-display font-semibold text-xs text-ink uppercase tracking-wider">
                  Checklist de Requisitos para Radicar:
                </h4>
                <ul className="space-y-1.5 text-xs text-ink-soft">
                  {resultadoPredictamen.requisitos.map((req) => (
                    <li key={req} className="flex items-start gap-2">
                      <svg className="h-3.5 w-3.5 text-girverde-deep shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-ink/5">
                <Link
                  to="/ciudadano/radicar"
                  className="btn-vinotinto text-xs w-full text-center block"
                >
                  Radicar Solicitud Oficial con este Pre-dictamen
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card text-xs space-y-3">
              <h4 className="font-display font-semibold text-sm text-ink">Marco Normativo de Girón</h4>
              <p className="text-ink-faint leading-relaxed">
                El Esquema de Ordenamiento Territorial (EOT) y el Plan Especial de Manejo y Protección (PEMP) del Centro Histórico protegen la vocación colonial del Monumento Nacional.
              </p>
              <div className="p-3 bg-paper rounded-xl border border-ink/5 space-y-1 font-mono text-[11px] text-ink-faint">
                <p>Término legal Concepto Uso Suelo: 5 días</p>
                <p>Vigencia del concepto: 2 años</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
