import { Link } from 'react-router-dom'
import { formatCOP } from '../../data/format'
import type { SegmentoMunicipal } from './GraficaDonutMunicipal'

export interface FilaResumenSecretaria extends SegmentoMunicipal {
  slug: string
  presupuestoAsignado: number
  presupuestoEjecutado: number
  desempeno: 'optimo' | 'alerta' | 'critico'
  desempenoDetalle: string
  titular: string
}

interface TablaResumenSecretariasProps {
  filas: FilaResumenSecretaria[]
  filaSeleccionadaId?: string | null
  onHoverFila?: (id: string | null) => void
  titulo?: string
  subtitulo?: string
}

export default function TablaResumenSecretarias({
  filas,
  filaSeleccionadaId,
  onHoverFila,
  titulo = 'Desempeño y Gestión por Secretaría de Despacho',
  subtitulo = 'Seguimiento de ejecución presupuestal y trámites en San Juan de Girón',
}: TablaResumenSecretariasProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col justify-between">
      {/* Encabezado */}
      <div className="border-b border-slate-100 p-5 pb-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">{titulo}</h2>
          <span className="text-[11px] font-medium text-slate-400">
            {filas.length} Secretarías Oficiales
          </span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">{subtitulo}</p>
      </div>

      {/* Tabla Ejecutiva */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-600">
              <th className="px-4 py-2.5">Secretaría de Despacho</th>
              <th className="px-4 py-2.5">Titular</th>
              <th className="px-3 py-2.5 text-center">Estado</th>
              <th className="px-4 py-2.5 text-right whitespace-nowrap">Presupuesto Asignado</th>
              <th className="px-4 py-2.5 text-right whitespace-nowrap">Ejecutado</th>
              <th className="px-4 py-2.5 text-center whitespace-nowrap">Avance</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap">Trámites</th>
              <th className="px-4 py-2.5 text-right min-w-[76px] whitespace-nowrap">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filas.map((fila) => {
              const isSelected = filaSeleccionadaId === fila.id
              const pctAvance = Math.min(
                100,
                Math.round((fila.presupuestoEjecutado / (fila.presupuestoAsignado || 1)) * 100),
              )

              return (
                <tr
                  key={fila.id}
                  onMouseEnter={() => onHoverFila?.(fila.id)}
                  onMouseLeave={() => onHoverFila?.(null)}
                  className={`transition-colors cursor-pointer ${
                    isSelected ? 'bg-slate-100/80' : 'hover:bg-slate-50/70'
                  }`}
                >
                  {/* Secretaría */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: fila.color }} />
                      <span className="font-semibold text-slate-900">{fila.nombre}</span>
                    </div>
                  </td>

                  {/* Titular */}
                  <td className="px-4 py-3 text-slate-500 text-[11px]">
                    {fila.titular}
                  </td>

                  {/* Semáforo de Desempeño */}
                  <td className="px-3 py-3 text-center">
                    <span className="inline-flex items-center justify-center" title={fila.desempenoDetalle}>
                      {fila.desempeno === 'optimo' && (
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                      )}
                      {fila.desempeno === 'alerta' && (
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-amber-100 animate-pulse" />
                      )}
                      {fila.desempeno === 'critico' && (
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-rose-100 animate-pulse" />
                      )}
                    </span>
                  </td>

                  {/* Asignado */}
                  <td className="px-4 py-3 text-right font-medium text-slate-700 whitespace-nowrap">
                    {formatCOP(fila.presupuestoAsignado)}
                  </td>

                  {/* Ejecutado */}
                  <td className="px-4 py-3 text-right font-semibold text-slate-900 whitespace-nowrap">
                    {formatCOP(fila.presupuestoEjecutado)}
                  </td>

                  {/* Avance */}
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-1.5 w-12 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pctAvance}%`,
                            backgroundColor: fila.color,
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-slate-500">{pctAvance}%</span>
                    </div>
                  </td>

                  {/* Trámites */}
                  <td className="px-3 py-3 text-center font-semibold text-slate-800 whitespace-nowrap">
                    {fila.casos}
                  </td>

                  {/* Botón Ver Dashboard */}
                  <td className="px-4 py-3 text-right min-w-[76px] whitespace-nowrap">
                    <Link
                      to={`/admin/secretarias/${fila.slug}`}
                      className="inline-flex shrink-0 items-center justify-center rounded bg-vinotinto/10 px-2.5 py-1 text-[11px] font-semibold text-vinotinto hover:bg-vinotinto hover:text-white transition-colors"
                    >
                      Ver →
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pie */}
      <div className="border-t border-slate-100 bg-slate-50/50 p-3 text-xs text-slate-500 flex items-center justify-between">
        <span className="text-[11px]">Seguimiento al Plan de Desarrollo Municipal "Girón Crece Seguro"</span>
        <Link to="/admin/secretarias" className="text-[11px] font-semibold text-vinotinto hover:underline">
          Ver Directorio Completo de Despachos →
        </Link>
      </div>
    </div>
  )
}
