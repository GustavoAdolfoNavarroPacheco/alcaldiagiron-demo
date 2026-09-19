import { useState } from 'react'
import { Link } from 'react-router-dom'
import { addTramiteSecretaria, nextTramiteRadicado } from '../../../data/storage'

interface ComparendoMock {
  numero: string
  placa: string
  infraccion: string
  descripcion: string
  fecha: string
  valor: number
  descuentoLey: number
  estado: 'Pendiente de Pago' | 'En Notificación' | 'Acuerdo de Pago'
}

const COMPARENDOS_MOCK: ComparendoMock[] = [
  {
    numero: 'COMP-GIR-2026-00452',
    placa: 'GIR-842',
    infraccion: 'C02',
    descripcion: 'Estacionar un vehículo en sitios prohibidos del Centro Histórico.',
    fecha: '2026-08-18',
    valor: 650000,
    descuentoLey: 325000,
    estado: 'Pendiente de Pago',
  },
  {
    numero: 'COMP-GIR-2026-00389',
    placa: 'GIR-842',
    infraccion: 'C29',
    descripcion: 'Conducir a velocidad superior a la máxima permitida en zona escolar.',
    fecha: '2026-07-10',
    valor: 650000,
    descuentoLey: 325000,
    estado: 'Pendiente de Pago',
  },
]

