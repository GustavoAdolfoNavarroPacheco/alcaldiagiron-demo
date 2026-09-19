import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllSecretarias } from '../../data/secretariasData'
import { getPQRS } from '../../data/storage'
import { auditoriaPQRS } from '../../types'
import { formatCOP } from '../../data/format'
import GraficaDonutMunicipal, { type SegmentoMunicipal } from '../../components/admin/GraficaDonutMunicipal'
import FiltroFechasAdmin, { type FiltroFechaState } from '../../components/admin/FiltroFechasAdmin'
import TablaResumenSecretarias, { type FilaResumenSecretaria } from '../../components/admin/TablaResumenSecretarias'

// Colores institucionales de Girón asignados a las dependencias
const COLORES_SECRETARIAS: Record<string, string> = {
  hacienda: '#6F1413', // Vinotinto Oficial
  salud: '#00673D', // Verde Esmeralda
  educacion: '#3366CC', // Azul GovCo
  infraestructura: '#FBBB05', // Dorado Girón
  'ordenamiento-territorial': '#8C2220', // Vinotinto Claro
  'seguridad-gestion-riesgo': '#1F2937', // Pizarra
  'transito-transporte': '#092AA1', // Azul Tránsito
  planeacion: '#4D0E0D', // Vinotinto Profundo
  gobierno: '#D97706', // Ámbar
  'desarrollo-social': '#059669', // Esmeralda Claro
  'cultura-turismo-deporte': '#B45309', // Ocre Dorado
}

