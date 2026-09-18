import { useMemo, useState } from 'react'
import { getPQRS } from '../../data/storage'
import { auditoriaPQRS, type AuditoriaPQRS, type PQRS } from '../../types'
import { formatFecha } from '../../data/format'
import { PQRSAuditoriaBadge } from '../../components/SemaforoBadge'

const FILTROS: { value: AuditoriaPQRS | 'todas'; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'rojo', label: 'Vencidas' },
  { value: 'amarillo', label: 'Pendientes' },
  { value: 'azul', label: 'Fuera de términos' },
  { value: 'verde', label: 'A tiempo' },
]

export default function VentanillaUnica() {
  const [items] = useState<PQRS[]>(() => getPQRS())
  const [filtro, setFiltro] = useState<AuditoriaPQRS | 'todas'>('todas')

  const conAuditoria = useMemo(
    () => items.map((p) => ({ pqrs: p, auditoria: auditoriaPQRS(p) })),
    [items],
  )

  const conteos = useMemo(() => {
    const base: Record<AuditoriaPQRS, number> = { rojo: 0, amarillo: 0, verde: 0, azul: 0 }
    conAuditoria.forEach(({ auditoria }) => {
      base[auditoria] += 1
    })
    return base
  }, [conAuditoria])

  const filtrados = conAuditoria
    .filter(({ auditoria }) => filtro === 'todas' || auditoria === filtro)
    .sort((a, b) => a.pqrs.fechaLimite.localeCompare(b.pqrs.fechaLimite))

  return (
    <div>
      <p className="eyebrow animate-fade-up text-girverde-deep">Ventanilla única</p>
      <h1 className="delay-1 mt-3 animate-fade-up font-display text-3xl font-medium text-ink">
        Gestión de PQRS entrantes
      </h1>
      <p className="delay-2 mt-2 max-w-2xl animate-fade-up text-sm leading-relaxed text-ink-faint">
        Auditoría de tiempos según los términos de ley: verde a tiempo, azul
        fuera de término, amarillo pendiente y rojo vencido.
      </p>

      <div className="delay-3 mt-6 flex animate-fade-up flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltro(f.value)}
            className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wide transition-all duration-200 ${
              filtro === f.value
                ? 'border-ink bg-ink text-paper shadow-md'
                : 'border-ink/15 text-ink-faint hover:-translate-y-0.5 hover:border-ink/30 hover:text-ink hover:shadow-sm'
            }`}
          >
            {f.label}
            {f.value !== 'todas' && <span className="ml-1.5 opacity-60">{conteos[f.value]}</span>}
          </button>
        ))}
      </div>

      <div className="delay-4 mt-6 animate-fade-up overflow-hidden rounded-2xl border border-ink/8 bg-paper-card shadow-card">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink-faint">
              <th className="px-5 py-3 font-medium">Radicado</th>
              <th className="px-5 py-3 font-medium">Asunto</th>
              <th className="px-5 py-3 font-medium">Solicitante</th>
              <th className="px-5 py-3 font-medium">Dependencia</th>
              <th className="px-5 py-3 font-medium">Término</th>
              <th className="px-5 py-3 font-medium">Auditoría</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(({ pqrs, auditoria }, i) => (
              <tr
                key={pqrs.id}
                style={{ animationDelay: `${i * 60}ms` }}
                className={`animate-fade-in border-b border-ink/5 border-l-[3px] rail-${auditoria} transition-colors last:border-b-0 hover:bg-girverde/[0.04]`}
              >
                <td className="px-5 py-4 font-mono text-xs text-ink">{pqrs.radicado}</td>
                <td className="px-5 py-4 text-ink">{pqrs.asunto}</td>
                <td className="px-5 py-4 text-ink-faint">{pqrs.solicitante}</td>
                <td className="px-5 py-4 text-ink-faint">{pqrs.dependencia}</td>
                <td className="px-5 py-4 text-ink-faint">{formatFecha(pqrs.fechaLimite)}</td>
                <td className="px-5 py-4">
                  <PQRSAuditoriaBadge nivel={auditoria} />
                </td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-ink-faint">
                  No hay PQRS en esta categoría.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
