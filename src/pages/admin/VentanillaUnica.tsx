import { useMemo, useState, useEffect } from 'react'
import { getPQRS, savePQRS, STORAGE_EVENT } from '../../data/storage'
import { auditoriaPQRS, type AuditoriaPQRS, type PQRS, type TipoSolicitudPQRS } from '../../types'
import { formatFecha } from '../../data/format'
import { PQRSAuditoriaBadge } from '../../components/SemaforoBadge'
import RadicarCorrespondenciaModal from '../../components/admin/RadicarCorrespondenciaModal'
import CorrespondenciaEnviadaTab from '../../components/admin/CorrespondenciaEnviadaTab'
import InformesConsultasTab from '../../components/admin/InformesConsultasTab'

type VistaVentanilla = 'bandeja' | 'enviada' | 'informes'

export default function VentanillaUnica() {
  const [listaItems, setListaItems] = useState<PQRS[]>(() => getPQRS())
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null)
  const [vista, setVista] = useState<VistaVentanilla>('bandeja')
  const [mostrarRadicacion, setMostrarRadicacion] = useState(false)

  // Sincronización reactiva en vivo ante cualquier cambio en el almacenamiento
  useEffect(() => {
    const handleStorageUpdate = () => {
      setListaItems(getPQRS())
    }
    window.addEventListener(STORAGE_EVENT, handleStorageUpdate)
    window.addEventListener('storage', handleStorageUpdate)
    return () => {
      window.removeEventListener(STORAGE_EVENT, handleStorageUpdate)
      window.removeEventListener('storage', handleStorageUpdate)
    }
  }, [])

  // Filtros
  const [busqueda, setBusqueda] = useState('')
  const [filtroAuditoria, setFiltroAuditoria] = useState<AuditoriaPQRS | 'todas'>('todas')
  const [filtroDependencia, setFiltroDependencia] = useState<string>('todas')
  const [filtroTipo, setFiltroTipo] = useState<TipoSolicitudPQRS | 'todos'>('todos')

  // Listado de dependencias únicas
  const dependenciasDisponibles = useMemo(() => {
    const deps = new Set(listaItems.map((p) => p.dependencia))
    return Array.from(deps)
  }, [listaItems])

  // Elementos con cálculo de auditoría
  const conAuditoria = useMemo(
    () => listaItems.map((p) => ({ pqrs: p, auditoria: auditoriaPQRS(p) })),
    [listaItems],
  )

  // Conteos por estado de auditoría
  const conteos = useMemo(() => {
    const base: Record<AuditoriaPQRS, number> = { rojo: 0, amarillo: 0, verde: 0, azul: 0 }
    conAuditoria.forEach(({ auditoria }) => {
      base[auditoria] += 1
    })
    return base
  }, [conAuditoria])

  // Filtrado reactivo multicriterio
  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()

    return conAuditoria
      .filter(({ pqrs, auditoria }) => {
        // Filtro por texto
        if (q) {
          const matchRadicado = pqrs.radicado.toLowerCase().includes(q)
          const matchAsunto = pqrs.asunto.toLowerCase().includes(q)
          const matchSolicitante = pqrs.solicitante.toLowerCase().includes(q)
          const matchDoc = pqrs.documentoSolicitante.includes(q)
          if (!matchRadicado && !matchAsunto && !matchSolicitante && !matchDoc) return false
        }

        // Filtro por auditoría
        if (filtroAuditoria !== 'todas' && auditoria !== filtroAuditoria) {
          return false
        }

        // Filtro por dependencia
        if (filtroDependencia !== 'todas' && pqrs.dependencia !== filtroDependencia) {
          return false
        }

        // Filtro por tipo
        if (filtroTipo !== 'todos' && pqrs.tipo !== filtroTipo) {
          return false
        }

        return true
      })
      .sort((a, b) => a.pqrs.fechaLimite.localeCompare(b.pqrs.fechaLimite))
  }, [conAuditoria, busqueda, filtroAuditoria, filtroDependencia, filtroTipo])

  const hayFiltrosActivos =
    busqueda !== '' ||
    filtroAuditoria !== 'todas' ||
    filtroDependencia !== 'todas' ||
    filtroTipo !== 'todos'

  const handleLimpiarFiltros = () => {
    setBusqueda('')
    setFiltroAuditoria('todas')
    setFiltroDependencia('todas')
    setFiltroTipo('todos')
  }

  const obtenerIniciales = (nombre: string) => {
    const p = nombre.trim().split(/\s+/)
    if (p.length >= 2) return `${p[0][0]}${p[1][0]}`.toUpperCase()
    return nombre.slice(0, 2).toUpperCase()
  }

  const seleccionado = listaItems.find((p) => p.id === seleccionadoId) ?? null

  const handleResolverPQRS = (id: string, respuestaTexto: string) => {
    const actualizados = listaItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          estado: 'Resuelta' as const,
          fechaRespuesta: new Date().toISOString().split('T')[0],
          respuestaOficial: respuestaTexto.trim() || 'Se ha resuelto favorablemente y notificado al ciudadano conforme al procedimiento administrativo.',
          archivoAdjunto: respuestaTexto ? 'RespuestaOficial_Firmada.pdf' : item.archivoAdjunto,
        }
      }
      return item
    })
    savePQRS(actualizados)
    setListaItems(actualizados)
  }

  return (
    <div className="space-y-6">
      {/* Encabezado Corporativo y KPIs */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Control y Auditoría de Ventanilla Única (PQRS)
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Monitoreo en tiempo real de términos legales de respuesta según la Ley 1755 de 2015 en San Juan de Girón.
          </p>
        </div>

        {/* Resumen Ejecutivo Dinámico */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-right shadow-2xs">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Vencidas</p>
            <p className="text-base font-bold text-rose-600 tabular-nums">{conteos.rojo}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-right shadow-2xs">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">En Plazo</p>
            <p className="text-base font-bold text-amber-600 tabular-nums">{conteos.amarillo}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-right shadow-2xs">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Atendidas</p>
            <p className="text-base font-bold text-emerald-700 tabular-nums">{conteos.verde + conteos.azul}</p>
          </div>
          <button
            type="button"
            onClick={() => setMostrarRadicacion(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-vinotinto px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-vinotinto-deep transition-colors shrink-0"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Radicar Correspondencia
          </button>
        </div>
      </div>

      {/* Selector de Módulos: Bandeja / Correspondencia Enviada / Informes */}
      <div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-slate-100/90 p-1 text-xs">
        {(
          [
            { id: 'bandeja', label: 'Correspondencia Recibida' },
            { id: 'enviada', label: 'Correspondencia Enviada' },
            { id: 'informes', label: 'Informes y Consultas' },
          ] as const
        ).map((tab) => {
          const activo = vista === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setVista(tab.id)}
              className={`rounded-md px-3.5 py-1.5 font-medium transition-all ${
                activo ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {vista === 'enviada' && <CorrespondenciaEnviadaTab items={listaItems} />}
      {vista === 'informes' && <InformesConsultasTab items={listaItems} />}

      {vista === 'bandeja' && (
      <>
      {/* Barra de Filtros y Búsqueda Unificada Enterprise */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3.5">
        <div className="grid gap-3 md:grid-cols-12">
          {/* Buscador de Texto */}
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
              placeholder="Buscar por radicado, solicitante, cédula o asunto..."
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

          {/* Filtro por Dependencia */}
          <div className="md:col-span-3">
            <select
              value={filtroDependencia}
              onChange={(e) => setFiltroDependencia(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all font-medium"
            >
              <option value="todas">Todas las Dependencias</option>
              {dependenciasDisponibles.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Tipo de Solicitud */}
          <div className="md:col-span-3">
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as TipoSolicitudPQRS | 'todos')}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all font-medium"
            >
              <option value="todos">Todos los Tipos (PQRS)</option>
              <option value="Petición">Petición</option>
              <option value="Queja">Queja</option>
              <option value="Reclamo">Reclamo</option>
              <option value="Sugerencia">Sugerencia</option>
              <option value="Denuncia">Denuncia</option>
            </select>
          </div>
        </div>

        {/* Selector Segmentado de Término Legal (Semáforo Dinámico) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Auditoría:
            </span>
            <div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-slate-100/90 p-1 text-xs">
              {[
                { id: 'todas', label: 'Todas', dot: null, count: listaItems.length },
                { id: 'rojo', label: 'Vencidas', dot: 'bg-rose-500', count: conteos.rojo },
                { id: 'amarillo', label: 'En Plazo Legal', dot: 'bg-amber-500', count: conteos.amarillo },
                { id: 'verde', label: 'A Tiempo', dot: 'bg-emerald-500', count: conteos.verde },
                { id: 'azul', label: 'Fuera de Términos', dot: 'bg-sky-500', count: conteos.azul },
              ].map((btn) => {
                const activo = filtroAuditoria === btn.id
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setFiltroAuditoria(btn.id as AuditoriaPQRS | 'todas')}
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

      {/* Tabla Corporativa de Radicados */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3.5">Radicado</th>
              <th className="px-5 py-3.5">Tipo & Asunto</th>
              <th className="px-5 py-3.5">Ciudadano Solicitante</th>
              <th className="px-5 py-3.5">Dependencia</th>
              <th className="px-5 py-3.5">Fecha Límite</th>
              <th className="px-5 py-3.5 text-center">Auditoría</th>
              <th className="px-5 py-3.5 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtrados.map(({ pqrs, auditoria }) => {
              const iniciales = obtenerIniciales(pqrs.solicitante)

              return (
                <tr
                  key={pqrs.id}
                  onClick={() => setSeleccionadoId(pqrs.id)}
                  className="cursor-pointer transition-colors hover:bg-slate-50/80 group"
                  title="Haga clic para auditar la solicitud y proyectar respuesta oficial"
                >
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-900 group-hover:text-vinotinto transition-colors">
                      {pqrs.radicado}
                    </span>
                    <p className="text-[11px] text-slate-400 font-mono">Rad: {formatFecha(pqrs.fechaRadicacion)}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                      {pqrs.tipo}
                    </span>
                    <p className="mt-1 text-slate-900 line-clamp-1 font-medium">{pqrs.asunto}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-[11px] font-bold text-slate-700">
                        {iniciales}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{pqrs.solicitante}</p>
                        <p className="text-[11px] text-slate-400 font-mono">CC: {pqrs.documentoSolicitante}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{pqrs.dependencia}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-600 text-xs">{formatFecha(pqrs.fechaLimite)}</td>
                  <td className="px-5 py-3.5 text-center">
                    <PQRSAuditoriaBadge nivel={auditoria} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-slate-400 group-hover:text-vinotinto group-hover:translate-x-0.5 inline-block transition-transform">
                      →
                    </span>
                  </td>
                </tr>
              )
            })}

            {filtrados.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                  <p className="text-sm font-semibold text-slate-900">No se encontraron solicitudes con los filtros aplicados</p>
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

      </>
      )}

      {/* Drawer / Gestión y Despacho de Radicado */}
      {seleccionado && (
        <GestionRadicadoModal
          key={seleccionado.id}
          pqrs={seleccionado}
          onClose={() => setSeleccionadoId(null)}
          onResolver={(respuesta) => handleResolverPQRS(seleccionado.id, respuesta)}
        />
      )}

      {/* Radicación manual de correspondencia (back-office) */}
      {mostrarRadicacion && (
        <RadicarCorrespondenciaModal onClose={() => setMostrarRadicacion(false)} />
      )}
    </div>
  )
}

function GestionRadicadoModal({
  pqrs,
  onClose,
  onResolver,
}: {
  pqrs: PQRS
  onClose: () => void
  onResolver: (respuesta: string) => void
}) {
  const auditoria = auditoriaPQRS(pqrs)
  const [respuesta, setRespuesta] = useState('')
  const [exito, setExito] = useState<string | null>(null)

  const handleDespachar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!respuesta.trim()) return

    onResolver(respuesta)
    setExito('Respuesta oficial radicada exitosamente.')
    setTimeout(() => {
      setExito(null)
      onClose()
    }, 1800)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Cerrar modal de gestión"
        onClick={onClose}
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px] transition-opacity"
      />
      <div className="relative flex h-full w-full max-w-lg animate-slide-in-right flex-col overflow-y-auto bg-white shadow-xl border-l border-slate-200">
        {/* Cabecera del Drawer */}
        <div className="border-b border-slate-800 bg-[#141212] p-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Ventanilla Única
                </span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300">
                  {pqrs.tipo}
                </span>
              </div>
              <h2 className="mt-1 text-lg font-semibold text-white">{pqrs.radicado}</h2>
              <p className="text-xs text-slate-400">{pqrs.dependencia}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-md border border-white/20 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between pt-3 border-t border-white/10">
            <PQRSAuditoriaBadge nivel={auditoria} />
            <span className="text-xs text-slate-300">
              Límite legal: {formatFecha(pqrs.fechaLimite)}
            </span>
          </div>
        </div>

        {/* Mensaje de Éxito */}
        {exito && (
          <div className="mx-5 mt-3 rounded-md border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs font-medium text-emerald-900">
            ✓ {exito}
          </div>
        )}

        <div className="space-y-5 p-5">
          {/* Datos del Ciudadano */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Información del Solicitante
            </h3>
            <div className="mt-2 rounded-md border border-slate-200 bg-slate-50/50 p-3.5 text-xs">
              <div className="grid grid-cols-2 gap-y-2">
                <span className="text-slate-500">Nombre:</span>
                <span className="font-medium text-slate-900">{pqrs.solicitante}</span>
                <span className="text-slate-500">Tipo de usuario:</span>
                <span className="text-slate-900">{pqrs.tipoUsuario ?? 'Registrado'}</span>
                <span className="text-slate-500">Documento:</span>
                <span className="text-slate-900">{pqrs.documentoSolicitante}</span>
                <span className="text-slate-500">Correo:</span>
                <span className="text-slate-900 font-mono">{pqrs.correo || '—'}</span>
                <span className="text-slate-500">Teléfono:</span>
                <span className="text-slate-900 font-mono">{pqrs.telefono || '—'}</span>
                <span className="text-slate-500">Dirección:</span>
                <span className="text-slate-900">{pqrs.direccion || '—'}</span>
                <span className="text-slate-500">Radicación:</span>
                <span className="text-slate-900">{formatFecha(pqrs.fechaRadicacion)}</span>
                <span className="text-slate-500">Estado:</span>
                <span className="font-medium text-slate-900">{pqrs.estado}</span>
              </div>
            </div>
          </section>

          {/* Asunto y Contenido de la Solicitud */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Detalle de la Solicitud
            </h3>
            <div className="mt-2 rounded-md border border-slate-200 bg-white p-3.5 text-xs">
              <p className="font-medium text-slate-900">{pqrs.asunto}</p>
              <div className="mt-3 border-t border-slate-100 pt-2.5 text-slate-500">
                <span>Adjunto: {pqrs.archivoAdjunto ?? 'Formulario oficial diligenciado'}</span>
              </div>
            </div>
          </section>

          {/* Datos de Radicación Interna (Gestión Documental) — solo si fue radicado presencialmente */}
          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Radicación
              </h3>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                  pqrs.origen === 'Radicación Presencial'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-sky-100 text-sky-700'
                }`}
              >
                {pqrs.origen ?? 'Portal Digital'}
              </span>
            </div>

            {pqrs.origen === 'Radicación Presencial' ? (
              <div className="mt-2 rounded-md border border-slate-200 bg-white p-3.5 text-xs space-y-2">
                <div className="grid grid-cols-2 gap-y-2">
                  {pqrs.tipoCorrespondencia && (
                    <>
                      <span className="text-slate-500">Tipo de correspondencia:</span>
                      <span className="text-slate-900">{pqrs.tipoCorrespondencia}</span>
                    </>
                  )}
                  {pqrs.prioridad && (
                    <>
                      <span className="text-slate-500">Prioridad:</span>
                      <span className="font-medium text-slate-900">{pqrs.prioridad}</span>
                    </>
                  )}
                  {pqrs.empresaRemitente && (
                    <>
                      <span className="text-slate-500">Empresa/Remitente:</span>
                      <span className="text-slate-900">{pqrs.empresaRemitente}</span>
                    </>
                  )}
                  {pqrs.numeroGuia && (
                    <>
                      <span className="text-slate-500">No. Guía:</span>
                      <span className="font-mono text-slate-900">{pqrs.numeroGuia}</span>
                    </>
                  )}
                  {pqrs.mensajero && (
                    <>
                      <span className="text-slate-500">Mensajero:</span>
                      <span className="text-slate-900">{pqrs.mensajero}</span>
                    </>
                  )}
                  {pqrs.funcionarioDestino && (
                    <>
                      <span className="text-slate-500">Funcionario destino:</span>
                      <span className="text-slate-900">{pqrs.funcionarioDestino}</span>
                    </>
                  )}
                  <span className="text-slate-500">Folios / Anexos:</span>
                  <span className="text-slate-900">{pqrs.numeroFolios ?? 0} / {pqrs.anexos ?? 0}</span>
                  <span className="text-slate-500">Digitalizado:</span>
                  <span className="text-slate-900">{pqrs.digitalizado ? 'Sí' : 'No'}</span>
                  <span className="text-slate-500">Privada / Múltiple:</span>
                  <span className="text-slate-900">
                    {pqrs.correspondenciaPrivada ? 'Privada' : 'Pública'} · {pqrs.destinoMultiple ? 'Múltiples oficinas' : 'Una oficina'}
                  </span>
                </div>
                {pqrs.observacionesInternas && (
                  <div className="border-t border-slate-100 pt-2 text-slate-600">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Observaciones internas
                    </span>
                    {pqrs.observacionesInternas}
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-2 text-[11px] text-slate-400">
                Radicado directamente por el ciudadano a través del portal digital de la Alcaldía.
              </p>
            )}
          </section>

          {/* Despacho y Respuesta Oficial */}
          <section className="rounded-md border border-slate-200 bg-slate-50/50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              {pqrs.estado === 'Resuelta' ? 'Respuesta Oficial' : 'Emitir Respuesta'}
            </h3>

            {pqrs.estado === 'Resuelta' ? (
              <div className="mt-2 rounded-md border border-emerald-200 bg-emerald-50/70 p-3 text-xs space-y-2">
                <p className="font-semibold text-emerald-950">Solicitud resuelta formalmente</p>
                {pqrs.respuestaOficial && (
                  <div className="rounded border border-emerald-200/80 bg-white p-2.5 text-slate-800">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Concepto o Decisión Notificada:
                    </span>
                    <p className="text-xs leading-relaxed">{pqrs.respuestaOficial}</p>
                  </div>
                )}
                <p className="text-emerald-800 text-[11px]">
                  Fecha de Notificación: {pqrs.fechaRespuesta ? formatFecha(pqrs.fechaRespuesta) : 'Registrada'}
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => alert(`Descargando copia oficial de respuesta para el radicado ${pqrs.radicado}`)}
                    className="text-xs font-semibold text-emerald-900 underline hover:text-emerald-700"
                  >
                    Descargar Oficio de Respuesta (PDF) →
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDespachar} className="mt-2 space-y-3">
                <textarea
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  rows={4}
                  required
                  placeholder="Ingrese el texto de respuesta oficial para notificar al ciudadano..."
                  className="w-full rounded-md border border-slate-200 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="rounded-md bg-vinotinto px-3.5 py-1.5 text-xs font-medium text-white hover:bg-vinotinto-deep transition-colors"
                  >
                    Radicar y Notificar Respuesta
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