export default function SecretariaTransitoView() {
  const [criterio, setCriterio] = useState<'placa' | 'cedula'>('placa')
  const [valorBusqueda, setValorBusqueda] = useState('GIR-842')
  const [resultado, setResultado] = useState<ComparendoMock[] | null>(COMPARENDOS_MOCK)
  const [pazYSalvoGenerado, setPazYSalvoGenerado] = useState(false)
  const [radicadoPYS, setRadicadoPYS] = useState<string | null>(null)

  function handleGenerarPazYSalvo() {
    const codigo = nextTramiteRadicado('PYS-TRA')
    const hoy = new Date().toISOString().slice(0, 10)
    addTramiteSecretaria('transito-transporte', {
      id: `tra-${Date.now()}`,
      radicado: codigo,
      titulo: `Paz y Salvo de Infracciones: ${valorBusqueda.toUpperCase()}`,
      solicitante: `Propietario / Conductor (${valorBusqueda.toUpperCase()})`,
      documentoSolicitante: criterio === 'cedula' ? valorBusqueda : 'Consulta Placa',
      fecha: hoy,
      estado: 'Aprobado',
      prioridad: 'Baja',
      tipoTramite: 'Certificación Paz y Salvo',
      descripcion: `Certificado digital de no comparendos pendientes expedido para ${valorBusqueda.toUpperCase()}.`,
    })
    setRadicadoPYS(codigo)
    setPazYSalvoGenerado(true)
  }

  function handleBuscar(e: React.FormEvent) {
    e.preventDefault()
    if (valorBusqueda.trim().toUpperCase() === 'GIR-842') {
      setResultado(COMPARENDOS_MOCK)
    } else {
      setResultado([])
    }
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Cabecera institucional de Tránsito */}
      <section className="relative overflow-hidden rounded-3xl border border-ink/8 bg-paper-card p-6 sm:p-10 shadow-card">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-vinotinto/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-dorado/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-vinotinto/15 bg-vinotinto-soft px-3.5 py-1 text-xs font-semibold text-vinotinto">
            <span className="h-1.5 w-1.5 rounded-full bg-vinotinto" />
            Secretaría de Tránsito y Transporte · Propuesta Técnica IA 03
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Secretaría de Tránsito y Transporte
          </h1>

          <p className="mt-3 text-base leading-relaxed text-ink-faint">
            Organización del archivo digital de comparendos, cierre de vacíos en notificaciones, expedición de paz y salvo de multas y acuerdos de pago de movilidad.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ink-faint pt-4 border-t border-ink/5">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>(607) 646 3030 Ext. 301</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              </svg>
              <span>transito@giron-santander.gov.co</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Sede Operativa Km 7, Vía Girón</span>
            </div>
          </div>
        </div>
      </section>

      {/* Buscador de comparendos y notificaciones de archivo */}
      <section className="rounded-2xl border border-ink/8 bg-paper-card p-6 sm:p-8 shadow-card space-y-6">
        <div className="max-w-2xl">
          <span className="eyebrow text-vinotinto">Propuesta Técnica 03</span>
          <h2 className="font-display text-2xl font-bold text-ink">
            Consulta de Comparendos y Archivo de Tránsito
          </h2>
          <p className="text-xs text-ink-faint mt-1">
            Verifique multas registradas en la jurisdicción de San Juan de Girón y acceda a descuentos de ley por realización de cursos pedagógicos.
          </p>
        </div>

        <form onSubmit={handleBuscar} className="space-y-4 max-w-2xl">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCriterio('placa')}
              className={`px-4 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                criterio === 'placa'
                  ? 'bg-vinotinto text-white border-vinotinto'
                  : 'bg-paper text-ink border-ink/10'
              }`}
            >
              Buscar por Placa
            </button>
            <button
              type="button"
              onClick={() => setCriterio('cedula')}
              className={`px-4 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                criterio === 'cedula'
                  ? 'bg-vinotinto text-white border-vinotinto'
                  : 'bg-paper text-ink border-ink/10'
              }`}
            >
              Buscar por Cédula
            </button>
          </div>

          <div className="flex gap-2">
            <input
              required
              value={valorBusqueda}
              onChange={(e) => setValorBusqueda(e.target.value)}
              placeholder={criterio === 'placa' ? 'Ej. GIR-842' : 'Ej. 1098765432'}
              className="field font-mono text-xs uppercase flex-1"
            />
            <button type="submit" className="btn-vinotinto text-xs px-6">
              Consultar Historial
            </button>
          </div>
          <p className="text-[11px] text-ink-faint">
            Prueba rápida: Ingrese placa <strong>GIR-842</strong> para ver comparendos de muestra o cualquier otra para simular paz y salvo.
          </p>
        </form>

        {/* Resultados */}
        {resultado && resultado.length > 0 ? (
          <div className="space-y-4 pt-4 border-t border-ink/8">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-base text-ink">
                Comparendos Activos en Girón ({resultado.length})
              </h3>
              <span className="font-mono text-xs text-vinotinto bg-vinotinto/10 px-2.5 py-0.5 rounded font-bold">
                Placa: {valorBusqueda.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3">
              {resultado.map((c) => (
                <div key={c.numero} className="rounded-xl border border-ink/10 bg-paper p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-vinotinto">{c.numero}</span>
                      <span className="rounded bg-semaforo-amarillo/15 px-2 py-0.5 text-[10px] font-bold text-semaforo-amarillo">
                        Infracción {c.infraccion}
                      </span>
                      <span className="font-mono text-[10px] text-ink-faint">Fecha: {c.fecha}</span>
                    </div>
                    <p className="text-xs text-ink font-medium">{c.descripcion}</p>
                    <p className="text-[11px] text-ink-faint">
                      Valor total: <span className="font-mono line-through">${c.valor.toLocaleString('es-CO')}</span> · Con 50% descuento de ley: <span className="font-mono font-bold text-girverde-deep">${c.descuentoLey.toLocaleString('es-CO')} COP</span>
                    </p>
                  </div>

                  <Link
                    to="/ciudadano/radicar"
                    className="btn-vinotinto text-xs whitespace-nowrap self-start sm:self-auto"
                  >
                    Acogerse a Descuento
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : resultado && resultado.length === 0 ? (
          <div className="rounded-xl border border-girverde/20 bg-girverde/5 p-6 text-center space-y-3 pt-4 border-t border-ink/8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-girverde text-white">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-base text-ink">Sin Infracciones Pendientes</h3>
            <p className="text-xs text-ink-faint max-w-md mx-auto">
              El vehículo o documento consultado se encuentra al día y en Paz y Salvo en la Secretaría de Tránsito de Girón.
            </p>
            <button
              type="button"
              onClick={handleGenerarPazYSalvo}
              className="btn-vinotinto text-xs"
            >
              Generar Certificado de Paz y Salvo con QR
            </button>
          </div>
        ) : null}

        {/* Modal de Paz y Salvo */}
        {pazYSalvoGenerado && (
          <div className="rounded-2xl border-2 border-girverde/30 bg-paper p-6 text-center space-y-4 animate-fade-in max-w-md mx-auto">
            <span className="eyebrow text-girverde-deep font-bold">Certificado Oficial</span>
            <h4 className="font-display font-bold text-lg text-ink">Paz y Salvo de Tránsito</h4>
            <p className="font-mono text-xs text-ink">Vehículo: {valorBusqueda.toUpperCase()} · Municipio de Girón</p>
            <div className="p-3 bg-white rounded-xl border border-ink/10 inline-block">
              <svg className="h-20 w-20 text-ink mx-auto" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <rect x="4" y="4" width="4" height="4" />
                <rect x="14" y="2" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <rect x="16" y="4" width="4" height="4" />
                <rect x="2" y="14" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <rect x="4" y="16" width="4" height="4" />
                <rect x="13" y="13" width="7" height="7" />
              </svg>
            </div>
            <p className="text-[11px] text-ink-faint font-mono">
              Código de Radicado y Validación: {radicadoPYS ?? `PYS-GIR-${Date.now().toString().slice(-6)}`}
            </p>
            <button
              type="button"
              onClick={() => window.print()}
              className="btn-vinotinto text-xs"
            >
              Imprimir Certificado
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
