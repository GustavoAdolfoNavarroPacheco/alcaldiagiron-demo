import { useState } from 'react'
import { Link } from 'react-router-dom'
import CustomSelect from '../../components/CustomSelect'
import { addTramiteSecretaria, nextTramiteRadicado } from '../../data/storage'
import {
  ESTABLECIMIENTOS_IVC,
  INDICADORES_SIVIGILA,
  RED_SALUD_GIRON,
  type EstablecimientoIVC,
} from '../../data/saludData'

const CATEGORIAS_IVC = [
  { value: 'Todos', label: 'Todas las categorías' },
  { value: 'Gastronomía', label: 'Gastronomía' },
  { value: 'Farmacias y Droguerías', label: 'Farmacias y Droguerías' },
  { value: 'Panaderías y Alimentos', label: 'Panaderías y Alimentos' },
  { value: 'Comercio General', label: 'Comercio General' },
]

const EPS_LIST = [
  'Nueva EPS',
  'Coosalud',
  'Sanitas EPS',
  'Salud Total',
  'Sura',
  'Otra EPS / IPS',
]

const INCIDENTES_LIST = [
  'Demora en cita de especialista (> 30 días)',
  'No entrega de medicamentos esenciales',
  'Demora en autorización quirúrgica o procedimiento',
  'Mala atención o cobros indebidos',
]

type TabSalud = 'ivc' | 'sivigila' | 'eps-ips' | 'tramites'

