import { useState } from 'react'
import CustomSelect from '../../../components/CustomSelect'
import { addTramiteSecretaria, nextTramiteRadicado } from '../../../data/storage'

const TIPOS_DANO = [
  'Hueco / Bache en malla vial vehicular',
  'Luminaria de alumbrado público apagada o intermitente',
  'Tapa de alcantarillado dañada o hundida',
  'Deterioro de andén peatonal o puente colonial',
]

const OBRAS_GIRON = [
  {
    proyecto: 'Rehabilitación y Pavimentación Malla Vial El Poblado',
    tramo: 'Calle 33 entre Carreras 20 y 26',
    avance: 78,
    fechaEntrega: 'Noviembre 2026',
    estado: 'En Ejecución Activa',
  },
  {
    proyecto: 'Modernización Alumbrado LED Centro Histórico',
    tramo: 'Entorno Parque Principal y Calles Coloniales',
    avance: 95,
    fechaEntrega: 'Octubre 2026',
    estado: 'Fase Final de Pruebas',
  },
  {
    proyecto: 'Mantenimiento y Dragado Quebrada Las Nieves',
    tramo: 'Sector Puente Calicanto hasta desembocadura',
    avance: 60,
    fechaEntrega: 'Diciembre 2026',
    estado: 'En Ejecución Activa',
  },
]

export default function SecretariaInfraestructuraView() {
  const [tipoReporte, setTipoReporte] = useState(TIPOS_DANO[0])
  const [barrio, setBarrio] = useState('')
  const [direccion, setDireccion] = useState('')
  const [ticketGenerado, setTicketGenerado] = useState<string | null>(null)

  function handleEnviarReporte(e: React.FormEvent) {
    e.preventDefault()
    const codigo = nextTramiteRadicado('OBR-REP')
    const hoy = new Date().toISOString().slice(0, 10)
    addTramiteSecretaria('infraestructura', {
      id: `inf-${Date.now()}`,
      radicado: codigo,
      titulo: `Reporte Ciudadano: ${tipoReporte}`,
      solicitante: barrio ? `Comunidad Barrio ${barrio}` : 'Ciudadano Vecino de Girón',
      documentoSolicitante: 'Reporte Web Ciudadano',
      fecha: hoy,
      estado: 'En Revisión',
      prioridad: 'Alta',
      tipoTramite: 'Mantenimiento de Malla Vial y Alumbrado',
      descripcion: `Tipo de reporte: ${tipoReporte}. Ubicación: Barrio ${barrio || 'No especificado'}, Dirección: ${direccion || 'No aportada'}.`,
    })
    setTicketGenerado(codigo)
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Cabecera de Infraestructura */}
      <section className="relative overflow-hidden rounded-3xl border border-ink/8 bg-paper-card p-6 sm:p-10 shadow-card">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-vinotinto/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-dorado/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-vinotinto/15 bg-vinotinto-soft px-3.5 py-1 text-xs font-semibold text-vinotinto">
            <span className="h-1.5 w-1.5 rounded-full bg-vinotinto" />
            Secretaría de Infraestructura · Propuesta Técnica IA 01
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Secretaría de Infraestructura
          </h1>

          <p className="mt-3 text-base leading-relaxed text-ink-faint">
            Mantenimiento de la malla vial urbana y rural, alumbrado público, obras de mitigación y seguimiento ciudadano a proyectos de inversión pública en Girón.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ink-faint pt-4 border-t border-ink/5">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>(607) 646 3030 Ext. 250</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              </svg>
              <span>infraestructura@giron-santander.gov.co</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Edificio de Obras Públicas, Girón</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reporta tu Vía & Visor de Obras */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="eyebrow text-vinotinto">Atención Comunitaria</span>
            <h2 className="font-display text-2xl font-bold text-ink">
              Reporta una Falla Vial o de Alumbrado Público
            </h2>
            <p className="text-xs text-ink-faint mt-1">
              Genere una orden de inspección técnica inmediata para reparar huecos en vías, luminarias apagadas o afectaciones peatonales.
            </p>
          </div>

          {ticketGenerado ? (
            <div className="rounded-2xl border border-girverde/30 bg-girverde/5 p-6 shadow-card space-y-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-girverde text-white">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base text-ink">Reporte Registrado</h3>
                  <p className="font-mono text-xs text-ink-faint">Orden de Trabajo: {ticketGenerado}</p>
                </div>
              </div>
              <p className="text-xs text-ink-soft">
                La cuadrilla de mantenimiento vial o de alumbrado ha recibido la solicitud para programar visita técnica en <strong>{barrio}</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setTicketGenerado(null)
                  setDireccion('')
                  setBarrio('')
                }}
                className="btn-vinotinto text-xs"
              >
                Hacer otro reporte
              </button>
            </div>
          ) : (
            <form onSubmit={handleEnviarReporte} className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">Tipo de Incidencia o Daño *</label>
                <CustomSelect
                  value={tipoReporte}
                  onChange={setTipoReporte}
                  options={TIPOS_DANO}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-ink mb-1.5">Barrio o Sector *</label>
                  <input
                    required
                    value={barrio}
                    onChange={(e) => setBarrio(e.target.value)}
                    placeholder="Ej. Rincón de Girón"
                    className="field text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1.5">Dirección o Referencia Exacta *</label>
                  <input
                    required
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Ej. Calle 14 con Carrera 19 frente al parque"
                    className="field text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button type="submit" className="btn-vinotinto text-xs px-6">
                  Enviar Reporte a Cuadrilla Técnica
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Visor de Obras en Ejecución */}
        <aside className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-5 shadow-card space-y-3">
            <h3 className="font-display font-semibold text-sm text-ink">Obras Públicas en Ejecución</h3>
            <div className="space-y-3">
              {OBRAS_GIRON.map((obra) => (
                <div key={obra.proyecto} className="p-3 bg-paper rounded-xl border border-ink/5 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-ink leading-snug">{obra.proyecto}</h4>
                    <span className="font-mono text-[10px] font-bold text-girverde-deep bg-girverde/10 px-2 py-0.5 rounded">
                      {obra.avance}%
                    </span>
                  </div>
                  <p className="text-ink-faint text-[11px]">{obra.tramo}</p>
                  <div className="w-full bg-ink/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-vinotinto h-full rounded-full" style={{ width: `${obra.avance}%` }} />
                  </div>
                  <span className="text-[10px] text-ink-faint block">Entrega estimada: {obra.fechaEntrega}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
