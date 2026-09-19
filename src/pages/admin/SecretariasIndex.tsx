import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getAllSecretarias } from '../../data/secretariasData'
import { formatCOP } from '../../data/format'

export default function SecretariasIndex() {
  const secretarias = useMemo(() => getAllSecretarias(), [])
  const [busqueda, setBusqueda] = useState('')

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return secretarias
    return secretarias.filter(
      (s) =>
        s.nombre.toLowerCase().includes(q) ||
        s.secretario.toLowerCase().includes(q) ||
        s.mision.toLowerCase().includes(q) ||
        s.solucionesTecnicas.some((sol) => sol.nombre.toLowerCase().includes(q)) ||
        s.lineasAccion.some((l) => l.toLowerCase().includes(q)),
    )
  }, [secretarias, busqueda])

  const totalPresupuesto = useMemo(
    () => secretarias.reduce((sum, s) => sum + s.indicadores.presupuestoAsignado, 0),
    [secretarias],
  )
  const totalSoluciones = useMemo(
    () => secretarias.reduce((sum, s) => sum + s.solucionesTecnicas.length, 0),
    [secretarias],
  )

  return (
    <div className="space-y-6">
      {/* Encabezado del Módulo de Secretarías */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Alcaldía de Girón</span>
            <span>/</span>
            <span className="text-vinotinto font-semibold">Secretarías de Despacho</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Catálogo de Secretarías y Soluciones de IA
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Gestión administrativa y herramientas de inteligencia artificial en las 11 secretarías de San Juan de Girón.
          </p>
        </div>

        {/* Resumen Global Rápido */}
        <div className="flex items-center gap-2.5 text-xs">
          <div className="rounded-md border border-slate-200 bg-white px-3.5 py-1.5 shadow-xs">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total Secretarías</p>
            <p className="text-sm font-bold text-slate-900">{secretarias.length}</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white px-3.5 py-1.5 shadow-xs">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Soluciones de IA</p>
            <p className="text-sm font-bold text-vinotinto">{totalSoluciones} Módulos</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white px-3.5 py-1.5 shadow-xs">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Presupuesto Municipal</p>
            <p className="text-sm font-bold text-slate-900">{formatCOP(totalPresupuesto)}</p>
          </div>
        </div>
      </div>

      {/* Buscador de Secretarías y Soluciones */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative max-w-md">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar secretaría, solución técnica (IVC, Cobro, Actas...) o titular..."
            className="w-full rounded-md border border-slate-200 bg-white py-2 pl-3.5 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Cuadrícula de las 11 Secretarías */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtradas.map((sec) => {
          const pct = Math.round(
            (sec.indicadores.presupuestoEjecutado / (sec.indicadores.presupuestoAsignado || 1)) * 100,
          )

          return (
            <div
              key={sec.slug}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">{sec.nombre}</h3>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 shrink-0">
                    {sec.indicadores.tramitesTotal} trámites
                  </span>
                </div>

                <div className="mt-2 text-xs">
                  <p className="font-medium text-slate-700">{sec.secretario}</p>
                  <p className="text-[11px] text-slate-400">{sec.cargo}</p>
                </div>

                {/* Etiquetas de Soluciones de IA de las diapositivas */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {sec.solucionesTecnicas.map((sol) => (
                    <span
                      key={sol.id}
                      className="rounded bg-vinotinto/10 px-2 py-0.5 text-[10px] font-semibold text-vinotinto"
                    >
                      {sol.nombre}
                    </span>
                  ))}
                </div>

                {/* Ejecución Presupuestal */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Ejecución Presupuestal</span>
                    <span className="font-semibold text-slate-900">{pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-vinotinto rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{sec.ubicacion}</span>
                <Link
                  to={`/admin/secretarias/${sec.slug}`}
                  className="rounded-md bg-vinotinto px-3 py-1.5 text-xs font-semibold text-white hover:bg-vinotinto-deep transition-colors"
                >
                  Abrir Dashboard →
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
