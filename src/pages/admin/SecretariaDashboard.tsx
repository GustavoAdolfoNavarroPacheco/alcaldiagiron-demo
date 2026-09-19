import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getSecretariaBySlug } from '../../data/secretariasData'
import type {
  EstadoTramiteSecretaria,
  EstadoRegistroSolucion,
  RegistroSolucionIA,
  SolucionTecnicaSecretaria,
  TramiteSecretaria,
  MetadatosDetalleExpediente,
} from '../../types/secretarias'
import { formatFecha } from '../../data/format'

export default function SecretariaDashboard() {
  const { slug } = useParams<{ slug: string }>()
  const secretaria = useMemo(() => getSecretariaBySlug(slug ?? ''), [slug])

  // Pestaña activa: 'solucion-[id]' o 'tramites-generales'
  const [pestanaActiva, setPestanaActiva] = useState<string>('')

  // Estado local para permitir interacción y cambios de estado en tiempo real
  const [soluciones, setSoluciones] = useState<SolucionTecnicaSecretaria[]>(() => secretaria?.solucionesTecnicas ?? [])
  const [registroSeleccionado, setRegistroSeleccionado] = useState<RegistroSolucionIA | null>(null)
  const [tramites, setTramites] = useState<TramiteSecretaria[]>(() => secretaria?.tramites ?? [])
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState<TramiteSecretaria | null>(null)

  // Filtros de búsqueda
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')

  // Reiniciar estado si cambia de secretaría
  useMemo(() => {
    if (secretaria) {
      setSoluciones(secretaria.solucionesTecnicas)
      setTramites(secretaria.tramites)
      setPestanaActiva(secretaria.solucionesTecnicas[0]?.id ?? 'tramites-generales')
      setRegistroSeleccionado(null)
      setTramiteSeleccionado(null)
      setBusqueda('')
      setFiltroEstado('todos')
    }
  }, [secretaria])

  if (!secretaria) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
        <h2 className="text-lg font-semibold text-slate-900">Secretaría no encontrada</h2>
        <p className="mt-1 text-xs text-slate-500">
          La dependencia solicitada no existe en la estructura administrativa municipal.
        </p>
        <Link
          to="/admin/secretarias"
          className="mt-4 inline-block rounded-md bg-vinotinto px-4 py-2 text-xs font-medium text-white hover:bg-vinotinto-deep"
        >
          Ver todas las Secretarías
        </Link>
      </div>
    )
  }

  const solucionActual = soluciones.find((s) => s.id === pestanaActiva) ?? null

  // Filtrado de registros de la solución activa
  const registrosFiltrados = useMemo(() => {
    if (!solucionActual) return []
    const q = busqueda.trim().toLowerCase()
    return solucionActual.registros.filter((reg) => {
      if (q) {
        const matchCodigo = reg.codigo.toLowerCase().includes(q)
        const matchTitulo = reg.titulo.toLowerCase().includes(q)
        const matchEntidad = reg.entidadOSujeto.toLowerCase().includes(q)
        if (!matchCodigo && !matchTitulo && !matchEntidad) return false
      }
      if (filtroEstado !== 'todos' && reg.estado !== filtroEstado) return false
      return true
    })
  }, [solucionActual, busqueda, filtroEstado])

  // Filtrado de trámites generales
  const tramitesFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return tramites.filter((t) => {
      if (q) {
        const matchRad = t.radicado.toLowerCase().includes(q)
        const matchTit = t.titulo.toLowerCase().includes(q)
        const matchSol = t.solicitante.toLowerCase().includes(q)
        if (!matchRad && !matchTit && !matchSol) return false
      }
      if (filtroEstado !== 'todos' && t.estado !== filtroEstado) return false
      return true
    })
  }, [tramites, busqueda, filtroEstado])

  const handleActualizarRegistro = (
    solucionId: string,
    registroId: string,
    nuevoEstado: EstadoRegistroSolucion,
    nuevoDetalle?: string,
  ) => {
    setSoluciones((prev) =>
      prev.map((sol) => {
        if (sol.id === solucionId) {
          return {
            ...sol,
            registros: sol.registros.map((r) => {
              if (r.id === registroId) {
                return {
                  ...r,
                  estado: nuevoEstado,
                  detalle: nuevoDetalle || r.detalle,
                }
              }
              return r
            }),
          }
        }
        return sol
      }),
    )
    if (registroSeleccionado?.id === registroId) {
      setRegistroSeleccionado((prev) =>
        prev
          ? {
              ...prev,
              estado: nuevoEstado,
              detalle: nuevoDetalle || prev.detalle,
            }
          : null,
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Pestañas de Soluciones Técnicas de IA y Módulos de Administración */}
      <div className="border-b border-slate-200">
        <div className="flex flex-wrap gap-2">
          {secretaria.solucionesTecnicas.map((sol) => (
            <button
              key={sol.id}
              onClick={() => {
                setPestanaActiva(sol.id)
                setBusqueda('')
                setFiltroEstado('todos')
              }}
              className={`border-b-2 px-3.5 py-2 text-xs font-semibold transition-colors ${
                pestanaActiva === sol.id
                  ? 'border-vinotinto text-vinotinto'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              {sol.nombre}
            </button>
          ))}

          <button
            onClick={() => {
              setPestanaActiva('tramites-generales')
              setBusqueda('')
              setFiltroEstado('todos')
            }}
            className={`border-b-2 px-3.5 py-2 text-xs font-semibold transition-colors ${
              pestanaActiva === 'tramites-generales'
                ? 'border-vinotinto text-vinotinto'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
            }`}
          >
            Ventanilla de Trámites Misionales
          </button>
        </div>
      </div>

      {/* Contenido de la Pestaña Activa */}
      {solucionActual ? (
        <div className="space-y-4">
          {/* Banner Descriptivo de la Solución Técnica de IA */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-vinotinto/10 px-2 py-0.5 text-[10px] font-bold text-vinotinto">
                  {solucionActual.sistemaPropuesta}
                </span>
                <span className="text-xs font-medium text-slate-400">Campuslands Full Service</span>
              </div>
              <h2 className="mt-1 text-base font-semibold text-slate-900">{solucionActual.nombre}</h2>
              <p className="mt-0.5 text-xs text-slate-500 max-w-2xl">{solucionActual.descripcion}</p>
            </div>

            {/* KPIs Especializados de la Solución */}
            <div className="flex flex-wrap gap-2.5 shrink-0">
              {solucionActual.kpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-md border border-slate-100 bg-slate-50/70 px-3.5 py-1.5 text-center min-w-[90px]"
                >
                  <p className="text-[10px] font-medium text-slate-400">{kpi.label}</p>
                  <p className="text-sm font-bold text-slate-900">{kpi.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Filtros Administrativos de la Solución */}
          <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por código, título o entidad..."
                className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <label htmlFor="filtro-estado-solucion" className="text-slate-500 font-medium">Estado:</label>
              <select
                id="filtro-estado-solucion"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 focus:border-slate-400 focus:outline-none"
              >
                <option value="todos">Todos los Estados</option>
                <option value="Emitido">Emitido</option>
                <option value="Validado">Validado</option>
                <option value="En Revisión IA">En Revisión IA</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobado">Aprobado</option>
              </select>
            </div>
          </div>

          {/* Tabla de Registros y Expedientes de la Solución de IA */}
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-600">
                  <th className="px-5 py-3">Código Oficial</th>
                  <th className="px-5 py-3">Expediente / Asunto</th>
                  <th className="px-5 py-3">Entidad / Sujeto</th>
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3">Indicador Clave</th>
                  <th className="px-5 py-3 text-center">Estado</th>
                  <th className="px-5 py-3 text-right">Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registrosFiltrados.map((reg) => (
                  <tr
                    key={reg.id}
                    onClick={() => setRegistroSeleccionado(reg)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    title="Haga clic para ver el expediente detallado e inspección de IA"
                  >
                    <td className="px-5 py-3 font-semibold text-slate-900 group-hover:text-vinotinto transition-colors">
                      {reg.codigo}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-800">{reg.titulo}</p>
                      {reg.asistenciaIA && (
                        <p className="text-[10px] text-slate-500 italic mt-0.5 line-clamp-1">
                          🤖 {reg.asistenciaIA}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-700">{reg.entidadOSujeto}</td>
                    <td className="px-5 py-3 text-slate-500">{formatFecha(reg.fecha)}</td>
                    <td className="px-5 py-3 font-medium text-vinotinto">{reg.indicadorClave}</td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                          reg.estado === 'Emitido' || reg.estado === 'Aprobado'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : reg.estado === 'Validado'
                              ? 'bg-sky-50 text-sky-800 border-sky-200'
                              : reg.estado === 'En Revisión IA'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {reg.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setRegistroSeleccionado(reg)
                        }}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-vinotinto hover:bg-slate-50 transition-colors shadow-2xs"
                      >
                        Gestionar
                      </button>
                    </td>
                  </tr>
                ))}

                {registrosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                      <p className="font-medium text-slate-800">No hay registros con los filtros seleccionados</p>
                      <p className="text-xs text-slate-400 mt-0.5">Modifique el criterio de búsqueda o el estado.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Vista de Ventanilla de Trámites Misionales Ordinarios */
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar trámite, radicado o ciudadano..."
                className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <label htmlFor="filtro-estado-tramite" className="text-slate-500 font-medium">Estado:</label>
              <select
                id="filtro-estado-tramite"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 focus:border-slate-400 focus:outline-none"
              >
                <option value="todos">Todos los Estados</option>
                <option value="En Trámite">En Trámite</option>
                <option value="Aprobado">Aprobado</option>
                <option value="En Revisión">En Revisión</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-600">
                  <th className="px-5 py-3">Radicado Oficial</th>
                  <th className="px-5 py-3">Trámite / Solicitud</th>
                  <th className="px-5 py-3">Ciudadano</th>
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3 text-center">Prioridad</th>
                  <th className="px-5 py-3 text-center">Estado</th>
                  <th className="px-5 py-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tramitesFiltrados.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setTramiteSeleccionado(item)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    title="Haga clic para ver el trámite y dar respuesta oficial"
                  >
                    <td className="px-5 py-3 font-semibold text-slate-900 group-hover:text-vinotinto transition-colors">
                      {item.radicado}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-800">{item.titulo}</p>
                      <p className="text-[11px] text-slate-400">{item.tipoTramite}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900">{item.solicitante}</p>
                      <p className="text-[11px] text-slate-400">CC: {item.documentoSolicitante}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{formatFecha(item.fecha)}</td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${
                          item.prioridad === 'Alta'
                            ? 'bg-rose-50 text-rose-700'
                            : item.prioridad === 'Media'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.prioridad}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          item.estado === 'Aprobado'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : item.estado === 'En Trámite'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {item.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setTramiteSeleccionado(item)
                        }}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-vinotinto hover:bg-slate-50 transition-colors shadow-2xs"
                      >
                        Gestionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Operativo para Solución de IA */}
      {registroSeleccionado && solucionActual && (
        <ModalGestionSolucionIA
          registro={registroSeleccionado}
          nombreSolucion={solucionActual.nombre}
          secretariaSlug={secretaria.slug}
          nombreSecretaria={secretaria.nombre}
          onClose={() => setRegistroSeleccionado(null)}
          onActualizar={(nuevoEstado, nuevoDetalle) =>
            handleActualizarRegistro(solucionActual.id, registroSeleccionado.id, nuevoEstado, nuevoDetalle)
          }
        />
      )}

      {/* Modal Operativo para Trámite General */}
      {tramiteSeleccionado && (
        <ModalGestionTramiteMisional
          tramite={tramiteSeleccionado}
          nombreSecretaria={secretaria.nombre}
          onClose={() => setTramiteSeleccionado(null)}
          onActualizar={(nuevoEstado, respuesta) => {
            setTramites((prev) =>
              prev.map((t) => (t.id === tramiteSeleccionado.id ? { ...t, estado: nuevoEstado, respuestaOficial: respuesta } : t)),
            )
            setTramiteSeleccionado(null)
          }}
        />
      )}
    </div>
  )
}

function resolverMetadatosExpediente(
  reg: RegistroSolucionIA,
  secretariaSlug: string,
): MetadatosDetalleExpediente {
  if (reg.metadatosDetalle) return reg.metadatosDetalle

  switch (secretariaSlug) {
    case 'salud':
      return {
        ubicacionSector: 'Hospital San Juan de Dios / Comuna 1, Girón',
        nivelCriticidad: reg.estado === 'En Revisión IA' ? 'Alto' : 'Medio',
        analisisPredictivoIA:
          reg.asistenciaIA ||
          'Modelo epidemiológico SIVIGILA: Se detecta concordancia diagnóstica del 96.8% con los protocolos de bioseguridad municipal y alertas tempranas.',
        propiedadesEspecificas: [
          { etiqueta: 'IPS / Entidad Prestadora', valor: reg.entidadOSujeto, destacado: true },
          { etiqueta: 'Nivel de Riesgo Sanitario', valor: 'Nivel II - Vigilancia Prioritaria' },
          { etiqueta: 'Comuna / Corregimiento', valor: 'Comuna 1 (Centro Histórico)' },
          { etiqueta: 'Dictamen de Adherencia', valor: 'Conforme con Resolución 3100 de 2019' },
        ],
        historialTrazabilidad: [
          { fecha: '2026-09-08 08:30', evento: 'Digitalización OCR de acta médica', responsable: 'Motor IA Campuslands' },
          { fecha: '2026-09-10 14:15', evento: 'Cruce con base de datos SIVIGILA', responsable: 'Dirección de Salud Pública' },
          { fecha: `${reg.fecha} 11:00`, evento: 'Revisión y consolidación de hallazgos', responsable: 'Auditoría Médica Girón' },
        ],
      }
    case 'hacienda':
      return {
        ubicacionSector: 'Sector Rincón de Girón / Casco Urbano',
        nivelCriticidad: reg.estado === 'En Revisión IA' ? 'Crítico' : 'Alto',
        analisisPredictivoIA:
          reg.asistenciaIA ||
          'Motor Tributario IA: Cálculo automatizado de liquidación oficial de aforo e interrupción del término de prescripción quinquenal.',
        propiedadesEspecificas: [
          { etiqueta: 'Contribuyente / Sujeto Pasivo', valor: reg.entidadOSujeto, destacado: true },
          { etiqueta: 'Cédula Catastral / NIT', valor: '68307-01-02-0045-0012' },
          { etiqueta: 'Vigencia Fiscal Fiscalizada', valor: '2024 - 2026' },
          { etiqueta: 'Riesgo de Insolvencia', valor: 'Medio (Calificación B+ Datacrédito)' },
        ],
        historialTrazabilidad: [
          { fecha: '2026-09-02 09:00', evento: 'Emisión de requerimiento ordinario', responsable: 'Subdirección de Rentas' },
          { fecha: '2026-09-12 11:30', evento: 'Alerta de morosidad tributaria', responsable: 'Sistema IA Cobro Coactivo' },
          { fecha: `${reg.fecha} 16:45`, evento: 'Fijación en lista y mandamiento de pago', responsable: 'Tesorería Municipal' },
        ],
      }
    case 'educacion':
      return {
        ubicacionSector: 'Colegio Francisco Serrano Muñoz / Sede A',
        nivelCriticidad: 'Medio',
        analisisPredictivoIA:
          reg.asistenciaIA ||
          'Red neuronal convolucional: Verificación biométrica y fotográfica con 99.1% de cumplimiento de estándares nutricionales PAE.',
        propiedadesEspecificas: [
          { etiqueta: 'Institución Educativa Oficial', valor: reg.entidadOSujeto, destacado: true },
          { etiqueta: 'Código DANE Institución', valor: '168307000124' },
          { etiqueta: 'Raciones Diarias Auditadas', valor: '1.420 raciones asignadas' },
          { etiqueta: 'Índice de Permanencia', valor: '97.2% de retención escolar' },
        ],
        historialTrazabilidad: [
          { fecha: '2026-09-05 07:00', evento: 'Captura de bandeja y pesaje de menú', responsable: 'Visión Artificial Campuslands' },
          { fecha: '2026-09-08 10:20', evento: 'Validación de estándares de gramaje', responsable: 'Comité de Nutrición PAE' },
          { fecha: `${reg.fecha} 12:10`, evento: 'Certificación técnica de entrega', responsable: 'Supervisión de Despacho' },
        ],
      }
    case 'infraestructura':
      return {
        ubicacionSector: 'Anillo Vial Girón - Floridablanca Km 4.2',
        nivelCriticidad: 'Alto',
        analisisPredictivoIA:
          reg.asistenciaIA ||
          'Visión artificial por video vehicular: Detección volumétrica de severidad de ahuellamiento y cálculo de mezcla asfáltica requerida.',
        propiedadesEspecificas: [
          { etiqueta: 'Contratista / Proyecto', valor: reg.entidadOSujeto, destacado: true },
          { etiqueta: 'Polígono Geográfico', valor: 'Tramo 4 / Calzada Sur Girón' },
          { etiqueta: 'Avance Físico de Obra', valor: '74.2% ejecutado' },
          { etiqueta: 'Volumen Estimado Mezcla', valor: '142 m³ de asfalto en caliente' },
        ],
        historialTrazabilidad: [
          { fecha: '2026-09-01 15:00', evento: 'Inspección por cámara vehicular con IA', responsable: 'Malla Vial Girón IA' },
          { fecha: '2026-09-07 09:45', evento: 'Priorización en plan bacheo 2026', responsable: 'Ingeniería Municipal' },
          { fecha: `${reg.fecha} 08:30`, evento: 'Apertura de orden técnica de cuadrilla', responsable: 'Secretaría de Infraestructura' },
        ],
      }
    case 'ordenamiento-territorial':
      return {
        ubicacionSector: 'Vereda Chocoita / Sector Rural de Girón',
        nivelCriticidad: 'Crítico',
        analisisPredictivoIA:
          reg.asistenciaIA ||
          'Procesamiento de imágenes satelitales Sentinel-2: Variación en índice de vegetación NDVI compatible con parcelación ilegal no autorizada.',
        propiedadesEspecificas: [
          { etiqueta: 'Predio / Sujeto Objeto de Control', valor: reg.entidadOSujeto, destacado: true },
          { etiqueta: 'Clasificación de Suelo POT', valor: 'Suelo Rural de Protección / Agrícola' },
          { etiqueta: 'Área Intervenida por Dron', valor: '3.800 m² de descapote no autorizado' },
          { etiqueta: 'Licencia Urbanística', valor: 'Sin solicitud radicada en Curaduría' },
        ],
        historialTrazabilidad: [
          { fecha: '2026-09-03 11:10', evento: 'Alerta satelital por cambio de cobertura', responsable: 'Sentinel-2 / Satélite' },
          { fecha: '2026-09-09 16:30', evento: 'Vuelo de dron con ortofotomapeo', responsable: 'Inspección Urbanística' },
          { fecha: `${reg.fecha} 10:00`, evento: 'Notificación de medida preventiva de suspensión', responsable: 'Despacho de Urbanismo' },
        ],
      }
    case 'seguridad-gestion-riesgo':
      return {
        ubicacionSector: 'Malecón Turístico / Cuadrante 3 Policía Girón',
        nivelCriticidad: 'Medio',
        analisisPredictivoIA:
          reg.asistenciaIA ||
          'Modelo predictivo espacio-temporal: Se anticipa patrón de congestión y probabilidad del 84% de hurtos menores en franja 19:00 - 22:00.',
        propiedadesEspecificas: [
          { etiqueta: 'Zona / Cuadrante de Vigilancia', valor: reg.entidadOSujeto, destacado: true },
          { etiqueta: 'Cámara C4 Vinculada', valor: 'Domo PTZ-014 Malecón Central' },
          { etiqueta: 'Tiempo Medio de Respuesta', valor: '4.8 minutos (Patrulla motorizada)' },
          { etiqueta: 'Nivel Hidrológico Río de Oro', valor: '1.42 m (Semáforo Verde Seguro)' },
        ],
        historialTrazabilidad: [
          { fecha: '2026-09-06 20:15', evento: 'Detección automática de aglomeración', responsable: 'Analítica de Video C4' },
          { fecha: '2026-09-08 21:00', evento: 'Despliegue de patrullaje preventivo', responsable: 'Estación Policía Girón' },
          { fecha: `${reg.fecha} 22:30`, evento: 'Cierre de novedad sin afectación al orden público', responsable: 'Central de Despacho 123' },
        ],
      }
    case 'transito-transporte':
      return {
        ubicacionSector: 'Autopista a Bucaramanga / Entrada a Girón',
        nivelCriticidad: 'Medio',
        analisisPredictivoIA:
          reg.asistenciaIA ||
          'Reconocimiento óptico de matrículas (ALPR): Detección automática con 99.4% de precisión en matrícula y SOAT vencido.',
        propiedadesEspecificas: [
          { etiqueta: 'Vehículo / Conductor Auditado', valor: reg.entidadOSujeto, destacado: true },
          { etiqueta: 'Infracción Codificada', valor: 'C-02 (Estacionamiento en zona prohibida)' },
          { etiqueta: 'Evidencia Gráfica', valor: '2 fotografías de alta resolución + video' },
          { etiqueta: 'Reincidencia del Infractor', valor: 'Primera infracción en 12 meses' },
        ],
        historialTrazabilidad: [
          { fecha: '2026-09-04 10:12', evento: 'Captura por cámara de fotodetección', responsable: 'Sistema ALPR Girón' },
          { fecha: '2026-09-05 14:30', evento: 'Validación por agente de tránsito', responsable: 'Agente Matrícula 409' },
          { fecha: `${reg.fecha} 15:00`, evento: 'Notificación electrónica a correo SIMIT', responsable: 'Secretaría de Tránsito' },
        ],
      }
    case 'planeacion':
      return {
        ubicacionSector: 'Municipio de Girón / Consolidado Territorial',
        nivelCriticidad: 'Bajo',
        analisisPredictivoIA:
          reg.asistenciaIA ||
          'Seguimiento a indicadores PDM: Cumplimiento de metas de producto en 94.6% respecto al cronograma del cuatrienio.',
        propiedadesEspecificas: [
          { etiqueta: 'Proyecto / Meta Estratégica', valor: reg.entidadOSujeto, destacado: true },
          { etiqueta: 'Código BPIN Municipal', valor: 'BPIN-2026-68307-0042' },
          { etiqueta: 'Línea Estratégica PDM', valor: 'Eje 1: Girón Crece Seguro y Moderno' },
          { etiqueta: 'Ponderación en Plan', valor: '3.5% del presupuesto general' },
        ],
        historialTrazabilidad: [
          { fecha: '2026-09-02 08:00', evento: 'Carga de avances de indicadores por secretaría', responsable: 'Planeación Territorial' },
          { fecha: '2026-09-10 17:00', evento: 'Auditoría automática de consistencia', responsable: 'Motor IA de Seguimiento' },
          { fecha: `${reg.fecha} 18:00`, evento: 'Generación de reporte trimestral para Concejo', responsable: 'Despacho de Planeación' },
        ],
      }
    case 'gobierno':
      return {
        ubicacionSector: 'Comuna 3 / Barrio Santa Cruz, Girón',
        nivelCriticidad: 'Bajo',
        analisisPredictivoIA:
          reg.asistenciaIA ||
          'Análisis semántico de actas comunitarias: Extracción automática de firmas, quórum decisorio y compromisos vinculantes.',
        propiedadesEspecificas: [
          { etiqueta: 'Organización Comunitaria', valor: reg.entidadOSujeto, destacado: true },
          { etiqueta: 'Número Personería Jurídica', valor: 'PJ-GIRON-2024-089' },
          { etiqueta: 'Quórum de Asamblea Registrado', valor: '82% de dignatarios asistentes' },
          { etiqueta: 'Vigencia de Dignatarios', valor: '2024 - 2028' },
        ],
        historialTrazabilidad: [
          { fecha: '2026-09-03 14:00', evento: 'Radicación de acta de elección de dignatarios', responsable: 'Presidente JAC' },
          { fecha: '2026-09-08 10:15', evento: 'Revisión jurídica de estatutos', responsable: 'Dirección de Participación' },
          { fecha: `${reg.fecha} 11:30`, evento: 'Expedición de constancia de representación legal', responsable: 'Secretaría de Gobierno' },
        ],
      }
    case 'desarrollo-social':
      return {
        ubicacionSector: 'Sector Poblado / Comuna 2, Girón',
        nivelCriticidad: 'Medio',
        analisisPredictivoIA:
          reg.asistenciaIA ||
          'Modelo de focalización de vulnerabilidad: Verificación cruzada con Registraduría y ADRES para evitar duplicidad de subsidio.',
        propiedadesEspecificas: [
          { etiqueta: 'Titular Beneficiario', valor: reg.entidadOSujeto, destacado: true },
          { etiqueta: 'Clasificación SISBÉN IV', valor: 'Grupo A4 (Pobreza Extrema)' },
          { etiqueta: 'Programa Asistencial', valor: 'Subsidio Municipal Adulto Mayor' },
          { etiqueta: 'Supervivencia Biométrica', valor: 'Confirmada mediante cotejo oficial' },
        ],
        historialTrazabilidad: [
          { fecha: '2026-09-04 09:30', evento: 'Cruce algorítmico de bases de datos sociales', responsable: 'Algoritmo de Focalización' },
          { fecha: '2026-09-09 11:20', evento: 'Visita de verificación domiciliaria', responsable: 'Trabajador Social Girón' },
          { fecha: `${reg.fecha} 14:00`, evento: 'Inclusión en nómina de giro bancarizado', responsable: 'Despacho Desarrollo Social' },
        ],
      }
    case 'cultura-turismo-deporte':
    default:
      return {
        ubicacionSector: 'Casco Antiguo Monumento Nacional, Girón',
        nivelCriticidad: 'Bajo',
        analisisPredictivoIA:
          reg.asistenciaIA ||
          'Reconocimiento computacional patrimonial: Verificación de parámetros coloniales en fachada y conservación arquitectónica.',
        propiedadesEspecificas: [
          { etiqueta: 'Espacio Cultural / Turístico', valor: reg.entidadOSujeto, destacado: true },
          { etiqueta: 'Clasificación Patrimonial', valor: 'Monumento Nacional Ley 163/1959' },
          { etiqueta: 'Aforo Máximo Registrado', valor: '450 personas simultáneas' },
          { etiqueta: 'Impacto Turístico', valor: 'Ruta Colonial de Santander' },
        ],
        historialTrazabilidad: [
          { fecha: '2026-09-05 16:00', evento: 'Inspección de elementos arquitectónicos', responsable: 'Patrimonio Cultural Girón' },
          { fecha: '2026-09-11 10:30', evento: 'Medición de aforo turístico con cámaras', responsable: 'Cultura Inteligente Campuslands' },
          { fecha: `${reg.fecha} 17:00`, evento: 'Certificado de habilitación cultural', responsable: 'Despacho de Cultura' },
        ],
      }
  }
}

function ModalGestionSolucionIA({
  registro,
  nombreSolucion,
  secretariaSlug,
  nombreSecretaria,
  onClose,
  onActualizar,
}: {
  registro: RegistroSolucionIA
  nombreSolucion: string
  secretariaSlug: string
  nombreSecretaria: string
  onClose: () => void
  onActualizar: (nuevoEstado: EstadoRegistroSolucion, nuevoDetalle?: string) => void
}) {
  const [estado, setEstado] = useState<EstadoRegistroSolucion>(registro.estado)
  const [detalle, setDetalle] = useState(registro.detalle)
  const [guardado, setGuardado] = useState(false)

  const metadatos = useMemo(
    () => resolverMetadatosExpediente(registro, secretariaSlug),
    [registro, secretariaSlug],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onActualizar(estado, detalle)
    setGuardado(true)
    setTimeout(() => {
      setGuardado(false)
      onClose()
    }, 1200)
  }

  const criticidadBadge = {
    Crítico: 'bg-rose-50 text-rose-700 border-rose-200',
    Alto: 'bg-amber-50 text-amber-700 border-amber-200',
    Medio: 'bg-sky-50 text-sky-700 border-sky-200',
    Bajo: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }[metadatos.nivelCriticidad]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
        
        {/* Cabecera del Modal con Jerarquía Institucional */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-sm border border-vinotinto/20 bg-vinotinto/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-vinotinto">
                {nombreSecretaria}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-medium text-slate-500">{nombreSolucion}</span>
            </div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900">
              {registro.codigo} · {registro.titulo}
            </h3>
            {metadatos.ubicacionSector && (
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>📍</span>
                <span>{metadatos.ubicacionSector}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Badges de Estado y Nivel de Criticidad */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
            Nivel de Criticidad:
          </span>
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${criticidadBadge}`}>
            {metadatos.nivelCriticidad}
          </span>
          <span className="text-slate-300">|</span>
          <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
            Estado Actual:
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
            {estado}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-slate-500">
            Fecha: <strong className="text-slate-700">{formatFecha(registro.fecha)}</strong>
          </span>
        </div>

        {/* Mensaje de Confirmación de Guardado */}
        {guardado && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/90 p-3 text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-in fade-in">
            <span>✓</span>
            <span>Actuación administrativa registrada y expediente actualizado con éxito en el despacho.</span>
          </div>
        )}

        {/* Ficha de Atributos Específicos de la Secretaría */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Ficha Contextual del Sector
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {metadatos.propiedadesEspecificas.map((prop) => (
              <div
                key={prop.etiqueta}
                className="rounded-md border border-slate-200/80 bg-white p-2.5 shadow-2xs"
              >
                <p className="text-[10px] font-medium text-slate-400 uppercase">{prop.etiqueta}</p>
                <p className={`text-xs font-semibold mt-0.5 ${prop.destacado ? 'text-vinotinto font-bold' : 'text-slate-800'}`}>
                  {prop.valor}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnóstico y Recomendación del Motor de IA */}
        <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🤖</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                Diagnóstico del Motor de IA Campuslands
              </h4>
            </div>
            <span className="rounded-full bg-emerald-100/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
              98.4% Confianza
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-700 bg-white/70 p-3 rounded-md border border-emerald-100">
            {metadatos.analisisPredictivoIA}
          </p>
          {registro.soporteDoc && (
            <div className="flex items-center justify-between pt-2 border-t border-emerald-200/50 text-xs">
              <span className="text-slate-600 font-medium">Expediente Digital Adjunto:</span>
              <button
                type="button"
                onClick={() => alert(`Visualizando documento soporte oficial: ${registro.soporteDoc}`)}
                className="inline-flex items-center gap-1.5 font-semibold text-vinotinto hover:underline text-xs"
              >
                <span>📄</span>
                <span>{registro.soporteDoc}</span>
                <span className="text-[10px] text-slate-400">(Descargar)</span>
              </button>
            </div>
          )}
        </div>

        {/* Trazabilidad y Cadena de Custodia Municipal (Timeline) */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Trazabilidad y Línea de Tiempo del Expediente
          </p>
          <div className="relative border-l-2 border-slate-200 pl-4 space-y-3 ml-2 text-xs">
            {metadatos.historialTrazabilidad.map((hito, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-vinotinto" />
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-semibold text-slate-800">{hito.evento}</p>
                  <span className="text-[10px] text-slate-400 shrink-0">{hito.fecha}</span>
                </div>
                <p className="text-[11px] text-slate-500">Responsable: {hito.responsable}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario de Actuación Administrativa */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-200">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estado Administrativo:
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoRegistroSolucion)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-slate-400 focus:outline-none font-medium"
              >
                <option value="Emitido">Emitido</option>
                <option value="Validado">Validado</option>
                <option value="En Revisión IA">En Revisión IA</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Archivado">Archivado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Indicador Clave Vinculado:
              </label>
              <input
                type="text"
                disabled
                value={registro.indicadorClave}
                className="w-full rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-600 font-semibold cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observaciones / Justificación de la Actuación:
            </label>
            <textarea
              rows={3}
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              placeholder="Escriba aquí el concepto técnico, justificación jurídica o actuación administrativa..."
              className="w-full rounded-md border border-slate-200 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="rounded-md bg-vinotinto px-5 py-2 text-xs font-semibold text-white hover:bg-vinotinto-deep transition-colors shadow-2xs"
            >
              Guardar Actuación
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ModalGestionTramiteMisional({
  tramite,
  nombreSecretaria,
  onClose,
  onActualizar,
}: {
  tramite: TramiteSecretaria
  nombreSecretaria: string
  onClose: () => void
  onActualizar: (nuevoEstado: EstadoTramiteSecretaria, respuesta?: string) => void
}) {
  const [estado, setEstado] = useState<EstadoTramiteSecretaria>(tramite.estado)
  const [respuesta, setRespuesta] = useState(tramite.respuestaOficial ?? '')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-xl space-y-4">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {nombreSecretaria}
            </span>
            <h3 className="text-base font-semibold text-slate-900">{tramite.radicado}</h3>
            <p className="text-xs text-slate-600 font-medium">{tramite.titulo}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm">
            ✕
          </button>
        </div>

        <div className="text-xs space-y-2 rounded-md border border-slate-100 bg-slate-50/60 p-3">
          <div className="flex justify-between">
            <span className="text-slate-500">Ciudadano:</span>
            <span className="font-semibold text-slate-900">{tramite.solicitante}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Documento:</span>
            <span className="text-slate-700">{tramite.documentoSolicitante}</span>
          </div>
          <p className="text-slate-600 pt-1 border-t border-slate-200/50">{tramite.descripcion}</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onActualizar(estado, respuesta)
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Estado de la Solicitud:
            </label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as EstadoTramiteSecretaria)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-slate-400 focus:outline-none"
            >
              <option value="En Trámite">En Trámite</option>
              <option value="Aprobado">Aprobado</option>
              <option value="En Revisión">En Revisión</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Rechazado">Rechazado</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Respuesta / Concepto Oficial:
            </label>
            <textarea
              rows={3}
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              placeholder="Ingrese el texto de resolución oficial..."
              className="w-full rounded-md border border-slate-200 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="rounded-md bg-vinotinto px-4 py-1.5 text-xs font-semibold text-white hover:bg-vinotinto-deep transition-colors"
            >
              Guardar Respuesta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
