import { useState, useMemo } from 'react'
import { formatCOP } from '../../data/format'

export interface SegmentoDonut {
  id: string
  nombre: string
  valor: number
  color: string
  casos: number
  responsable?: string
}

interface GraficaDonutCarteraProps {
  datos: SegmentoDonut[]
  titulo?: string
  subtitulo?: string
  segmentoSeleccionadoId?: string | null
  onHoverSegmento?: (id: string | null) => void
}

interface ArcoCalculado {
  segmento: SegmentoDonut
  pathD: string
  porcentaje: number
  centroX: number
  centroY: number
  labelX: number
  labelY: number
  lineEndX: number
  lineEndY: number
  esLadoDerecho: boolean
}

export default function GraficaDonutCartera({
  datos,
  titulo = 'Distribución de Cartera Municipal',
  subtitulo = 'Clasificación presupuestal por concepto de recaudo',
  segmentoSeleccionadoId,
  onHoverSegmento,
}: GraficaDonutCarteraProps) {
  const [hoverLocalId, setHoverLocalId] = useState<string | null>(null)
  const activoId = segmentoSeleccionadoId ?? hoverLocalId

  const totalCartera = useMemo(() => datos.reduce((sum, d) => sum + d.valor, 0), [datos])

  // Cálculo trigonométrico de los arcos SVG
  const arcos: ArcoCalculado[] = useMemo(() => {
    if (totalCartera === 0) return []

    const cx = 220
    const cy = 180
    const radioExterior = 105
    const radioInterior = 65
    const radioLabels = 135
    const radioPuntos = 120

    let anguloInicio = -Math.PI / 2 // Empieza arriba (12:00)

    return datos.map((seg) => {
      const fraccion = seg.valor / totalCartera
      const anguloBarrido = fraccion * 2 * Math.PI
      const anguloFin = anguloInicio + anguloBarrido
      const anguloMedio = anguloInicio + anguloBarrido / 2

      // Pequeña separación estética entre arcos
      const gap = datos.length > 1 ? 0.015 : 0
      const a1 = anguloInicio + gap
      const a2 = anguloFin - gap

      const x1Ext = cx + radioExterior * Math.cos(a1)
      const y1Ext = cy + radioExterior * Math.sin(a1)
      const x2Ext = cx + radioExterior * Math.cos(a2)
      const y2Ext = cy + radioExterior * Math.sin(a2)

      const x1Int = cx + radioInterior * Math.cos(a2)
      const y1Int = cy + radioInterior * Math.sin(a2)
      const x2Int = cx + radioInterior * Math.cos(a1)
      const y2Int = cy + radioInterior * Math.sin(a1)

      const largeArc = a2 - a1 > Math.PI ? 1 : 0

      const pathD = [
        `M ${x1Ext.toFixed(2)} ${y1Ext.toFixed(2)}`,
        `A ${radioExterior} ${radioExterior} 0 ${largeArc} 1 ${x2Ext.toFixed(2)} ${y2Ext.toFixed(2)}`,
        `L ${x1Int.toFixed(2)} ${y1Int.toFixed(2)}`,
        `A ${radioInterior} ${radioInterior} 0 ${largeArc} 0 ${x2Int.toFixed(2)} ${y2Int.toFixed(2)}`,
        'Z',
      ].join(' ')

      const esLadoDerecho = Math.cos(anguloMedio) >= 0
      const pX = cx + radioPuntos * Math.cos(anguloMedio)
      const pY = cy + radioPuntos * Math.sin(anguloMedio)
      const lX = cx + radioLabels * Math.cos(anguloMedio)
      const lY = cy + radioLabels * Math.sin(anguloMedio)
      const endX = esLadoDerecho ? lX + 18 : lX - 18

      anguloInicio = anguloFin

      return {
        segmento: seg,
        pathD,
        porcentaje: Math.round(fraccion * 1000) / 10,
        centroX: cx + (radioInterior + (radioExterior - radioInterior) / 2) * Math.cos(anguloMedio),
        centroY: cy + (radioInterior + (radioExterior - radioInterior) / 2) * Math.sin(anguloMedio),
        labelX: pX,
        labelY: pY,
        lineEndX: endX,
        lineEndY: lY,
        esLadoDerecho,
      }
    })
  }, [datos, totalCartera])

  const activo = datos.find((d) => d.id === activoId) ?? null

  const handleMouseEnter = (id: string) => {
    setHoverLocalId(id)
    onHoverSegmento?.(id)
  }

  const handleMouseLeave = () => {
    setHoverLocalId(null)
    onHoverSegmento?.(null)
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
      {/* Encabezado del Diagrama */}
      <div className="border-b border-slate-100 pb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">{titulo}</h2>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
            {datos.length} Conceptos
          </span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">{subtitulo}</p>
      </div>

      {/* Área del Diagrama Vectorial */}
      <div className="relative my-2 flex items-center justify-center">
        <svg viewBox="0 0 440 360" className="w-full max-w-[430px] overflow-visible">
          <g>
            {arcos.map((arco) => {
              const isSelected = activoId === arco.segmento.id
              const isAnySelected = activoId !== null
              const opacity = isAnySelected ? (isSelected ? 'opacity-100' : 'opacity-40') : 'opacity-95'

              return (
                <g
                  key={arco.segmento.id}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => handleMouseEnter(arco.segmento.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Arco del Donut */}
                  <path
                    d={arco.pathD}
                    fill={arco.segmento.color}
                    className={`transition-all duration-300 ${opacity} hover:opacity-100`}
                    style={{
                      transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                      transformOrigin: '220px 180px',
                      filter: isSelected ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.15))' : 'none',
                    }}
                  />

                  {/* Porcentaje impreso sobre el segmento (si supera el 6%) */}
                  {arco.porcentaje >= 6 && (
                    <text
                      x={arco.centroX}
                      y={arco.centroY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#FFFFFF"
                      className="text-[11px] font-bold pointer-events-none drop-shadow-xs"
                    >
                      {arco.porcentaje}%
                    </text>
                  )}

                  {/* Línea conectora hacia la etiqueta externa */}
                  <polyline
                    points={`${arco.labelX.toFixed(1)},${arco.labelY.toFixed(1)} ${arco.lineEndX.toFixed(1)},${arco.lineEndY.toFixed(1)}`}
                    fill="none"
                    stroke={isSelected ? arco.segmento.color : '#CBD5E1'}
                    strokeWidth={isSelected ? 1.5 : 1}
                    className="transition-colors duration-200"
                  />

                  {/* Texto de Valor y Nombre Externo */}
                  <text
                    x={arco.esLadoDerecho ? arco.lineEndX + 4 : arco.lineEndX - 4}
                    y={arco.lineEndY - 3}
                    textAnchor={arco.esLadoDerecho ? 'start' : 'end'}
                    className={`text-[10px] font-semibold transition-colors duration-200 ${
                      isSelected ? 'fill-slate-900 font-bold' : 'fill-slate-600'
                    }`}
                  >
                    {formatCOP(arco.segmento.valor)}
                  </text>
                  <text
                    x={arco.esLadoDerecho ? arco.lineEndX + 4 : arco.lineEndX - 4}
                    y={arco.lineEndY + 9}
                    textAnchor={arco.esLadoDerecho ? 'start' : 'end'}
                    className="text-[9px] fill-slate-400 font-medium"
                  >
                    {arco.segmento.nombre.length > 20
                      ? `${arco.segmento.nombre.slice(0, 18)}...`
                      : arco.segmento.nombre}
                  </text>
                </g>
              )
            })}
          </g>

          {/* Centro Dinámico del Donut */}
          <g className="pointer-events-none">
            <circle cx="220" cy="180" r="58" fill="#FFFFFF" className="drop-shadow-xs" />
            {activo ? (
              <>
                <text x="220" y="165" textAnchor="middle" className="text-[10px] font-semibold fill-slate-400 uppercase tracking-wider">
                  {activo.nombre.length > 15 ? `${activo.nombre.slice(0, 14)}...` : activo.nombre}
                </text>
                <text x="220" y="184" textAnchor="middle" className="text-xs font-bold fill-vinotinto">
                  {formatCOP(activo.valor)}
                </text>
                <text x="220" y="200" textAnchor="middle" className="text-[10px] font-medium fill-slate-500">
                  {activo.casos} contribuyentes
                </text>
              </>
            ) : (
              <>
                <text x="220" y="166" textAnchor="middle" className="text-[9px] font-semibold fill-slate-400 uppercase tracking-wider">
                  Total Cartera
                </text>
                <text x="220" y="185" textAnchor="middle" className="text-xs font-bold fill-slate-900">
                  {formatCOP(totalCartera)}
                </text>
                <text x="220" y="200" textAnchor="middle" className="text-[9px] font-medium fill-slate-500">
                  {datos.reduce((sum, d) => sum + d.casos, 0)} expedientes
                </text>
              </>
            )}
          </g>
        </svg>
      </div>

      {/* Leyenda Inferior Limpia */}
      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
        {datos.map((d) => (
          <button
            key={d.id}
            onClick={() => onHoverSegmento?.(d.id === activoId ? null : d.id)}
            onMouseEnter={() => handleMouseEnter(d.id)}
            onMouseLeave={handleMouseLeave}
            className={`flex items-center gap-2 rounded-md p-1.5 text-left text-xs transition-colors ${
              activoId === d.id ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="truncate flex-1 text-[11px]">{d.nombre}</span>
            <span className="text-[10px] text-slate-400 font-medium shrink-0">
              {Math.round((d.valor / (totalCartera || 1)) * 100)}%
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
