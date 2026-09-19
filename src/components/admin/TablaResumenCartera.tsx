import { formatCOP } from '../../data/format'
import type { SegmentoDonut } from './GraficaDonutCartera'

export interface FilaResumenCartera extends SegmentoDonut {
  metaPresupuesto: number
  recaudoGestionado: number
  salud: 'optimo' | 'alerta' | 'critico'
  saludDetalle: string
}

interface TablaResumenCarteraProps {
  filas: FilaResumenCartera[]
  filaSeleccionadaId?: string | null
  onHoverFila?: (id: string | null) => void
  titulo?: string
  subtitulo?: string
}

export default function TablaResumenCartera({
  filas,
  filaSeleccionadaId,
  onHoverFila,
  titulo = 'Resumen Ejecutivo de Cartera Municipal',
  subtitulo = 'Seguimiento por concepto de tributo y secretaría responsable',
}: TablaResumenCarteraProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col justify-between">
      {/* Encabezado de la Tarjeta */}
      <div className="border-b border-slate-100 p-5 pb-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">{titulo}</h2>
          <span className="text-[11px] font-medium text-slate-400">
            {filas.length} Líneas de Recaudo
          </span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">{subtitulo}</p>
      </div>

      {/* Tabla Estilo Portfolio Summary */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-600">
              <th className="px-4 py-2.5">Concepto / Cartera</th>
              <th className="px-4 py-2.5">Responsable</th>
              <th className="px-3 py-2.5 text-center">Salud</th>
              <th className="px-4 py-2.5 text-right">Meta (Presupuesto)</th>
              <th className="px-4 py-2.5 text-right">Gestionado / Recaudo</th>
              <th className="px-4 py-2.5 text-center">Avance</th>
              <th className="px-3 py-2.5 text-center"># Casos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filas.map((fila) => {
              const isSelected = filaSeleccionadaId === fila.id
              const pctAvance = Math.min(100, Math.round((fila.recaudoGestionado / (fila.metaPresupuesto || 1)) * 100))

              return (
                <tr
                  key={fila.id}
                  onMouseEnter={() => onHoverFila?.(fila.id)}
                  onMouseLeave={() => onHoverFila?.(null)}
                  className={`transition-colors cursor-pointer ${
                    isSelected ? 'bg-slate-100/80' : 'hover:bg-slate-50/70'
                  }`}
                >
                  {/* Nombre y color identificador */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: fila.color }} />
                      <span className="font-semibold text-slate-900">{fila.nombre}</span>
                    </div>
                  </td>

                  {/* Responsable */}
                  <td className="px-4 py-3 text-slate-500 text-[11px]">
                    {fila.responsable ?? 'Hacienda Municipal'}
                  </td>

                  {/* Salud (Punto semáforo con animación de pulso) */}
                  <td className="px-3 py-3 text-center">
                    <span className="inline-flex items-center justify-center" title={fila.saludDetalle}>
                      {fila.salud === 'optimo' && (
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                      )}
                      {fila.salud === 'alerta' && (
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-amber-100 animate-pulse" />
                      )}
                      {fila.salud === 'critico' && (
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-rose-100 animate-pulse" />
                      )}
                    </span>
                  </td>

                  {/* Meta / Presupuesto */}
                  <td className="px-4 py-3 text-right font-medium text-slate-700">
                    {formatCOP(fila.metaPresupuesto)}
                  </td>

                  {/* Gestionado */}
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">
                    {formatCOP(fila.recaudoGestionado)}
                  </td>

                  {/* Barra de Avance */}
                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-1.5 w-14 rounded-full bg-slate-100 overflow-hidden">
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

                  {/* Número de Expedientes */}
                  <td className="px-3 py-3 text-center font-semibold text-slate-800">
                    {fila.casos}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pie de Tabla con Totales */}
      <div className="border-t border-slate-100 bg-slate-50/50 p-3 text-xs text-slate-500 flex items-center justify-between">
        <span className="text-[11px]">Metas y recaudos liquidados en tesorería central</span>
        <span className="text-[11px] font-medium text-slate-700">
          Total Casos Activos: {filas.reduce((sum, f) => sum + f.casos, 0)}
        </span>
      </div>
    </div>
  )
}
