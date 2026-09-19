import { useState, type FormEvent } from 'react'
import type { PQRS, PrioridadRadicado, TipoCorrespondencia, TipoSolicitudPQRS } from '../../types'
import type { TramiteSecretaria } from '../../types/secretarias'
import { addPQRS, addTramiteSecretaria, nextRadicadoNumber } from '../../data/storage'
import { DEPENDENCIAS, DEPENDENCIA_A_SLUG, PLAZO_DIAS_PQRS } from '../../data/dependencias'
import CustomSelect from '../CustomSelect'

const TIPOS_CORRESPONDENCIA: TipoCorrespondencia[] = [
  'Comunicaciones Oficiales Recibidas',
  'Petición Ciudadana',
  'Memorando Interno',
  'Circular',
]

const TIPOS_PQRS: TipoSolicitudPQRS[] = ['Petición', 'Queja', 'Reclamo', 'Sugerencia', 'Denuncia']

const PRIORIDADES: PrioridadRadicado[] = ['Alta', 'Media', 'Baja']

function sumarDias(iso: string, dias: number): string {
  const date = new Date(iso)
  date.setDate(date.getDate() + dias)
  return date.toISOString().slice(0, 10)
}

interface RadicarCorrespondenciaModalProps {
  onClose: () => void
  onRadicado?: (nuevo: PQRS) => void
}

