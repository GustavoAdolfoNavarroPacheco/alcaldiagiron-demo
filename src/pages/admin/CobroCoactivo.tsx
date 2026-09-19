import { useMemo, useState } from 'react'
import { getDeudores } from '../../data/storage'
import { nivelUrgenciaDeudor, type Deudor, type NivelUrgencia, type OficioHistorial } from '../../types'
import { formatCOP, formatFecha } from '../../data/format'
import { DeudorUrgenciaBadge } from '../../components/SemaforoBadge'

const ORDEN_NIVEL: Record<NivelUrgencia, number> = { rojo: 0, naranja: 1, amarillo: 2, verde: 3 }

const ESTILOS_FILA_SEMAFORO: Record<NivelUrgencia, string> = {
  rojo: 'bg-rose-100/70 hover:bg-rose-100 border-l-4 border-l-rose-600',
  naranja: 'bg-orange-100/70 hover:bg-orange-100 border-l-4 border-l-orange-600',
  amarillo: 'bg-amber-100/60 hover:bg-amber-100 border-l-4 border-l-amber-500',
  verde: 'bg-emerald-100/60 hover:bg-emerald-100 border-l-4 border-l-emerald-600',
}

type CriterioOrden = 'mayor-deuda' | 'menor-deuda' | 'nombre-az'

