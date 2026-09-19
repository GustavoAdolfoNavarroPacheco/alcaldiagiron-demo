import { useState } from 'react'

const ACTAS_COMITES = [
  {
    codigo: 'ACT-COMPOS-2026-03',
    comite: 'Consejo Municipal de Política Social (COMPOS)',
    fecha: '2026-08-20',
    tema: 'Priorización de recursos para comedores infantiles y primera infancia en Girón.',
    compromisos: '4 compromisos asignados',
  },
  {
    codigo: 'ACT-SEG-2026-08',
    comite: 'Consejo Extraordinario de Seguridad',
    fecha: '2026-08-12',
    tema: 'Plan desarme y operativos nocturnos de convivencia en el casco urbano.',
    compromisos: '6 compromisos asignados',
  },
  {
    codigo: 'ACT-JAC-2026-05',
    comite: 'Mesa de Concertación con Juntas de Acción Comunal',
    fecha: '2026-07-28',
    tema: 'Mantenimiento de polideportivos barriales y alumbrado público comunal.',
    compromisos: '5 compromisos asignados',
  },
]

export default function SecretariaGobiernoView() {
  const [jacBarrio, setJacBarrio] = useState('JAC Barrio El Poblado')
  const [certificadoGenerado, setCertificadoGenerado] = useState(false)

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Cabecera de Gobierno */}
      <section className="relative overflow-hidden rounded-3xl border border-ink/8 bg-paper-card p-6 sm:p-10 shadow-card">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-vinotinto/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-dorado/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-vinotinto/15 bg-vinotinto-soft px-3.5 py-1 text-xs font-semibold text-vinotinto">
            <span className="h-1.5 w-1.5 rounded-full bg-vinotinto" />
            Secretaría de Gobierno · Propuesta Técnica IA 05
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Secretaría de Gobierno
          </h1>

          <p className="mt-3 text-base leading-relaxed text-ink-faint">
            Repositorio y trazabilidad de comités y actas comunitarias asistidas por IA, fortalecimiento comunal (JAC) y gobernabilidad institucional.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ink-faint pt-4 border-t border-ink/5">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>(607) 646 3030 Ext. 104</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              </svg>
              <span>gobierno@giron-santander.gov.co</span>
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

      {/* Actas de Comités & Certificados de Juntas de Acción Comunal */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <div>
            <span className="eyebrow text-vinotinto">Propuesta Técnica 05</span>
            <h2 className="font-display text-2xl font-bold text-ink">
              Repositorio de Actas y Compromisos Comunitarios
            </h2>
            <p className="text-xs text-ink-faint mt-1">
              Consulte las decisiones, actas oficiales y estado de los compromisos adquiridos en las mesas sociales de la administración municipal.
            </p>
          </div>

          <div className="space-y-3">
            {ACTAS_COMITES.map((acta) => (
              <div key={acta.codigo} className="rounded-2xl border border-ink/8 bg-paper-card p-5 shadow-card space-y-2 hover:border-vinotinto/30 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-vinotinto">{acta.codigo}</span>
                  <span className="font-mono text-[10px] text-ink-faint">Fecha de Sesión: {acta.fecha}</span>
                </div>
                <h3 className="font-display font-semibold text-sm text-ink">{acta.comite}</h3>
                <p className="text-xs text-ink-soft leading-relaxed">{acta.tema}</p>
                <div className="pt-2 border-t border-ink/5 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-girverde-deep font-semibold">{acta.compromisos}</span>
                  <button type="button" onClick={() => window.print()} className="font-mono text-vinotinto hover:underline">
                    Descargar Acta Oficial →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          {/* Trámite JAC */}
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-5 shadow-card space-y-3 text-xs">
            <h3 className="font-display font-semibold text-sm text-ink">Juntas de Acción Comunal</h3>
            <p className="text-ink-faint leading-relaxed">
              Expedición del Certificado de Existencia y Representación Legal de dignatarios comunales:
            </p>

            <input
              value={jacBarrio}
              onChange={(e) => setJacBarrio(e.target.value)}
              className="field text-xs"
              placeholder="Nombre de la JAC..."
            />

            <button
              type="button"
              onClick={() => setCertificadoGenerado(true)}
              className="btn-vinotinto text-xs w-full"
            >
              Generar Certificado JAC con QR
            </button>

            {certificadoGenerado && (
              <div className="p-3 bg-girverde/10 border border-girverde/20 rounded-xl space-y-1 animate-fade-in text-center">
                <span className="font-mono font-bold text-girverde-deep block">Certificado Expedido</span>
                <span className="font-mono text-[10px] text-ink-faint">JAC-GIR-{Date.now().toString().slice(-6)}</span>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