export default function RadicarCorrespondenciaModal({ onClose, onRadicado }: RadicarCorrespondenciaModalProps) {
  const [tipoCorrespondencia, setTipoCorrespondencia] = useState<TipoCorrespondencia>('Comunicaciones Oficiales Recibidas')
  const [prioridad, setPrioridad] = useState<PrioridadRadicado>('Media')
  const [empresaRemitente, setEmpresaRemitente] = useState('')
  const [numeroGuia, setNumeroGuia] = useState('')
  const [mensajero, setMensajero] = useState('')

  const [remitente, setRemitente] = useState('')
  const [documento, setDocumento] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')

  const [dependencia, setDependencia] = useState(DEPENDENCIAS[0])
  const [funcionarioDestino, setFuncionarioDestino] = useState('')
  const [correspondenciaPrivada, setCorrespondenciaPrivada] = useState(false)
  const [destinoMultiple, setDestinoMultiple] = useState(false)

  const [numeroFolios, setNumeroFolios] = useState(1)
  const [anexos, setAnexos] = useState(0)
  const [digitalizado, setDigitalizado] = useState(true)

  const [tipoTramite, setTipoTramite] = useState<TipoSolicitudPQRS>('Petición')
  const [asunto, setAsunto] = useState('')
  const [observacionesInternas, setObservacionesInternas] = useState('')

  const [exito, setExito] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!remitente.trim() || !documento.trim() || !asunto.trim()) return

    const hoy = new Date().toISOString().slice(0, 10)
    const nueva: PQRS = {
      id: `p-${Date.now()}`,
      radicado: nextRadicadoNumber(),
      tipo: tipoTramite,
      asunto: asunto.trim(),
      solicitante: remitente.trim(),
      documentoSolicitante: documento.trim(),
      tipoUsuario: 'Registrado',
      correo: correo.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
      fechaRadicacion: hoy,
      fechaLimite: sumarDias(hoy, PLAZO_DIAS_PQRS[tipoTramite] ?? 15),
      fechaRespuesta: null,
      estado: 'En proceso',
      archivoAdjunto: null,
      dependencia,
      origen: 'Radicación Presencial',
      tipoCorrespondencia,
      prioridad,
      empresaRemitente: empresaRemitente.trim() || undefined,
      numeroGuia: numeroGuia.trim() || undefined,
      mensajero: mensajero.trim() || undefined,
      funcionarioDestino: funcionarioDestino.trim() || undefined,
      numeroFolios,
      anexos,
      digitalizado,
      correspondenciaPrivada,
      destinoMultiple,
      observacionesInternas: observacionesInternas.trim() || undefined,
    }

    addPQRS(nueva)

    const slug = DEPENDENCIA_A_SLUG[dependencia]
    if (slug) {
      const tramite: TramiteSecretaria = {
        id: `trm-${nueva.id}`,
        radicado: nueva.radicado,
        titulo: `[Correspondencia - ${nueva.tipo}] ${nueva.asunto.slice(0, 45)}`,
        solicitante: nueva.solicitante,
        documentoSolicitante: nueva.documentoSolicitante,
        fecha: nueva.fechaRadicacion,
        estado: 'En Trámite',
        prioridad: prioridad === 'Alta' ? 'Alta' : prioridad === 'Baja' ? 'Baja' : 'Media',
        tipoTramite: `Correspondencia / ${nueva.tipo}`,
        descripcion: nueva.asunto,
      }
      addTramiteSecretaria(slug, tramite)
    }

    onRadicado?.(nueva)
    setExito(`Correspondencia radicada con el número ${nueva.radicado}.`)
    setTimeout(() => {
      onClose()
    }, 1400)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Cerrar radicación de correspondencia"
        onClick={onClose}
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px] transition-opacity"
      />
      <div className="relative flex h-full w-full max-w-xl animate-slide-in-right flex-col overflow-y-auto bg-white shadow-xl border-l border-slate-200">
        {/* Cabecera */}
        <div className="border-b border-slate-800 bg-[#141212] p-5 text-white sticky top-0 z-10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Gestión Documental · Ventanilla Única
              </span>
              <h2 className="mt-1 text-lg font-semibold text-white">Radicar Correspondencia</h2>
              <p className="text-xs text-slate-400">Registro manual de correspondencia física recibida</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-md border border-white/20 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {exito && (
          <div className="mx-5 mt-3 rounded-md border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs font-medium text-emerald-900">
            ✓ {exito}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          {/* Datos de la correspondencia */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Datos de la Correspondencia
            </h3>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Tipo de Correspondencia</label>
                <CustomSelect value={tipoCorrespondencia} onChange={(v) => setTipoCorrespondencia(v as TipoCorrespondencia)} options={TIPOS_CORRESPONDENCIA} />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Prioridad</label>
                <CustomSelect value={prioridad} onChange={(v) => setPrioridad(v as PrioridadRadicado)} options={PRIORIDADES} />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Empresa / Remitente (si aplica)</label>
                <input
                  value={empresaRemitente}
                  onChange={(e) => setEmpresaRemitente(e.target.value)}
                  placeholder="Ej. Berlitz Colombia S.A."
                  className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">No. de Guía</label>
                <input
                  value={numeroGuia}
                  onChange={(e) => setNumeroGuia(e.target.value)}
                  placeholder="GUI-2026-XXXX"
                  className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Mensajero / Medio de Recepción</label>
                <input
                  value={mensajero}
                  onChange={(e) => setMensajero(e.target.value)}
                  placeholder="Ej. Servicio Postal Nacional, entrega en ventanilla..."
                  className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Datos del remitente */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Datos del Remitente
            </h3>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Nombre o razón social *</label>
                <input
                  required
                  value={remitente}
                  onChange={(e) => setRemitente(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Documento / NIT *</label>
                <input
                  required
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-900 focus:border-slate-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Teléfono *</label>
                <input
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-900 focus:border-slate-400 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Correo electrónico *</label>
                <input
                  required
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Dirección *</label>
                <input
                  required
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Destino y trazabilidad */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Destino y Trazabilidad
            </h3>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Oficina / Dependencia Destino *</label>
                <CustomSelect value={dependencia} onChange={setDependencia} options={DEPENDENCIAS} />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Funcionario Destino (opcional)</label>
                <input
                  value={funcionarioDestino}
                  onChange={(e) => setFuncionarioDestino(e.target.value)}
                  placeholder="Ej. Pacheco Pacheco Eduardo - Ventanilla Única"
                  className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Número de Folios</label>
                <input
                  type="number"
                  min={0}
                  value={numeroFolios}
                  onChange={(e) => setNumeroFolios(Number(e.target.value))}
                  className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-900 focus:border-slate-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Anexos</label>
                <input
                  type="number"
                  min={0}
                  value={anexos}
                  onChange={(e) => setAnexos(Number(e.target.value))}
                  className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-900 focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div className="col-span-2 flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                  <input type="checkbox" checked={digitalizado} onChange={(e) => setDigitalizado(e.target.checked)} className="h-3.5 w-3.5 rounded border-slate-300 text-vinotinto focus:ring-vinotinto" />
                  Digitalizado
                </label>
                <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                  <input type="checkbox" checked={correspondenciaPrivada} onChange={(e) => setCorrespondenciaPrivada(e.target.checked)} className="h-3.5 w-3.5 rounded border-slate-300 text-vinotinto focus:ring-vinotinto" />
                  Correspondencia privada
                </label>
                <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                  <input type="checkbox" checked={destinoMultiple} onChange={(e) => setDestinoMultiple(e.target.checked)} className="h-3.5 w-3.5 rounded border-slate-300 text-vinotinto focus:ring-vinotinto" />
                  Destino múltiple oficinas
                </label>
              </div>
            </div>
          </section>

          {/* Asunto y trámite */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Asunto y Trámite
            </h3>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Tipo de Trámite</label>
                <CustomSelect value={tipoTramite} onChange={(v) => setTipoTramite(v as TipoSolicitudPQRS)} options={TIPOS_PQRS} />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Término legal</label>
                <div className="flex h-[38px] items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 text-xs font-mono text-slate-600">
                  {PLAZO_DIAS_PQRS[tipoTramite]} días hábiles
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Descripción del Radicado *</label>
                <textarea
                  required
                  rows={3}
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-none resize-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Observaciones internas (no visibles al ciudadano)</label>
                <textarea
                  rows={2}
                  value={observacionesInternas}
                  onChange={(e) => setObservacionesInternas(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-none resize-none"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-vinotinto px-4 py-1.5 text-xs font-semibold text-white hover:bg-vinotinto-deep transition-colors"
            >
              Radicar Correspondencia
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
