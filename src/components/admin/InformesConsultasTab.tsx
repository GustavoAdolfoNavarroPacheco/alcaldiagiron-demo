import { useMemo } from 'react'
import type { PQRS } from '../../types'

interface InformesConsultasTabProps {
  items: PQRS[]
}

function diasEntre(inicioIso: string, finIso: string): number {
  const inicio = new Date(inicioIso).getTime()
  const fin = new Date(finIso).getTime()
  return Math.round((fin - inicio) / (1000 * 60 * 60 * 24))
}

function BarraDistribucion({ label, valor, total, color }: { label: string; valor: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((valor / total) * 100) : 0
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="font-medium text-slate-700 truncate pr-2">{label}</span>
        <span className="font-mono text-slate-500 shrink-0">{valor} · {pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

export default function InformesConsultasTab({ items }: InformesConsultasTabProps) {
  const stats = useMemo(() => {
    const total = items.length
    const resueltas = items.filter((p) => p.estado === 'Resuelta')
    const enProceso = items.filter((p) => p.estado === 'En proceso').length
    const vencidas = items.filter((p) => p.estado === 'Vencida').length

    const diasRespuesta = resueltas
      .filter((p) => p.fechaRespuesta)
      .map((p) => diasEntre(p.fechaRadicacion, p.fechaRespuesta as string))
    const promedioDias = diasRespuesta.length
      ? Math.round(diasRespuesta.reduce((a, b) => a + b, 0) / diasRespuesta.length)
      : 0

    const dentroDeTermino = resueltas.filter(
      (p) => p.fechaRespuesta && new Date(p.fechaRespuesta) <= new Date(p.fechaLimite),
    ).length
    const pctDentroTermino = resueltas.length ? Math.round((dentroDeTermino / resueltas.length) * 100) : 0

    const porDependencia = new Map<string, number>()
    const porTipo = new Map<string, number>()
    let portalDigital = 0
    let presencial = 0

    items.forEach((p) => {
      porDependencia.set(p.dependencia, (porDependencia.get(p.dependencia) ?? 0) + 1)
      porTipo.set(p.tipo, (porTipo.get(p.tipo) ?? 0) + 1)
      if (p.origen === 'Radicación Presencial') presencial += 1
      else portalDigital += 1
    })

    return {
      total,
      resueltasCount: resueltas.length,
      enProceso,
      vencidas,
      promedioDias,
      pctDentroTermino,
      porDependencia: Array.from(porDependencia.entries()).sort((a, b) => b[1] - a[1]),
      porTipo: Array.from(porTipo.entries()).sort((a, b) => b[1] - a[1]),
      portalDigital,
      presencial,
    }
  }, [items])

  return (
    <div className="space-y-5">
      {/* KPIs principales */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total Radicados</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Tiempo Promedio de Respuesta</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">{stats.promedioDias} <span className="text-sm font-medium text-slate-400">días</span></p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Respondidas Dentro de Término</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700 tabular-nums">{stats.pctDentroTermino}%</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Vencidas Actualmente</p>
          <p className="mt-1 text-2xl font-bold text-rose-600 tabular-nums">{stats.vencidas}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Distribución por dependencia */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Distribución por Dependencia</h3>
          <div className="space-y-2.5">
            {stats.porDependencia.map(([dep, count]) => (
              <BarraDistribucion key={dep} label={dep} valor={count} total={stats.total} color="#6F1413" />
            ))}
          </div>
        </div>

        {/* Distribución por tipo de solicitud */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Distribución por Tipo de Solicitud</h3>
          <div className="space-y-2.5">
            {stats.porTipo.map(([tipo, count]) => (
              <BarraDistribucion key={tipo} label={tipo} valor={count} total={stats.total} color="#C98A1E" />
            ))}
          </div>
        </div>
      </div>

      {/* Canal de radicación */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Canal de Radicación</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-sky-200 bg-sky-50/60 p-3.5">
            <p className="text-[11px] font-semibold text-sky-800">Portal Digital</p>
            <p className="mt-1 text-xl font-bold text-sky-900 tabular-nums">{stats.portalDigital}</p>
            <p className="text-[11px] text-sky-700/80">Radicado directamente por el ciudadano en línea</p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3.5">
            <p className="text-[11px] font-semibold text-amber-800">Radicación Presencial</p>
            <p className="mt-1 text-xl font-bold text-amber-900 tabular-nums">{stats.presencial}</p>
            <p className="text-[11px] text-amber-700/80">Correspondencia física registrada por un funcionario</p>
          </div>
        </div>
      </div>
    </div>
  )
}