export default function SecretariaSaludView() {
  const [activeTab, setActiveTab] = useState<TabSalud>('ivc')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('Todos')
  const [busquedaIVC, setBusquedaIVC] = useState<string>('')
  const [establecimientoSeleccionado, setEstablecimientoSeleccionado] = useState<EstablecimientoIVC | null>(null)

  // Formulario de queja EPS/IPS
  const [epsNombre, setEpsNombre] = useState('Nueva EPS')
  const [tipoIncidente, setTipoIncidente] = useState('Demora en cita de especialista (> 30 días)')
  const [detalleIncidente, setDetalleIncidente] = useState('')
  const [afiliadoNombre, setAfiliadoNombre] = useState('')
  const [afiliadoDoc, setAfiliadoDoc] = useState('')
  const [quejaEnviada, setQuejaEnviada] = useState<string | null>(null)

  // Filtrado de establecimientos IVC
  const establecimientosFiltrados = ESTABLECIMIENTOS_IVC.filter((est) => {
    const matchCat = filtroCategoria === 'Todos' || est.categoria === filtroCategoria
    const matchBusqueda =
      est.nombre.toLowerCase().includes(busquedaIVC.toLowerCase()) ||
      est.sector.toLowerCase().includes(busquedaIVC.toLowerCase()) ||
      est.nit.includes(busquedaIVC)
    return matchCat && matchBusqueda
  })

  function handleEnviarQuejaEPS(e: React.FormEvent) {
    e.preventDefault()
    const codigoRadicado = nextTramiteRadicado('AUD-SALUD')
    const hoy = new Date().toISOString().slice(0, 10)
    addTramiteSecretaria('salud', {
      id: `salud-${Date.now()}`,
      radicado: codigoRadicado,
      titulo: `Auditoría EPS ${epsNombre}: ${tipoIncidente}`,
      solicitante: afiliadoNombre.trim() || 'Ciudadano Afiliado',
      documentoSolicitante: afiliadoDoc.trim() || 'No aportado',
      fecha: hoy,
      estado: 'En Trámite',
      prioridad: 'Alta',
      tipoTramite: 'Auditoría a EPS / IPS',
      descripcion: `Incidente con ${epsNombre}. ${tipoIncidente}. Detalle: ${detalleIncidente}`,
    })
    setQuejaEnviada(codigoRadicado)
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Cabecera institucional de la Secretaría de Salud */}
      <section className="relative overflow-hidden rounded-3xl border border-ink/8 bg-paper-card p-6 sm:p-10 shadow-card">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-vinotinto/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-dorado/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-vinotinto/15 bg-vinotinto-soft px-3.5 py-1 text-xs font-semibold text-vinotinto">
            <span className="h-1.5 w-1.5 rounded-full bg-vinotinto" />
            Secretaría de Despacho · Propuestas Técnicas IA 02 y 03
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Secretaría de Salud
          </h1>

          <p className="mt-3 text-base leading-relaxed text-ink-faint">
            Supervisión integral de la salud pública municipal, inspección y vigilancia sanitaria (IVC) de establecimientos comerciales, y auditoría ciudadana a la oportunidad de atención en EPS e IPS.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ink-faint pt-4 border-t border-ink/5">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>(607) 646 3030 Ext. 210</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>salud@giron-santander.gov.co</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Calle 30 No. 25-66, Segundo Piso</span>
            </div>
          </div>
        </div>
      </section>

      {/* Selector de módulos funcionales por pestaña */}
      <div className="flex flex-wrap gap-2 border-b border-ink/10 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('ivc')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
            activeTab === 'ivc'
              ? 'bg-vinotinto text-white shadow-glow-vinotinto'
              : 'bg-paper-card border border-ink/10 text-ink hover:border-vinotinto/30'
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>IVC Sanitario & "Negocio Más Confiable" (QR)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sivigila')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
            activeTab === 'sivigila'
              ? 'bg-vinotinto text-white shadow-glow-vinotinto'
              : 'bg-paper-card border border-ink/10 text-ink hover:border-vinotinto/30'
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span>Salud Pública & SIVIGILA</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('eps-ips')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
            activeTab === 'eps-ips'
              ? 'bg-vinotinto text-white shadow-glow-vinotinto'
              : 'bg-paper-card border border-ink/10 text-ink hover:border-vinotinto/30'
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
          <span>Auditoría EPS / IPS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tramites')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
            activeTab === 'tramites'
              ? 'bg-vinotinto text-white shadow-glow-vinotinto'
              : 'bg-paper-card border border-ink/10 text-ink hover:border-vinotinto/30'
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span>Trámites y Requisitos</span>
        </button>
      </div>

      {/* PESTAÑA 1: IVC Sanitario & Reconocimiento Negocio Más Confiable */}
      {activeTab === 'ivc' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="eyebrow text-vinotinto">Propuesta Técnica 03</span>
              <h2 className="font-display text-2xl font-bold text-ink">
                Consulta y Validación de Conceptos Sanitarios (IVC)
              </h2>
              <p className="text-xs text-ink-faint mt-1">
                Verifique si los restaurantes, farmacias y comercios de Girón cumplen con las normas higiénico-sanitarias y cuentan con el distintivo oficial.
              </p>
            </div>

            <Link
              to="/ciudadano/radicar"
              className="btn-vinotinto text-xs whitespace-nowrap self-start sm:self-auto"
            >
              Solicitar Visita de Inspección
            </Link>
          </div>

          {/* Filtros y buscador */}
          <div className="grid gap-3 sm:grid-cols-12">
            <div className="sm:col-span-8 relative">
              <input
                type="text"
                value={busquedaIVC}
                onChange={(e) => setBusquedaIVC(e.target.value)}
                placeholder="Buscar por nombre de negocio, NIT o sector (ej. Centro, Poblado)..."
                className="field pl-9 text-xs"
              />
              <svg className="h-4 w-4 text-ink-faint absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            <div className="sm:col-span-4">
              <CustomSelect
                value={filtroCategoria}
                onChange={setFiltroCategoria}
                options={CATEGORIAS_IVC}
              />
            </div>
          </div>

          {/* Lista de establecimientos en grilla de 2 columnas */}
          <div className="grid gap-4 sm:grid-cols-2">
            {establecimientosFiltrados.map((est) => (
              <div
                key={est.id}
                className="rounded-2xl border border-ink/8 bg-paper-card p-5 shadow-card hover:border-vinotinto/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-ink-faint tracking-wider">
                        {est.categoria} · {est.sector}
                      </span>
                      <h3 className="font-display font-semibold text-base text-ink mt-0.5">
                        {est.nombre}
                      </h3>
                      <p className="font-mono text-xs text-ink-faint">NIT: {est.nit}</p>
                    </div>

                    {est.esNegocioConfiable && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-girverde/10 border border-girverde/20 px-2 py-0.5 font-mono text-[10px] font-bold text-girverde-deep">
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Negocio Más Confiable
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-ink-soft">
                    <span className="font-medium text-ink">Dirección:</span> {est.direccion}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-paper p-3 border border-ink/5 text-xs">
                    <div>
                      <span className="text-[10px] text-ink-faint block">Concepto Sanitario</span>
                      <span className={`font-semibold ${
                        est.concepto === 'Favorable'
                          ? 'text-girverde-deep'
                          : est.concepto === 'Favorable con Requerimientos'
                          ? 'text-semaforo-amarillo'
                          : 'text-semaforo-rojo'
                      }`}>
                        {est.concepto}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-faint block">Puntaje Inspección</span>
                      <span className="font-mono font-bold text-ink">{est.calificacion} / 100</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-ink/5 flex justify-between text-[11px] text-ink-faint">
                      <span>Vigencia hasta: <strong>{est.vigencia}</strong></span>
                      <span className="font-mono text-vinotinto font-semibold">{est.codigoQR}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-ink/5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setEstablecimientoSeleccionado(est)}
                    className="font-mono text-xs text-vinotinto font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Ver Certificado y QR Oficial</span>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal / Ficha de Certificado Sanitario Oficial con QR */}
          {establecimientoSeleccionado && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm animate-fade-in">
              <div className="w-full max-w-md rounded-3xl border border-ink/10 bg-paper-card p-6 sm:p-8 shadow-card space-y-6">
                <div className="flex items-center justify-between border-b border-ink/8 pb-4">
                  <div>
                    <span className="eyebrow text-vinotinto">Certificación Sanitaria Oficial</span>
                    <h3 className="font-display text-lg font-bold text-ink">
                      {establecimientoSeleccionado.nombre}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEstablecimientoSeleccionado(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint hover:bg-ink/5"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Tarjeta de certificado visual */}
                <div className="rounded-2xl border-2 border-vinotinto/30 bg-paper p-5 text-center space-y-4">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-ink/15 bg-white p-2 shadow-sm">
                    {/* Simulación de código QR oficial con SVG */}
                    <svg className="h-full w-full text-ink" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="2" y="2" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="4" y="4" width="4" height="4" />
                      <rect x="14" y="2" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="16" y="4" width="4" height="4" />
                      <rect x="2" y="14" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="4" y="16" width="4" height="4" />
                      <rect x="13" y="13" width="3" height="3" />
                      <rect x="18" y="13" width="3" height="3" />
                      <rect x="14" y="18" width="7" height="3" />
                    </svg>
                  </div>

                  <div>
                    <span className="font-mono text-xs font-bold text-vinotinto tracking-wider block">
                      {establecimientoSeleccionado.codigoQR}
                    </span>
                    <p className="text-[11px] text-ink-faint mt-0.5">
                      Verificable con cualquier lector QR ciudadano
                    </p>
                  </div>

                  <div className="text-left text-xs space-y-1.5 border-t border-ink/10 pt-3">
                    <div className="flex justify-between">
                      <span className="text-ink-faint">Concepto Sanitario:</span>
                      <span className="font-bold text-girverde-deep">{establecimientoSeleccionado.concepto}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-faint">Calificación:</span>
                      <span className="font-mono font-bold text-ink">{establecimientoSeleccionado.calificacion}% Cumplimiento</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-faint">Vigencia Anual:</span>
                      <span className="font-mono text-ink">Hasta {establecimientoSeleccionado.vigencia}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-faint">Inspector Responsable:</span>
                      <span className="text-ink text-[11px] truncate max-w-[170px]">{establecimientoSeleccionado.inspector}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn-vinotinto text-xs flex-1 text-center"
                  >
                    Imprimir Constancia
                  </button>
                  <button
                    type="button"
                    onClick={() => setEstablecimientoSeleccionado(null)}
                    className="btn-ghost text-xs flex-1 text-center"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 2: Observatorio SIVIGILA & Salud Pública */}
      {activeTab === 'sivigila' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <span className="eyebrow text-vinotinto">Propuesta Técnica 02</span>
            <h2 className="font-display text-2xl font-bold text-ink">
              Observatorio Epidemiológico Municipal (SIVIGILA Girón)
            </h2>
            <p className="text-xs text-ink-faint mt-1">
              Monitoreo continuo de eventos de interés en salud pública, coberturas de vacunación e intervenciones territoriales.
            </p>
          </div>

          {/* Tarjetas de Indicadores Epidemiológicos */}
          <div className="grid gap-4 sm:grid-cols-3">
            {INDICADORES_SIVIGILA.map((ind) => (
              <div
                key={ind.evento}
                className="rounded-2xl border border-ink/8 bg-paper-card p-5 shadow-card space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-[10px] text-vinotinto font-semibold">Evento Vigilado</span>
                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ind.tendencia === 'En Descenso'
                      ? 'bg-girverde/10 text-girverde-deep'
                      : ind.tendencia === 'Estable'
                      ? 'bg-ink/5 text-ink-soft'
                      : 'bg-semaforo-amarillo/15 text-semaforo-amarillo'
                  }`}>
                    {ind.tendencia}
                  </span>
                </div>

                <h3 className="font-display font-semibold text-sm text-ink">{ind.evento}</h3>

                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-bold text-ink">{ind.casosSemana}</span>
                  <span className="text-xs text-ink-faint">casos notificados semana</span>
                </div>

                <div className="pt-2 border-t border-ink/5 text-xs text-ink-faint space-y-1">
                  <p><strong className="text-ink">Acción:</strong> {ind.intervencion}</p>
                  <p className="font-mono text-[11px] text-girverde-deep">{ind.coberturaControl}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Red de Salud de Girón */}
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-ink/5 pb-3">
              <div>
                <h3 className="font-display font-semibold text-base text-ink">
                  Red Municipal de Atención y Vacunación
                </h3>
                <p className="text-xs text-ink-faint">Centros y puestos de salud oficiales en Girón</p>
              </div>
              <span className="font-mono text-xs font-semibold text-vinotinto bg-vinotinto/10 px-2.5 py-1 rounded">
                Clínica Girón E.S.E.
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {RED_SALUD_GIRON.map((punto) => (
                <div key={punto.nombre} className="rounded-xl bg-paper p-4 border border-ink/5 space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-ink text-sm">{punto.nombre}</h4>
                    <span className="font-mono text-[10px] text-ink-faint bg-white px-2 py-0.5 rounded border border-ink/10">
                      {punto.tipo}
                    </span>
                  </div>
                  <p className="text-ink-soft">{punto.direccion}</p>
                  <p className="text-ink-faint font-mono">{punto.telefono} · {punto.horario}</p>
                  <div className="pt-2 flex flex-wrap gap-1">
                    {punto.servicios.map((s) => (
                      <span key={s} className="rounded bg-white/80 border border-ink/5 px-1.5 py-0.5 text-[10px] text-ink-soft">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: Auditoría a EPS / IPS */}
      {activeTab === 'eps-ips' && (
        <div className="grid gap-8 lg:grid-cols-12 animate-fade-in">
          <div className="lg:col-span-8 space-y-6">
            <div>
              <span className="eyebrow text-vinotinto">Propuesta Técnica 02</span>
              <h2 className="font-display text-2xl font-bold text-ink">
                Auditoría y Defensa del Usuario ante EPS e IPS
              </h2>
              <p className="text-xs text-ink-faint mt-1">
                La Secretaría de Salud de Girón ejerce vigilancia sobre las empresas prestadoras para garantizar que no se vulneren sus derechos en salud.
              </p>
            </div>

            {quejaEnviada ? (
              <div className="rounded-2xl border border-girverde/30 bg-girverde/5 p-6 shadow-card space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-girverde text-white">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-ink">Requerimiento Radicado con Éxito</h3>
                    <p className="text-xs text-ink-faint">
                      Código de Auditoría Municipal: <span className="font-mono font-bold text-ink">{quejaEnviada}</span>
                    </p>
                  </div>
                </div>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Su reporte contra <strong>{epsNombre}</strong> ha sido remitido al equipo de auditoría médica municipal.
                  La EPS cuenta con 48 horas hábiles para dar respuesta formal y destrabar la atención requerida.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuejaEnviada(null)
                    setDetalleIncidente('')
                  }}
                  className="btn-vinotinto text-xs"
                >
                  Radicar otro reporte
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnviarQuejaEPS} className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">Nombre de su EPS *</label>
                    <CustomSelect
                      value={epsNombre}
                      onChange={setEpsNombre}
                      options={EPS_LIST}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">Tipo de Inconformidad *</label>
                    <CustomSelect
                      value={tipoIncidente}
                      onChange={setTipoIncidente}
                      options={INCIDENTES_LIST}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">Nombre del Afiliado / Paciente *</label>
                    <input
                      required
                      value={afiliadoNombre}
                      onChange={(e) => setAfiliadoNombre(e.target.value)}
                      placeholder="Ej. María Elena Delgado"
                      className="field text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">Documento de Identidad *</label>
                    <input
                      required
                      value={afiliadoDoc}
                      onChange={(e) => setAfiliadoDoc(e.target.value)}
                      placeholder="Ej. 63512890"
                      className="field font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Detalle del Incidente *</label>
                  <textarea
                    required
                    rows={4}
                    value={detalleIncidente}
                    onChange={(e) => setDetalleIncidente(e.target.value)}
                    placeholder="Especifique especialidad requerida, medicamento pendiente, fecha de la orden médica o centro asistencial..."
                    className="field text-xs resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button type="submit" className="btn-vinotinto text-xs px-6">
                    Radicar Queja ante Auditoría Municipal
                  </button>
                </div>
              </form>
            )}
          </div>

          <aside className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-ink/8 bg-paper-card p-5 shadow-card text-xs space-y-3">
              <h4 className="font-display font-semibold text-sm text-ink">Plazos de Auditoría a EPS</h4>
              <p className="text-ink-faint leading-relaxed">
                De acuerdo con la Circular 016 de la Superintendencia Nacional de Salud:
              </p>
              <ul className="space-y-2 text-ink-soft">
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-vinotinto">·</span>
                  <span>Citas de medicina especializada: máximo 3 a 5 días hábiles según patología.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-vinotinto">·</span>
                  <span>Medicamentos no entregados: máximo 48 horas con entrega domiciliaria.</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      )}

      {/* PESTAÑA 4: Trámites y Requisitos Sanitarios */}
      {activeTab === 'tramites' && (
        <div className="grid gap-6 sm:grid-cols-2 animate-fade-in">
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-vinotinto">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <h3 className="font-display font-semibold text-base text-ink">Carné de Manipulación de Alimentos</h3>
            </div>
            <p className="text-xs text-ink-faint leading-relaxed">
              Requisito indispensable para cualquier persona que labore en restaurantes, cafeterías, panaderías o expendios de carne en Girón.
            </p>
            <ul className="space-y-1.5 text-xs text-ink-soft border-t border-ink/5 pt-3">
              <li>1. Curso de manipulación de mínimo 10 horas con entidad autorizada.</li>
              <li>2. Certificado médico de aptitud laboral para manipulación.</li>
              <li>3. Exámenes de laboratorio (Frotis faríngeo, coprológico y KOH de uñas).</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-girverde-deep">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <h3 className="font-display font-semibold text-base text-ink">Apertura de Nuevo Establecimiento</h3>
            </div>
            <p className="text-xs text-ink-faint leading-relaxed">
              Pasos sanitarios para obtener el Concepto Favorable antes de la visita de control urbano:
            </p>
            <ul className="space-y-1.5 text-xs text-ink-soft border-t border-ink/5 pt-3">
              <li>1. Matrícula mercantil de Cámara de Comercio vigente.</li>
              <li>2. Plan de saneamiento básico (control de plagas, manejo de residuos y agua potable).</li>
              <li>3. Solicitud formal de visita inspectora ante la Secretaría de Salud.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
