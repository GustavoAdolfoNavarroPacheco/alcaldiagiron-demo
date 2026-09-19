import { useState } from 'react'
import CustomSelect from '../../../components/CustomSelect'

const GRADOS = [
  'Transición (Preescolar)',
  'Primero a Quinto (Primaria)',
  'Sexto a Noveno (Básica Secundaria)',
  'Décimo y Once (Media Técnica)',
]

const COLEGIOS_OFICIALES = [
  {
    nombre: 'Colegio San Juan de Girón',
    sedes: 'Sede Principal y Sede A',
    cuposDisponibles: 42,
    direccion: 'Calle 28 No. 23-15',
  },
  {
    nombre: 'Colegio Nieves Cortés Picón',
    sedes: 'Sede A, B y C (El Poblado)',
    cuposDisponibles: 28,
    direccion: 'Carrera 26 No. 34-10',
  },
  {
    nombre: 'Colegio Francisco Serrano Muñoz',
    sedes: 'Sede Principal (Nuevo Girón)',
    cuposDisponibles: 55,
    direccion: 'Calle 18 No. 12-05',
  },
  {
    nombre: 'Colegio Facundo Navas Mantilla',
    sedes: 'Sede Bellavista',
    cuposDisponibles: 19,
    direccion: 'Carrera 22 No. 19-30',
  },
]

export default function SecretariaEducacionView() {
  const [grado, setGrado] = useState(GRADOS[0])
  const [alumno, setAlumno] = useState('')
  const [solicitudEnviada, setSolicitudEnviada] = useState<string | null>(null)

  function handleSolicitarCupo(e: React.FormEvent) {
    e.preventDefault()
    setSolicitudEnviada(`MAT-GIR-2026-${Date.now().toString().slice(-5)}`)
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Cabecera de Educación */}
      <section className="relative overflow-hidden rounded-3xl border border-ink/8 bg-paper-card p-6 sm:p-10 shadow-card">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-vinotinto/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-dorado/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-vinotinto/15 bg-vinotinto-soft px-3.5 py-1 text-xs font-semibold text-vinotinto">
            <span className="h-1.5 w-1.5 rounded-full bg-vinotinto" />
            Secretaría de Educación · Propuesta Técnica IA 01
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Secretaría de Educación
          </h1>

          <p className="mt-3 text-base leading-relaxed text-ink-faint">
            Acceso universal y cobertura en colegios públicos oficiales de Girón, trámites de matrícula y cupos escolares, y seguimiento ciudadano al Programa de Alimentación Escolar (PAE).
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ink-faint pt-4 border-t border-ink/5">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>(607) 646 3030 Ext. 215</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              </svg>
              <span>educacion@giron-santander.gov.co</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Calle 30 No. 25-66, Tercer Piso</span>
            </div>
          </div>
        </div>
      </section>

      {/* Consulta y Asignación de Cupos Escolares */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="eyebrow text-vinotinto">Matrículas 2026</span>
            <h2 className="font-display text-2xl font-bold text-ink">
              Solicitud de Cupo Escolar Oficial
            </h2>
            <p className="text-xs text-ink-faint mt-1">
              Inscriba a su hijo en cualquiera de las instituciones educativas públicas del municipio de forma 100% gratuita y sin intermediarios.
            </p>
          </div>

          {solicitudEnviada ? (
            <div className="rounded-2xl border border-girverde/30 bg-girverde/5 p-6 shadow-card space-y-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-girverde text-white">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base text-ink">Pre-matrícula Registrada</h3>
                  <p className="font-mono text-xs text-ink-faint">Código: {solicitudEnviada}</p>
                </div>
              </div>
              <p className="text-xs text-ink-soft">
                Se ha reservado disponibilidad para el grado <strong>{grado}</strong>. Presente el documento del estudiante en la secretaría del colegio seleccionado dentro de los 5 días hábiles siguientes.
              </p>
              <button
                type="button"
                onClick={() => setSolicitudEnviada(null)}
                className="btn-vinotinto text-xs"
              >
                Solicitar otro cupo
              </button>
            </div>
          ) : (
            <form onSubmit={handleSolicitarCupo} className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">Grado Escolar Solicitado *</label>
                <CustomSelect
                  value={grado}
                  onChange={setGrado}
                  options={GRADOS}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">Nombre Completo del Estudiante *</label>
                <input
                  required
                  value={alumno}
                  onChange={(e) => setAlumno(e.target.value)}
                  placeholder="Ej. Santiago Morales Duarte"
                  className="field text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button type="submit" className="btn-vinotinto text-xs px-6">
                  Verificar Disponibilidad y Solicitar Cupo
                </button>
              </div>
            </form>
          )}

          {/* Directorio de Colegios Públicos */}
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-sm text-ink">Colegios Oficiales con Cupos Disponibles</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {COLEGIOS_OFICIALES.map((col) => (
                <div key={col.nombre} className="rounded-xl border border-ink/8 bg-paper-card p-4 space-y-1.5 text-xs shadow-sm">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-ink">{col.nombre}</h4>
                    <span className="font-mono text-[10px] font-bold text-girverde-deep bg-girverde/10 px-2 py-0.5 rounded">
                      {col.cuposDisponibles} cupos
                    </span>
                  </div>
                  <p className="text-ink-faint text-[11px]">{col.sedes}</p>
                  <p className="text-ink-soft text-[11px] font-mono">{col.direccion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Veeduría PAE */}
        <aside className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-5 shadow-card text-xs space-y-3">
            <h4 className="font-display font-semibold text-sm text-ink">Programa de Alimentación Escolar (PAE)</h4>
            <p className="text-ink-faint leading-relaxed">
              Vigile la entrega oportuna y calidad de las raciones alimentarias escolares en Girón:
            </p>
            <div className="p-3 bg-paper rounded-xl border border-ink/5 space-y-1">
              <span className="font-semibold text-ink block">Cobertura PAE 2026: 100% oficial</span>
              <span className="text-[11px] text-ink-faint">Raciones calientes preparadas en sitio y refrigerios balanceados.</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
