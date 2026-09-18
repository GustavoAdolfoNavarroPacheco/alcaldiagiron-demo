import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getDeudores, getPQRS } from '../../data/storage'
import { nivelUrgenciaDeudor, auditoriaPQRS } from '../../types'
import { formatCOP } from '../../data/format'

export default function AdminResumen() {
  const deudores = useMemo(() => getDeudores(), [])
  const pqrs = useMemo(() => getPQRS(), [])

  const carteraTotal = deudores.reduce((sum, d) => sum + d.valorCapital + d.valorIntereses, 0)
  const criticos = deudores.filter((d) => nivelUrgenciaDeudor(d) === 'rojo').length

  const auditorias = pqrs.map(auditoriaPQRS)
  const vencidas = auditorias.filter((a) => a === 'rojo').length
  const pendientes = auditorias.filter((a) => a === 'amarillo').length
  const cumplidas = auditorias.filter((a) => a === 'verde' || a === 'azul').length

  return (
    <div>
      <p className="eyebrow animate-fade-up text-ocre-deep">Panel administrador</p>
      <h1 className="delay-1 mt-3 animate-fade-up font-display text-3xl font-medium text-ink">
        Resumen consolidado
      </h1>
      <p className="delay-2 mt-2 max-w-xl animate-fade-up text-sm leading-relaxed text-ink-faint">
        Cartera de cobro coactivo y ventanilla única de PQRS, en un mismo
        expediente por ciudadano.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          delay="delay-1"
          eyebrow="Cobro coactivo"
          value={formatCOP(carteraTotal)}
          detail={`${deudores.length} deudores en proceso`}
          accent="border-ocre"
        />
        <StatTile
          delay="delay-2"
          eyebrow="Cartera crítica"
          value={String(criticos)}
          detail="Deudores en nivel rojo"
          accent="border-semaforo-rojo"
        />
        <StatTile
          delay="delay-3"
          eyebrow="PQRS vencidas"
          value={String(vencidas)}
          detail="Fuera de término, sin respuesta"
          accent="border-semaforo-rojo"
        />
        <StatTile
          delay="delay-4"
          eyebrow="PQRS pendientes"
          value={String(pendientes)}
          detail="Dentro del plazo legal"
          accent="border-semaforo-amarillo"
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Link
          to="/admin/cobro-coactivo"
          className="card-lift delay-3 group flex animate-fade-up flex-col justify-between rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card hover:border-ocre/40 hover:shadow-glow"
        >
          <div>
            <h2 className="font-display text-xl font-medium text-ink">Módulo de Cobro Coactivo</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-faint">
              Tabla de deudores clasificada por semáforo de cuantía. Abra una
              fila para ver la ficha consolidada del deudor.
            </p>
          </div>
          <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ocre-deep">
            Ir al módulo <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </span>
        </Link>

        <Link
          to="/admin/ventanilla-unica"
          className="card-lift delay-4 group flex animate-fade-up flex-col justify-between rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card hover:border-girverde/40 hover:shadow-glow-verde"
        >
          <div>
            <h2 className="font-display text-xl font-medium text-ink">Gestión de Ventanilla Única</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-faint">
              {cumplidas} de {pqrs.length} PQRS cumplidas. Auditoría de tiempos
              por color según los términos de ley.
            </p>
          </div>
          <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-girverde-deep">
            Ir al módulo <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </span>
        </Link>
      </div>
    </div>
  )
}

function StatTile({
  eyebrow,
  value,
  detail,
  accent,
  delay,
}: {
  eyebrow: string
  value: string
  detail: string
  accent: string
  delay: string
}) {
  return (
    <div
      className={`card-lift ${delay} animate-fade-up rounded-2xl border-l-[3px] ${accent} border-y border-r border-ink/8 bg-paper-card p-5 shadow-card`}
    >
      <p className="eyebrow">{eyebrow}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-xs text-ink-faint">{detail}</p>
    </div>
  )
}