export default function AdminResumen() {
  const secretarias = useMemo(() => getAllSecretarias(), [])
  const pqrsBase = useMemo(() => getPQRS(), [])

  // Estado del Filtro de Fechas
  const [filtroFecha, setFiltroFecha] = useState<FiltroFechaState>({
    modo: '2026',
    fechaInicio: '2026-01-01',
    fechaFin: '2026-12-31',
    etiqueta: 'Vigencia Fiscal 2026',
  })

  // Sincronización de hover entre Tabla y Gráfica Donut
  const [hoverId, setHoverId] = useState<string | null>(null)

  // Totales institucionales consolidados
  const kpis = useMemo(() => {
    const totalAsignado = secretarias.reduce((sum, s) => sum + s.indicadores.presupuestoAsignado, 0)
    const totalEjecutado = secretarias.reduce((sum, s) => sum + s.indicadores.presupuestoEjecutado, 0)
    const pctEjecucion = Math.round((totalEjecutado / (totalAsignado || 1)) * 100)
    const totalTramites = secretarias.reduce((sum, s) => sum + s.indicadores.tramitesTotal, 0)
    const enTramiteActivo = secretarias.reduce((sum, s) => sum + s.indicadores.enTramite, 0)

    return {
      totalAsignado,
      totalEjecutado,
      pctEjecucion,
      totalTramites,
      enTramiteActivo,
    }
  }, [secretarias])

  // Datos para la tabla ejecutiva de secretarías
  const filasSecretarias: FilaResumenSecretaria[] = useMemo(() => {
    return secretarias.map((sec) => {
      const color = COLORES_SECRETARIAS[sec.slug] || '#6F1413'
      const pct = Math.round(
        (sec.indicadores.presupuestoEjecutado / (sec.indicadores.presupuestoAsignado || 1)) * 100,
      )

      let desempeno: 'optimo' | 'alerta' | 'critico' = 'optimo'
      let desempenoDetalle = 'Ejecución presupuestal y trámites en ritmo programado'

      if (pct < 70 || sec.indicadores.enTramite > 25) {
        desempeno = 'alerta'
        desempenoDetalle = 'Trámites acumulados o ejecución pendiente de acelerar'
      }
      if (pct < 55) {
        desempeno = 'critico'
        desempenoDetalle = 'Bajo avance presupuestal frente al cronograma municipal'
      }

      return {
        id: sec.slug,
        slug: sec.slug,
        nombre: sec.nombre,
        titular: sec.secretario,
        valor: sec.indicadores.presupuestoAsignado,
        color,
        casos: sec.indicadores.tramitesTotal,
        presupuestoAsignado: sec.indicadores.presupuestoAsignado,
        presupuestoEjecutado: sec.indicadores.presupuestoEjecutado,
        desempeno,
        desempenoDetalle,
      }
    })
  }, [secretarias])

  // Datos para la gráfica Donut Municipal (Las 6 secretarías con mayor presupuesto)
  const datosDonut: SegmentoMunicipal[] = useMemo(() => {
    // Tomamos las principales secretarías de inversión
    return filasSecretarias
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 6)
      .map((f) => ({
        id: f.id,
        nombre: f.nombre,
        valor: f.valor,
        color: f.color,
        casos: f.casos,
        responsable: f.titular,
      }))
  }, [filasSecretarias])

  // Auditoría PQRS ciudadana
  const auditorias = pqrsBase.map(auditoriaPQRS)
  const vencidas = auditorias.filter((a) => a === 'rojo').length
  const pendientes = auditorias.filter((a) => a === 'amarillo').length
  const cumplidas = auditorias.filter((a) => a === 'verde' || a === 'azul').length

  return (
    <div className="space-y-6">
      {/* Encabezado Institucional de Gobierno Municipal */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Alcaldía de Girón</span>
            <span>/</span>
            <span className="text-vinotinto font-semibold">Resumen General</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Panel de Control y Gestión Municipal
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Monitoreo administrativo, ejecución presupuestal y trámites de las 11 secretarías de despacho.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="rounded-md border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            Imprimir Informe
          </button>
          <Link
            to="/admin/secretarias"
            className="rounded-md bg-vinotinto px-3.5 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-vinotinto-deep transition-colors"
          >
            Ver Secretarías
          </Link>
        </div>
      </div>

      {/* Selector de Período Administrativo */}
      <FiltroFechasAdmin filtroActual={filtroFecha} onChange={setFiltroFecha} />

      {/* Banner Superior de 5 KPIs Ejecutivos (Métricas de Gestión Pública Municipal) */}
      <div className="grid gap-2.5 grid-cols-2 md:grid-cols-5">
        <BannerKpiTile
          titulo="Presupuesto Asignado"
          subtitulo="Planned Budget"
          valor={formatCOP(kpis.totalAsignado)}
          detalle="Inversión total municipal"
          bgColor="bg-[#141212]"
          textColor="text-white"
        />
        <BannerKpiTile
          titulo="Presupuesto Ejecutado"
          subtitulo="Used Budget"
          valor={formatCOP(kpis.totalEjecutado)}
          detalle="Compromisos y pagos radicados"
          bgColor="bg-vinotinto"
          textColor="text-white"
        />
        <BannerKpiTile
          titulo="Eficacia de Ejecución"
          subtitulo="Used Budget %"
          valor={`${kpis.pctEjecucion}%`}
          detalle="Avance general consolidado"
          bgColor="bg-vinotinto-deep"
          textColor="text-dorado"
        />
        <BannerKpiTile
          titulo="Trámites en Proceso"
          subtitulo="In Progress"
          valor={`${kpis.enTramiteActivo}`}
          detalle="Pendientes de resolución"
          bgColor="bg-[#1F2937]"
          textColor="text-amber-400"
        />
        <BannerKpiTile
          titulo="Secretarías Activas"
          subtitulo="Despachos"
          valor="11"
          detalle="Estructura municipal de Girón"
          bgColor="bg-slate-900"
          textColor="text-white"
        />
      </div>

      {/* Bloque Central en 2 Columnas (Tabla de Secretarías a la Izquierda + Donut de Inversión a la Derecha) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Columna Izquierda: Tabla Resumen de Secretarías (Portfolio Summary) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <TablaResumenSecretarias
            filas={filasSecretarias}
            filaSeleccionadaId={hoverId}
            onHoverFila={setHoverId}
            titulo="Desempeño y Gestión por Secretaría de Despacho"
            subtitulo="Seguimiento presupuestal y trámites en San Juan de Girón"
          />
        </div>

        {/* Columna Derecha: Gráfica Donut de Participación de Inversión */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <GraficaDonutMunicipal
            datos={datosDonut}
            titulo="Inversión por Secretaría"
            subtitulo="Participación de las dependencias con mayor presupuesto"
            etiquetaCentro="Presupuesto Municipal"
            etiquetaUnidades="trámites"
            segmentoSeleccionadoId={hoverId}
            onHoverSegmento={setHoverId}
          />
        </div>
      </div>

      {/* Bloque Inferior: Ventanilla Única y Acceso Rápido a Dependencias */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Términos de Atención Ciudadana (PQRS) */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Ventanilla Única (PQRS)</h2>
              <span className="text-[11px] font-medium text-slate-400">Ley 1755 / 2015</span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              Cumplimiento de términos legales de peticiones en las secretarías.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-md border border-slate-100 bg-slate-50/70 p-2 text-center">
                <span className="text-[10px] text-slate-500 font-medium">A tiempo</span>
                <p className="mt-0.5 text-base font-bold text-emerald-700">{cumplidas}</p>
              </div>
              <div className="rounded-md border border-slate-100 bg-slate-50/70 p-2 text-center">
                <span className="text-[10px] text-slate-500 font-medium">En plazo</span>
                <p className="mt-0.5 text-base font-bold text-amber-600">{pendientes}</p>
              </div>
              <div className="rounded-md border border-slate-100 bg-slate-50/70 p-2 text-center">
                <span className="text-[10px] text-slate-500 font-medium">Vencidas</span>
                <p className="mt-0.5 text-base font-bold text-rose-600">{vencidas}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3">
            <Link to="/admin/ventanilla-unica" className="text-xs font-semibold text-vinotinto hover:underline">
              Ir a Ventanilla Única Municipal →
            </Link>
          </div>
        </div>

        {/* Directorio de Secretarías de Despacho */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Secretarías de Despacho</h2>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                11 Despachos
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              Estructura de gobierno municipal y secretarías sectoriales.
            </p>
            <div className="mt-3 text-xs text-slate-600 space-y-1">
              <p>• Trámites activos: <span className="font-semibold text-slate-900">{kpis.totalTramites} radicados</span></p>
              <p>• Inversión asignada: <span className="font-medium text-vinotinto">{formatCOP(kpis.totalAsignado)}</span></p>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3">
            <Link to="/admin/secretarias" className="text-xs font-semibold text-vinotinto hover:underline">
              Explorar las 11 Secretarías →
            </Link>
          </div>
        </div>

        {/* Plan de Desarrollo "Girón Crece Seguro" */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Plan de Desarrollo</h2>
              <span className="text-[11px] font-medium text-slate-400">2024 - 2027</span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              Ejes estratégicos del gobierno de San Juan de Girón.
            </p>
            <div className="mt-3 text-xs text-slate-600 space-y-1">
              <p>✓ Infraestructura vial y espacio público histórico</p>
              <p>✓ Seguridad ciudadana y gestión del riesgo</p>
              <p>✓ Equidad social, salud comunitaria y educación</p>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3">
            <button
              onClick={() => alert('Generando informe ejecutivo del Plan de Desarrollo Municipal...')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline"
            >
              Descargar Reporte Institucional (PDF) →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BannerKpiTile({
  titulo,
  subtitulo,
  valor,
  detalle,
  bgColor,
  textColor,
}: {
  titulo: string
  subtitulo: string
  valor: string
  detalle: string
  bgColor: string
  textColor: string
}) {
  return (
    <div className={`rounded-lg ${bgColor} p-4 shadow-xs flex flex-col justify-between transition-transform hover:-translate-y-0.5`}>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{subtitulo}</p>
        <p className="text-xs font-medium text-slate-200 mt-0.5">{titulo}</p>
      </div>
      <div className="my-2">
        <p className={`text-xl font-bold tracking-tight ${textColor}`}>{valor}</p>
      </div>
      <p className="text-[10px] text-slate-400">{detalle}</p>
    </div>
  )
}
