import { useState } from 'react'
import CustomSelect from '../../../components/CustomSelect'

const ESTAMPILLAS_OPCIONES = [
  { value: 'pro-cultura', label: 'Estampilla Pro-Cultura (1.5%)', tarifa: 0.015 },
  { value: 'pro-adulto', label: 'Estampilla Pro-Adulto Mayor (2.0%)', tarifa: 0.02 },
  { value: 'pro-uis', label: 'Estampilla Pro-Desarrollo y Educación (1.0%)', tarifa: 0.01 },
]

export default function SecretariaHaciendaView() {
  const [activeTab, setActiveTab] = useState<'estampillas' | 'coactivo' | 'calendario'>('estampillas')

  // Estado para liquidador de estampillas
  const [tipoEstampilla, setTipoEstampilla] = useState('pro-cultura')
  const [valorContrato, setValorContrato] = useState('15000000')
  const [nombreContratista, setNombreContratista] = useState('')
  const [nitContratista, setNitContratista] = useState('')
  const [numeroContrato, setNumeroContrato] = useState('')
  const [estampillaGenerada, setEstampillaGenerada] = useState<{
    codigo: string
    valor: number
    nombreEstampilla: string
    fecha: string
  } | null>(null)

  // Estado para simulación de cobro coactivo
  const [referenciaPredial, setReferenciaPredial] = useState('01-02-0045-0012-000')
  const [deudaSimulada, setDeudaSimulada] = useState<number | null>(null)
  const [numeroCuotas, setNumeroCuotas] = useState('6')
  const [acuerdoSimulado, setAcuerdoSimulado] = useState<{
    total: number
    cuotaMensual: number
    ahorroIntereses: number
  } | null>(null)

  function handleLiquidarEstampilla(e: React.FormEvent) {
    e.preventDefault()
    const selec = ESTAMPILLAS_OPCIONES.find((opt) => opt.value === tipoEstampilla)
    const base = parseFloat(valorContrato) || 0
    const tarifa = selec ? selec.tarifa : 0.015
    const valorLiquidado = Math.round(base * tarifa)

    setEstampillaGenerada({
      codigo: `EST-GIR-${Date.now().toString().slice(-6)}`,
      valor: valorLiquidado,
      nombreEstampilla: selec?.label || 'Estampilla Oficial',
      fecha: new Date().toISOString().slice(0, 10),
    })
  }

  function handleConsultarDeuda(e: React.FormEvent) {
    e.preventDefault()
    setDeudaSimulada(2450000)
    calcularAcuerdo(2450000, parseInt(numeroCuotas))
  }

  function calcularAcuerdo(deuda: number, cuotas: number) {
    const descuentoIntereses = Math.round(deuda * 0.18)
    const totalConDescuento = deuda - descuentoIntereses
    const valorCuota = Math.round(totalConDescuento / cuotas)
    setAcuerdoSimulado({
      total: totalConDescuento,
      cuotaMensual: valorCuota,
      ahorroIntereses: descuentoIntereses,
    })
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Cabecera institucional de Hacienda */}
      <section className="relative overflow-hidden rounded-3xl border border-ink/8 bg-paper-card p-6 sm:p-10 shadow-card">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-vinotinto/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-dorado/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-vinotinto/15 bg-vinotinto-soft px-3.5 py-1 text-xs font-semibold text-vinotinto">
            <span className="h-1.5 w-1.5 rounded-full bg-vinotinto" />
            Secretaría de Hacienda · Propuestas Técnicas IA 04 y 06
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Secretaría de Hacienda
          </h1>

          <p className="mt-3 text-base leading-relaxed text-ink-faint">
            Administración tributaria y financiera municipal, liquidación y emisión de estampillas digitales con código QR, y gestión de acuerdos de pago en cobro coactivo.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ink-faint pt-4 border-t border-ink/5">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>(607) 646 3030 Ext. 115</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              </svg>
              <span>hacienda@giron-santander.gov.co</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-vinotinto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Palacio Municipal, Primer Piso (Rentas)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pestañas de módulos funcionales */}
      <div className="flex flex-wrap gap-2 border-b border-ink/10 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('estampillas')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
            activeTab === 'estampillas'
              ? 'bg-vinotinto text-white shadow-glow-vinotinto'
              : 'bg-paper-card border border-ink/10 text-ink hover:border-vinotinto/30'
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M7 7h.01" />
            <path d="M17 7h.01" />
            <path d="M7 17h.01" />
            <path d="M17 17h.01" />
          </svg>
          <span>Estampillas Digitales con QR (Propuesta 06)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('coactivo')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
            activeTab === 'coactivo'
              ? 'bg-vinotinto text-white shadow-glow-vinotinto'
              : 'bg-paper-card border border-ink/10 text-ink hover:border-vinotinto/30'
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span>Cobro Coactivo & Acuerdos de Pago (Propuesta 04)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('calendario')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
            activeTab === 'calendario'
              ? 'bg-vinotinto text-white shadow-glow-vinotinto'
              : 'bg-paper-card border border-ink/10 text-ink hover:border-vinotinto/30'
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Calendario Tributario 2026</span>
        </button>
      </div>

      {/* PESTAÑA 1: Estampillas Digitales con QR */}
      {activeTab === 'estampillas' && (
        <div className="grid gap-8 lg:grid-cols-12 animate-fade-in">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="eyebrow text-vinotinto">Propuesta Técnica 06</span>
              <h2 className="font-display text-2xl font-bold text-ink">
                Liquidación y Generación de Estampilla Digital
              </h2>
              <p className="text-xs text-ink-faint mt-1">
                Genere y descargue de forma inmediata el comprobante oficial con código QR para cuentas de cobro, contratos y escrituras notariales.
              </p>
            </div>

            <form onSubmit={handleLiquidarEstampilla} className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">
                  Concepto de Estampilla Municipal *
                </label>
                <CustomSelect
                  value={tipoEstampilla}
                  onChange={setTipoEstampilla}
                  options={ESTAMPILLAS_OPCIONES}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-ink mb-1.5">
                    Valor Base del Contrato / Cuenta ($ COP) *
                  </label>
                  <input
                    type="number"
                    required
                    value={valorContrato}
                    onChange={(e) => setValorContrato(e.target.value)}
                    className="field font-mono text-xs"
                    placeholder="Ej. 15000000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1.5">
                    No. de Contrato o Cuenta de Cobro *
                  </label>
                  <input
                    required
                    value={numeroContrato}
                    onChange={(e) => setNumeroContrato(e.target.value)}
                    className="field font-mono text-xs"
                    placeholder="Ej. CTR-2026-088"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-ink mb-1.5">
                    Nombre o Razón Social del Contratista *
                  </label>
                  <input
                    required
                    value={nombreContratista}
                    onChange={(e) => setNombreContratista(e.target.value)}
                    className="field text-xs"
                    placeholder="Ej. Construcciones Girón S.A.S."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1.5">
                    NIT o Cédula de Ciudadanía *
                  </label>
                  <input
                    required
                    value={nitContratista}
                    onChange={(e) => setNitContratista(e.target.value)}
                    className="field font-mono text-xs"
                    placeholder="Ej. 901.456.789-0"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-ink/5 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-ink-faint block text-[10px]">Valor Liquidado Estimado</span>
                  <span className="font-mono text-base font-bold text-vinotinto">
                    ${(
                      (parseFloat(valorContrato) || 0) *
                      (ESTAMPILLAS_OPCIONES.find((o) => o.value === tipoEstampilla)?.tarifa || 0.015)
                    ).toLocaleString('es-CO')}{' '}
                    COP
                  </span>
                </div>

                <button type="submit" className="btn-vinotinto text-xs px-6">
                  Liquidar Estampilla Oficial
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {estampillaGenerada ? (
              <div className="rounded-2xl border-2 border-vinotinto/30 bg-paper-card p-6 shadow-card space-y-4 animate-fade-in text-center">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-girverde/10 px-3 py-1 font-mono text-[11px] font-bold text-girverde-deep">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Estampilla Validada Digitalmente
                </div>

                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-2xl border border-ink/15 bg-white p-2 shadow-sm">
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
                  <span className="font-mono text-sm font-bold text-vinotinto block">
                    {estampillaGenerada.codigo}
                  </span>
                  <p className="text-[11px] text-ink-faint">Código Único de Verificación Notarial</p>
                </div>

                <dl className="text-left text-xs space-y-1.5 bg-paper p-3.5 rounded-xl border border-ink/5">
                  <div className="flex justify-between">
                    <span className="text-ink-faint">Concepto:</span>
                    <span className="font-medium text-ink truncate max-w-[170px]">{estampillaGenerada.nombreEstampilla}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-faint">Valor Retenido:</span>
                    <span className="font-mono font-bold text-vinotinto">${estampillaGenerada.valor.toLocaleString('es-CO')} COP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-faint">Fecha de Expedición:</span>
                    <span className="font-mono text-ink">{estampillaGenerada.fecha}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-faint">Contrato:</span>
                    <span className="font-mono text-ink">{numeroContrato || 'N/A'}</span>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-vinotinto text-xs w-full"
                >
                  Descargar / Imprimir Recibo Oficial
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-3 text-xs">
                <h4 className="font-display font-semibold text-sm text-ink">Destinación de Estampillas</h4>
                <p className="text-ink-faint leading-relaxed">
                  Conforme a los Acuerdos Municipales de San Juan de Girón:
                </p>
                <ul className="space-y-2 text-ink-soft">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-vinotinto">·</span>
                    <span><strong>Pro-Cultura (1.5%):</strong> Destinada a la conservación del patrimonio histórico y formación artística.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-vinotinto">·</span>
                    <span><strong>Pro-Adulto Mayor (2.0%):</strong> Financiación de centros vida y subsidios alimentarios para personas de la tercera edad.</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PESTAÑA 2: Cobro Coactivo & Acuerdos de Pago */}
      {activeTab === 'coactivo' && (
        <div className="grid gap-8 lg:grid-cols-12 animate-fade-in">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="eyebrow text-vinotinto">Propuesta Técnica 04</span>
              <h2 className="font-display text-2xl font-bold text-ink">
                Consulta de Cartera y Simulador de Acuerdos de Pago
              </h2>
              <p className="text-xs text-ink-faint mt-1">
                Consulte si su predio o actividad comercial tiene obligaciones pendientes en cobro coactivo y simule una facilidad de pago sin intereses de mora.
              </p>
            </div>

            <form onSubmit={handleConsultarDeuda} className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">
                  Número de Referencia Catastral o NIT *
                </label>
                <div className="flex gap-2">
                  <input
                    required
                    value={referenciaPredial}
                    onChange={(e) => setReferenciaPredial(e.target.value)}
                    className="field font-mono text-xs flex-1"
                    placeholder="Ej. 01-02-0045-0012-000"
                  />
                  <button type="submit" className="btn-vinotinto text-xs px-5">
                    Consultar Deuda
                  </button>
                </div>
              </div>
            </form>

            {deudaSimulada && acuerdoSimulado && (
              <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-5 animate-fade-in">
                <div className="flex items-center justify-between border-b border-ink/5 pb-3">
                  <div>
                    <h3 className="font-display font-semibold text-base text-ink">Estado de Cuenta Identificado</h3>
                    <p className="text-xs text-ink-faint font-mono">Ref: {referenciaPredial}</p>
                  </div>
                  <span className="rounded-full bg-semaforo-amarillo/15 border border-semaforo-amarillo/30 px-3 py-1 font-mono text-xs font-bold text-semaforo-amarillo">
                    Etapa: Cobro Persuasivo
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl bg-paper p-3 border border-ink/5">
                    <span className="text-[10px] text-ink-faint block">Deuda Original</span>
                    <span className="font-mono text-sm font-bold text-ink">${deudaSimulada.toLocaleString('es-CO')} COP</span>
                  </div>
                  <div className="rounded-xl bg-girverde/10 p-3 border border-girverde/20">
                    <span className="text-[10px] text-girverde-deep block font-medium">Ahorro en Intereses</span>
                    <span className="font-mono text-sm font-bold text-girverde-deep">-${acuerdoSimulado.ahorroIntereses.toLocaleString('es-CO')} COP</span>
                  </div>
                  <div className="rounded-xl bg-vinotinto-soft p-3 border border-vinotinto/15">
                    <span className="text-[10px] text-vinotinto block font-medium">Total con Beneficio</span>
                    <span className="font-mono text-sm font-bold text-vinotinto">${acuerdoSimulado.total.toLocaleString('es-CO')} COP</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-ink/5">
                  <label className="block text-xs font-medium text-ink mb-1.5">
                    Plazo Deseado para el Acuerdo de Pago
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['3', '6', '12', '24'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setNumeroCuotas(c)
                          calcularAcuerdo(deudaSimulada, parseInt(c))
                        }}
                        className={`py-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                          numeroCuotas === c
                            ? 'bg-vinotinto text-white border-vinotinto shadow-sm'
                            : 'bg-paper text-ink border-ink/10 hover:border-vinotinto/30'
                        }`}
                      >
                        {c} Cuotas
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 p-4 rounded-xl bg-paper border border-ink/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-ink-faint text-[11px] block">Cuota mensual estimada:</span>
                      <span className="font-mono text-lg font-bold text-ink">
                        ${acuerdoSimulado.cuotaMensual.toLocaleString('es-CO')} COP / mes
                      </span>
                    </div>
                    <Link
                      to="/ciudadano/radicar"
                      className="btn-vinotinto text-xs"
                    >
                      Formalizar Acuerdo
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-ink/8 bg-paper-card p-5 shadow-card text-xs space-y-3">
              <h4 className="font-display font-semibold text-sm text-ink">Garantías de Cobro Coactivo</h4>
              <p className="text-ink-faint leading-relaxed">
                Al suscribir un acuerdo formal de pago con la Secretaría de Hacienda:
              </p>
              <ul className="space-y-2 text-ink-soft">
                <li className="flex items-start gap-1.5">
                  <svg className="h-3.5 w-3.5 text-girverde-deep shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Levantamiento inmediato de embargos sobre cuentas bancarias.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <svg className="h-3.5 w-3.5 text-girverde-deep shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Suspensión del proceso de cobro judicial y remate.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <svg className="h-3.5 w-3.5 text-girverde-deep shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Expedición de paz y salvo condicionado para trámites notariales.</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      )}

      {/* PESTAÑA 3: Calendario Tributario 2026 */}
      {activeTab === 'calendario' && (
        <div className="grid gap-4 sm:grid-cols-3 animate-fade-in">
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-5 shadow-card space-y-3">
            <span className="font-mono text-xs font-bold text-girverde-deep bg-girverde/10 px-2.5 py-0.5 rounded">
              15% Descuento
            </span>
            <h3 className="font-display font-semibold text-base text-ink">Impuesto Predial Unificado</h3>
            <p className="text-xs text-ink-faint">Pago total de la vigencia 2026 antes del 31 de Marzo.</p>
            <div className="pt-2 border-t border-ink/5 text-xs text-ink-soft">
              Puntos de pago: Banco de Bogotá, Banco Agrario y PSE en línea.
            </div>
          </div>

          <div className="rounded-2xl border border-ink/8 bg-paper-card p-5 shadow-card space-y-3">
            <span className="font-mono text-xs font-bold text-vinotinto bg-vinotinto/10 px-2.5 py-0.5 rounded">
              10% Descuento
            </span>
            <h3 className="font-display font-semibold text-base text-ink">Segunda Oportunidad Predial</h3>
            <p className="text-xs text-ink-faint">Pago con descuento hasta el último día hábil de Abril 2026.</p>
            <div className="pt-2 border-t border-ink/5 text-xs text-ink-soft">
              Sin intereses de mora aplicados.
            </div>
          </div>

          <div className="rounded-2xl border border-ink/8 bg-paper-card p-5 shadow-card space-y-3">
            <span className="font-mono text-xs font-bold text-ocre-deep bg-dorado/15 px-2.5 py-0.5 rounded">
              Bimestral
            </span>
            <h3 className="font-display font-semibold text-base text-ink">Industria y Comercio (ICA)</h3>
            <p className="text-xs text-ink-faint">Declaración bimestral de reteICA para comerciantes y profesionales.</p>
            <div className="pt-2 border-t border-ink/5 text-xs text-ink-soft">
              Vencimiento según último dígito de NIT.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