export default function CobroCoactivo() {
  const [listaDeudores, setListaDeudores] = useState<Deudor[]>(() => getDeudores())
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null)

  // Estados de Filtros
  const [busqueda, setBusqueda] = useState('')
  const [filtroUrgencia, setFiltroUrgencia] = useState<NivelUrgencia | 'todos'>('todos')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [criterioOrden, setCriterioOrden] = useState<CriterioOrden>('mayor-deuda')

  // Obtener estados únicos de proceso para el filtro
  const estadosProcesoDisponibles = useMemo(() => {
    const estados = new Set(listaDeudores.map((d) => d.estadoProceso))
    return Array.from(estados)
  }, [listaDeudores])

  // Filtrado y Ordenamiento Reactivo
  const deudoresFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()

    return listaDeudores
      .filter((d) => {
        // Filtro por búsqueda
        if (q) {
          const matchNombre = d.nombre.toLowerCase().includes(q)
          const matchDoc = d.documento.includes(q)
          const matchPredio = d.predios.some((p) => p.matricula.toLowerCase().includes(q) || p.direccion.toLowerCase().includes(q))
          if (!matchNombre && !matchDoc && !matchPredio) return false
        }

        // Filtro por urgencia
        if (filtroUrgencia !== 'todos' && nivelUrgenciaDeudor(d) !== filtroUrgencia) {
          return false
        }

        // Filtro por estado del proceso
        if (filtroEstado !== 'todos' && d.estadoProceso !== filtroEstado) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        const deudaA = a.valorCapital + a.valorIntereses
        const deudaB = b.valorCapital + b.valorIntereses

        if (criterioOrden === 'mayor-deuda') return deudaB - deudaA
        if (criterioOrden === 'menor-deuda') return deudaA - deudaB
        if (criterioOrden === 'nombre-az') return a.nombre.localeCompare(b.nombre)

        const nivelDiff = ORDEN_NIVEL[nivelUrgenciaDeudor(a)] - ORDEN_NIVEL[nivelUrgenciaDeudor(b)]
        if (nivelDiff !== 0) return nivelDiff
        return deudaB - deudaA
      })
  }, [listaDeudores, busqueda, filtroUrgencia, filtroEstado, criterioOrden])

  // Conteos por nivel de criticidad
  const conteosUrgencia = useMemo(() => {
    const counts: Record<NivelUrgencia | 'todos', number> = {
      todos: listaDeudores.length,
      rojo: 0,
      naranja: 0,
      amarillo: 0,
      verde: 0,
    }
    listaDeudores.forEach((d) => {
      const n = nivelUrgenciaDeudor(d)
      counts[n] = (counts[n] || 0) + 1
    })
    return counts
  }, [listaDeudores])

  const hayFiltrosActivos =
    busqueda !== '' ||
    filtroUrgencia !== 'todos' ||
    filtroEstado !== 'todos' ||
    criterioOrden !== 'mayor-deuda'

  const handleLimpiarFiltros = () => {
    setBusqueda('')
    setFiltroUrgencia('todos')
    setFiltroEstado('todos')
    setCriterioOrden('mayor-deuda')
  }



  const seleccionado = listaDeudores.find((d) => d.id === seleccionadoId) ?? null

  const handleAgregarOficio = (deudorId: string, nuevoOficio: OficioHistorial) => {
    setListaDeudores((prev) =>
      prev.map((d) => {
        if (d.id === deudorId) {
          return {
            ...d,
            historialOficios: [nuevoOficio, ...d.historialOficios],
          }
        }
        return d
      }),
    )
  }

  return (
    <div className="space-y-6">
      {/* Encabezado Corporativo Minimalista */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Gestión y Control de Cobro Coactivo
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">
          Administración judicial de cartera morosa y fiscalización de obligaciones tributarias en San Juan de Girón.
        </p>
      </div>

      {/* Barra de Búsqueda y Filtros Unificada Enterprise */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3.5">
        <div className="grid gap-3 md:grid-cols-12">
          {/* Buscador con Icono SVG */}
          <div className="relative md:col-span-6">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por contribuyente, documento, dirección o matrícula predial..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all"
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtro por Estado Procesal */}
          <div className="md:col-span-3">
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all font-medium"
            >
              <option value="todos">Todos los Estados Procesales</option>
              {estadosProcesoDisponibles.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Criterio de Ordenación */}
          <div className="md:col-span-3">
            <select
              value={criterioOrden}
              onChange={(e) => setCriterioOrden(e.target.value as CriterioOrden)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all font-medium"
            >
              <option value="mayor-deuda">Mayor Cuantía Primero</option>
              <option value="menor-deuda">Menor Cuantía Primero</option>
              <option value="nombre-az">Nombre Contribuyente (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Selector Segmentado de Criticidad (Semáforo Dinámico) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Semáforo:
            </span>
            <div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-slate-100/90 p-1 text-xs">
              {[
                { id: 'todos', label: 'Todos', dot: null, count: conteosUrgencia.todos },
                { id: 'rojo', label: 'Crítica (> $20M)', dot: 'bg-rose-500', count: conteosUrgencia.rojo },
                { id: 'naranja', label: 'Alta ($10M - $20M)', dot: 'bg-orange-500', count: conteosUrgencia.naranja },
                { id: 'amarillo', label: 'Moderada ($3M - $10M)', dot: 'bg-amber-500', count: conteosUrgencia.amarillo },
                { id: 'verde', label: 'Menor (< $3M)', dot: 'bg-emerald-500', count: conteosUrgencia.verde },
              ].map((btn) => {
                const activo = filtroUrgencia === btn.id
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setFiltroUrgencia(btn.id as NivelUrgencia | 'todos')}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                      activo
                        ? 'bg-white text-slate-900 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    {btn.dot && <span className={`h-1.5 w-1.5 rounded-full ${btn.dot}`} />}
                    <span>{btn.label}</span>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[10px] font-semibold transition-colors ${
                        activo ? 'bg-slate-100 text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {btn.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {hayFiltrosActivos && (
            <button
              type="button"
              onClick={handleLimpiarFiltros}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-vinotinto hover:text-vinotinto-deep transition-colors"
            >
              <span>↺</span>
              <span>Restablecer filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabla Corporativa de Deudores */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3.5">Contribuyente</th>
              <th className="px-5 py-3.5">Concepto / Obligación</th>
              <th className="px-5 py-3.5">Estado Procesal</th>
              <th className="px-5 py-3.5">Vigencia</th>
              <th className="px-5 py-3.5 text-right">Cuantía Total</th>
              <th className="px-5 py-3.5 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {deudoresFiltrados.map((d) => {
              const nivel = nivelUrgenciaDeudor(d)
              const totalDeuda = d.valorCapital + d.valorIntereses

              return (
                <tr
                  key={d.id}
                  onClick={() => setSeleccionadoId(d.id)}
                  className={`cursor-pointer transition-colors group ${ESTILOS_FILA_SEMAFORO[nivel]}`}
                  title="Haga clic para ver el expediente del contribuyente y emitir oficios"
                >
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-900 group-hover:text-vinotinto transition-colors">
                      {d.nombre}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">CC/NIT: {d.documento}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-slate-800">{d.concepto}</span>
                    <p className="text-[11px] text-slate-400">{d.predios.length} predio(s) vinculados</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block rounded-md border border-slate-200/80 bg-white/80 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                      {d.estadoProceso}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-600 text-xs">{d.vigenciaAdeudada}</td>
                  <td className="px-5 py-3.5 text-right font-bold text-slate-900 tabular-nums">
                    {formatCOP(totalDeuda)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-slate-400 group-hover:text-vinotinto group-hover:translate-x-0.5 inline-block transition-transform">
                      →
                    </span>
                  </td>
                </tr>
              )
            })}

            {deudoresFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                  <p className="text-sm font-semibold text-slate-900">No se encontraron expedientes con los filtros aplicados</p>
                  <p className="mt-1 text-xs text-slate-400">Ajuste los criterios de búsqueda o restablezca los filtros.</p>
                  <button
                    type="button"
                    onClick={handleLimpiarFiltros}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Restablecer Filtros
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer / Ficha Judicial del Deudor */}
      {seleccionado && (
        <FichaDeudor
          key={seleccionado.id}
          deudor={seleccionado}
          onClose={() => setSeleccionadoId(null)}
          onAgregarOficio={(oficio) => handleAgregarOficio(seleccionado.id, oficio)}
        />
      )}
    </div>
  )
}

function FichaDeudor({
  deudor,
  onClose,
  onAgregarOficio,
}: {
  deudor: Deudor
  onClose: () => void
  onAgregarOficio: (nuevoOficio: OficioHistorial) => void
}) {
  const nivel = nivelUrgenciaDeudor(deudor)
  const total = deudor.valorCapital + deudor.valorIntereses

  const [mostrarFormOficio, setMostrarFormOficio] = useState(false)
  const [tipoOficio, setTipoOficio] = useState('Notificación Mandamiento de Pago')
  const [descOficio, setDescOficio] = useState('')
  const [notificacionExito, setNotificacionExito] = useState<string | null>(null)

  const handleCrearOficio = (e: React.FormEvent) => {
    e.preventDefault()
    if (!descOficio.trim()) return

    const nuevo: OficioHistorial = {
      fecha: new Date().toISOString(),
      tipo: tipoOficio,
      descripcion: descOficio.trim(),
    }
    onAgregarOficio(nuevo)
    setDescOficio('')
    setMostrarFormOficio(false)
    setNotificacionExito('Actuación procesal agregada al expediente exitosamente.')
    setTimeout(() => setNotificacionExito(null), 3000)
  }

  const handleDescargarMandamiento = () => {
    setNotificacionExito(`Generando Mandamiento de Pago Oficial para el contribuyente ${deudor.nombre}...`)
    setTimeout(() => setNotificacionExito(null), 3500)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Cerrar ficha del deudor"
        onClick={onClose}
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px] transition-opacity"
      />
      <div className="relative flex h-full w-full max-w-lg animate-slide-in-right flex-col overflow-y-auto bg-white shadow-xl border-l border-slate-200">
        {/* Cabecera del Drawer Sobria */}
        <div className="border-b border-slate-800 bg-[#141212] p-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Ficha Coactiva Municipal
              </span>
              <h2 className="mt-0.5 text-lg font-semibold text-white">{deudor.nombre}</h2>
              <p className="text-xs text-slate-400">CC/NIT: {deudor.documento}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-md border border-white/20 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between pt-3 border-t border-white/10">
            <DeudorUrgenciaBadge nivel={nivel} />
            <span className="text-sm font-semibold text-white">
              Total: {formatCOP(total)}
            </span>
          </div>
        </div>

        {/* Acciones de Expediente */}
        <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-2.5 flex items-center justify-between gap-2">
          <button
            onClick={handleDescargarMandamiento}
            className="rounded-md bg-vinotinto px-3 py-1.5 text-xs font-medium text-white hover:bg-vinotinto-deep transition-colors"
          >
            Emitir Mandamiento
          </button>
          <button
            onClick={() => setMostrarFormOficio(!mostrarFormOficio)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            + Registrar Actuación
          </button>
        </div>

        {/* Mensaje de Feedback */}
        {notificacionExito && (
          <div className="mx-5 mt-3 rounded-md border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs font-medium text-emerald-900">
            ✓ {notificacionExito}
          </div>
        )}

        {/* Formulario Desplegable para Registrar Nueva Actuación */}
        {mostrarFormOficio && (
          <form onSubmit={handleCrearOficio} className="m-5 rounded-md border border-slate-200 bg-slate-50/60 p-4 text-xs space-y-3">
            <p className="font-semibold text-slate-900">Nueva Actuación Procesal</p>
            <div>
              <label className="block text-slate-500 font-medium">Tipo de Actuación:</label>
              <select
                value={tipoOficio}
                onChange={(e) => setTipoOficio(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white p-2 text-xs focus:border-slate-400 focus:outline-none"
              >
                <option>Notificación Mandamiento de Pago</option>
                <option>Oficio de Cobro Persuasivo</option>
                <option>Medida Cautelar de Embargo</option>
                <option>Resolución que liquida crédito</option>
                <option>Acuerdo de Pago Suscrito</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-medium">Observación o Detalle:</label>
              <textarea
                value={descOficio}
                onChange={(e) => setDescOficio(e.target.value)}
                rows={2}
                placeholder="Detalle de radicado, empresa de mensajería o acuerdo..."
                className="mt-1 w-full rounded-md border border-slate-200 bg-white p-2 text-xs focus:border-slate-400 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setMostrarFormOficio(false)}
                className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
              >
                Guardar en Expediente
              </button>
            </div>
          </form>
        )}

        {/* Contenido Detallado del Expediente */}
        <div className="space-y-5 p-5">
          {/* Desglose de Obligación */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Liquidación y Estado de Cuenta
            </h3>
            <dl className="mt-2 grid grid-cols-2 gap-y-2 rounded-md border border-slate-200 bg-slate-50/50 p-3.5 text-xs">
              <dt className="text-slate-500">Concepto:</dt>
              <dd className="font-medium text-slate-900">{deudor.concepto}</dd>

              <dt className="text-slate-500">Vigencias:</dt>
              <dd className="text-slate-900">{deudor.vigenciaAdeudada}</dd>

              <dt className="text-slate-500">Capital Base:</dt>
              <dd className="text-slate-900">{formatCOP(deudor.valorCapital)}</dd>

              <dt className="text-slate-500">Intereses:</dt>
              <dd className="text-slate-900">{formatCOP(deudor.valorIntereses)}</dd>

              <dt className="font-semibold text-slate-900 border-t border-slate-200 pt-2">Total Consolidado:</dt>
              <dd className="font-semibold text-vinotinto border-t border-slate-200 pt-2">
                {formatCOP(total)}
              </dd>

              <dt className="text-slate-500">Fase Actual:</dt>
              <dd className="font-medium text-slate-900">{deudor.estadoProceso}</dd>
            </dl>
          </section>

          {/* Predios Asociados */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Bienes Inmuebles Vinculados ({deudor.predios.length})
            </h3>
            <ul className="mt-2 space-y-2">
              {deudor.predios.map((p) => (
                <li
                  key={p.matricula}
                  className="rounded-md border border-slate-200 bg-white p-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">Matrícula: {p.matricula}</span>
                    <span className="text-[10px] text-slate-400">Catastro Municipal</span>
                  </div>
                  <p className="mt-0.5 text-slate-600">{p.direccion}</p>
                  <p className="mt-1 text-slate-500">
                    Avalúo: <span className="font-medium text-slate-900">{formatCOP(p.avaluoCatastral)}</span>
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Historial Procesal y Oficios */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Trazabilidad Procesal
            </h3>
            <ol className="mt-2 space-y-3 border-l-2 border-slate-200 pl-3.5">
              {deudor.historialOficios.map((o, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[19px] top-1.5 h-2 w-2 rounded-full bg-slate-400" />
                  <p className="text-[11px] font-medium text-slate-400">{formatFecha(o.fecha)}</p>
                  <p className="text-xs font-semibold text-slate-800">{o.tipo}</p>
                  <p className="text-xs text-slate-500">{o.descripcion}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  )
}
