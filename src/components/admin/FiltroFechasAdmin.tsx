import { useState } from 'react'

export type RangoFechaModo = 'historico' | '2026' | 'trimestre' | 'mes' | 'custom'

export interface FiltroFechaState {
  modo: RangoFechaModo
  fechaInicio: string
  fechaFin: string
  etiqueta: string
}

interface FiltroFechasAdminProps {
  filtroActual: FiltroFechaState
  onChange: (nuevoFiltro: FiltroFechaState) => void
}

const OPCIONES_RAPIDAS: { modo: RangoFechaModo; label: string; sub: string }[] = [
  { modo: 'historico', label: 'Todo el Histórico', sub: '2021 - 2026' },
  { modo: '2026', label: 'Vigencia 2026', sub: 'Ene - Dic 2026' },
  { modo: 'trimestre', label: 'Último Trimestre', sub: 'Jul - Sep 2026' },
  { modo: 'mes', label: 'Últimos 30 Días', sub: 'Ago - Sep 2026' },
  { modo: 'custom', label: 'Rango Personalizado', sub: 'Fechas exactas' },
]

export default function FiltroFechasAdmin({ filtroActual, onChange }: FiltroFechasAdminProps) {
  const [mostrarCustom, setMostrarCustom] = useState(filtroActual.modo === 'custom')
  const [fechaInicioTemp, setFechaInicioTemp] = useState(filtroActual.fechaInicio || '2026-01-01')
  const [fechaFinTemp, setFechaFinTemp] = useState(filtroActual.fechaFin || '2026-12-31')

  const seleccionarModo = (modo: RangoFechaModo) => {
    if (modo === 'custom') {
      setMostrarCustom(true)
      onChange({
        modo: 'custom',
        fechaInicio: fechaInicioTemp,
        fechaFin: fechaFinTemp,
        etiqueta: `Rango: ${fechaInicioTemp} al ${fechaFinTemp}`,
      })
      return
    }

    setMostrarCustom(false)
    let fechaInicio = ''
    let fechaFin = ''
    let etiqueta = ''

    if (modo === 'historico') {
      fechaInicio = '2021-01-01'
      fechaFin = '2026-12-31'
      etiqueta = 'Histórico Completo (2021 - 2026)'
    } else if (modo === '2026') {
      fechaInicio = '2026-01-01'
      fechaFin = '2026-12-31'
      etiqueta = 'Vigencia Fiscal 2026'
    } else if (modo === 'trimestre') {
      fechaInicio = '2026-07-01'
      fechaFin = '2026-09-30'
      etiqueta = 'Tercer Trimestre 2026'
    } else if (modo === 'mes') {
      fechaInicio = '2026-08-15'
      fechaFin = '2026-09-18'
      etiqueta = 'Últimos 30 Días'
    }

    onChange({ modo, fechaInicio, fechaFin, etiqueta })
  }

  const aplicarCustom = () => {
    onChange({
      modo: 'custom',
      fechaInicio: fechaInicioTemp,
      fechaFin: fechaFinTemp,
      etiqueta: `${fechaInicioTemp} a ${fechaFinTemp}`,
    })
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Selector de Chips de Período */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1.5 text-xs font-semibold text-slate-700">Período:</span>
          {OPCIONES_RAPIDAS.map((opc) => {
            const activo = filtroActual.modo === opc.modo
            return (
              <button
                key={opc.modo}
                type="button"
                onClick={() => seleccionarModo(opc.modo)}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                  activo
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'border border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                <span>{opc.label}</span>
                {activo && <span className="h-1.5 w-1.5 rounded-full bg-dorado" />}
              </button>
            )
          })}
        </div>

        {/* Indicador de Rango Activo */}
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded bg-vinotinto/10 px-2 py-0.5 font-medium text-vinotinto">
            {filtroActual.etiqueta}
          </span>
          {filtroActual.modo !== 'historico' && (
            <button
              onClick={() => seleccionarModo('historico')}
              className="text-[11px] text-slate-400 hover:text-slate-700 underline"
            >
              Restablecer
            </button>
          )}
        </div>
      </div>

      {/* Rango Personalizado Desplegable */}
      {mostrarCustom && (
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3 text-xs">
          <div className="flex items-center gap-2">
            <label htmlFor="fechaInicio" className="text-slate-500 font-medium">Desde:</label>
            <input
              id="fechaInicio"
              type="date"
              value={fechaInicioTemp}
              onChange={(e) => setFechaInicioTemp(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="fechaFin" className="text-slate-500 font-medium">Hasta:</label>
            <input
              id="fechaFin"
              type="date"
              value={fechaFinTemp}
              onChange={(e) => setFechaFinTemp(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-slate-400 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={aplicarCustom}
            className="rounded-md bg-vinotinto px-3 py-1 text-xs font-medium text-white hover:bg-vinotinto-deep transition-colors"
          >
            Aplicar Rango
          </button>
        </div>
      )}
    </div>
  )
}
