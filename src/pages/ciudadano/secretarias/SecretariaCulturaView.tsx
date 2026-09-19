import { useState } from 'react'
import CustomSelect from '../../../components/CustomSelect'
import { addTramiteSecretaria, nextTramiteRadicado } from '../../../data/storage'

const TALLERES_ARTISTICOS = [
  'Música de Cuerda y Tiple Gironés',
  'Danzas Tradicionales y Folclore',
  'Pintura y Artes Plásticas Coloniales',
  'Teatro y Expresión Escénica',
  'Escuela Deportiva de Fútbol y Microfútbol',
  'Escuela de Patinaje en Pista Municipal',
]

const LUGARES_PATRIMONIALES = [
  {
    nombre: 'Basílica Menor San Juan Bautista',
    epoca: 'Siglo XVII',
    descripcion: 'Templo colonial de arquitectura religiosa y arte sacro en el Parque Principal.',
  },
  {
    nombre: 'Puente Calicanto',
    epoca: 'Construido en 1855',
    descripcion: 'Estructura colonial elaborada con argamasa, arena y clara de huevo sobre la quebrada.',
  },
  {
    nombre: 'Mansión del Fraile',
    epoca: 'Casona Histórica',
    descripcion: 'Lugar donde se redactaron documentos determinantes de la independencia.',
  },
  {
    nombre: 'Capilla de las Nieves',
    epoca: 'Construida en 1586',
    descripcion: 'Joya arquitectónica más antigua del casco colonial de Girón.',
  },
]

export default function SecretariaCulturaView() {
  const [taller, setTaller] = useState(TALLERES_ARTISTICOS[0])
  const [estudiante, setEstudiante] = useState('')
  const [edad, setEdad] = useState('14')
  const [inscripcionExitosa, setInscripcionExitosa] = useState(false)

  function handleInscribir(e: React.FormEvent) {
    e.preventDefault()
    const codigo = nextTramiteRadicado('CUL-FORM')
    const hoy = new Date().toISOString().slice(0, 10)

    addTramiteSecretaria('cultura-turismo-deporte', {
      id: `cul-${Date.now()}`,
      radicado: codigo,
      titulo: `Inscripción Cultural: ${taller}`,
      solicitante: estudiante.trim() || 'Estudiante Gironés',
      documentoSolicitante: `Edad: ${edad} años`,
      fecha: hoy,
      estado: 'Aprobado',
      prioridad: 'Baja',
      tipoTramite: 'Formación Cultural y Deportiva',
      descripcion: `Inscripción al taller ${taller} en Casa de la Cultura de Girón.`,
    })

    setInscripcionExitosa(true)
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Cabecera de Cultura, Turismo y Deporte */}
      <section className="relative overflow-hidden rounded-3xl border border-ink/8 bg-paper-card p-6 sm:p-10 shadow-card">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-vinotinto/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-dorado/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-vinotinto/15 bg-vinotinto-soft px-3.5 py-1 text-xs font-semibold text-vinotinto">
            <span className="h-1.5 w-1.5 rounded-full bg-vinotinto" />
            Secretaría de Cultura, Turismo y Deporte · Propuesta Técnica IA 06
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Secretaría de Cultura, Turismo y Deporte
          </h1>

          <p className="mt-3 text-base leading-relaxed text-ink-faint">
            Preservación del patrimonio histórico colonial de San Juan de Girón (Monumento Nacional), fomento de la actividad turística y programas de formación artística y deportiva.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ink-faint pt-4 border-t border-ink/5">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>(607) 646 3030 Ext. 310</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              </svg>
              <span>cultura@giron-santander.gov.co</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Casa de la Cultura Francisco Mantilla de los Ríos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Escuelas de Formación y Patrimonio */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="eyebrow text-vinotinto">Convocatoria 2026</span>
            <h2 className="font-display text-2xl font-bold text-ink">
              Inscripción a Escuelas Artísticas y Deportivas
            </h2>
            <p className="text-xs text-ink-faint mt-1">
              Programas formativos 100% gratuitos financiados a través de la Estampilla Pro-Cultura y Deporte de Girón para niños y jóvenes.
            </p>
          </div>

          {inscripcionExitosa ? (
            <div className="rounded-2xl border border-girverde/30 bg-girverde/5 p-6 shadow-card space-y-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-girverde text-white">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base text-ink">Inscripción Pre-Aprobada</h3>
                  <p className="font-mono text-xs text-ink-faint">Código: ESC-GIR-{Date.now().toString().slice(-5)}</p>
                </div>
              </div>
              <p className="text-xs text-ink-soft">
                El estudiante <strong>{estudiante}</strong> ha quedado registrado en <strong>{taller}</strong>. Presente copia del documento de identidad en la Casa de la Cultura de Girón para legalizar el cupo.
              </p>
              <button
                type="button"
                onClick={() => {
                  setInscripcionExitosa(false)
                  setEstudiante('')
                }}
                className="btn-vinotinto text-xs"
              >
                Inscribir otro participante
              </button>
            </div>
          ) : (
            <form onSubmit={handleInscribir} className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">Escuela / Taller Deseado *</label>
                <CustomSelect
                  value={taller}
                  onChange={setTaller}
                  options={TALLERES_ARTISTICOS}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-ink mb-1.5">Nombre del Participante *</label>
                  <input
                    required
                    value={estudiante}
                    onChange={(e) => setEstudiante(e.target.value)}
                    placeholder="Ej. Valentina Gómez"
                    className="field text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1.5">Edad *</label>
                  <input
                    type="number"
                    required
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                    className="field font-mono text-xs"
                    min="5"
                    max="80"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button type="submit" className="btn-vinotinto text-xs px-6">
                  Completar Inscripción Gratuita
                </button>
              </div>
            </form>
          )}

          {/* Patrimonio Monumento Nacional */}
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-sm text-ink">Patrimonio Histórico de Girón</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {LUGARES_PATRIMONIALES.map((lugar) => (
                <div key={lugar.nombre} className="rounded-xl border border-ink/8 bg-paper-card p-4 space-y-1 text-xs shadow-sm">
                  <h4 className="font-semibold text-ink">{lugar.nombre}</h4>
                  <span className="font-mono text-[10px] text-vinotinto font-semibold block">{lugar.epoca}</span>
                  <p className="text-ink-faint text-[11px] leading-relaxed">{lugar.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Permisos de Rodaje y Eventos */}
        <aside className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-5 shadow-card text-xs space-y-3">
            <h4 className="font-display font-semibold text-sm text-ink">Permisos de Filmación y Eventos</h4>
            <p className="text-ink-faint leading-relaxed">
              Cualquier rodaje publicitario, película o evento público en el Centro Histórico requiere autorización patrimonial de la Secretaría de Cultura.
            </p>
            <div className="p-3 bg-paper rounded-xl border border-ink/5 space-y-1 font-mono text-[11px] text-ink-faint">
              <p>Término de estudio: 8 días hábiles</p>
              <p>Compromiso: Protección de andenes y fachadas blancas</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
