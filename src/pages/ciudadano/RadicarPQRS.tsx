import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { PQRS, TipoSolicitudPQRS } from '../../types'
import { addPQRS, nextRadicadoNumber } from '../../data/storage'
import SelloRadicado from '../../components/SelloRadicado'

const TIPOS: TipoSolicitudPQRS[] = ['Petición', 'Queja', 'Reclamo', 'Sugerencia', 'Denuncia']

const DEPENDENCIAS = [
  'Secretaría de Hacienda',
  'Cobro Coactivo',
  'Atención al Ciudadano',
  'Secretaría de Planeación',
  'Secretaría TIC',
]

const PLAZO_DIAS: Record<TipoSolicitudPQRS, number> = {
  Petición: 15,
  Queja: 15,
  Reclamo: 15,
  Sugerencia: 15,
  Denuncia: 30,
}

function sumarDias(iso: string, dias: number): string {
  const date = new Date(iso)
  date.setDate(date.getDate() + dias)
  return date.toISOString().slice(0, 10)
}

export default function RadicarPQRS() {
  const [tipo, setTipo] = useState<TipoSolicitudPQRS>('Petición')
  const [dependencia, setDependencia] = useState(DEPENDENCIAS[0])
  const [asunto, setAsunto] = useState('')
  const [solicitante, setSolicitante] = useState('')
  const [documento, setDocumento] = useState('')
  const [archivo, setArchivo] = useState<string | null>(null)
  const [autoriza, setAutoriza] = useState(false)
  const [resultado, setResultado] = useState<PQRS | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!autoriza) return

    const hoy = new Date().toISOString().slice(0, 10)
    const nueva: PQRS = {
      id: `p-${Date.now()}`,
      radicado: nextRadicadoNumber(),
      tipo,
      asunto: asunto.trim(),
      solicitante: solicitante.trim(),
      documentoSolicitante: documento.trim(),
      fechaRadicacion: hoy,
      fechaLimite: sumarDias(hoy, PLAZO_DIAS[tipo]),
      fechaRespuesta: null,
      estado: 'En proceso',
      archivoAdjunto: archivo,
      dependencia,
    }
    addPQRS(nueva)
    setResultado(nueva)
  }

  if (resultado) {
    return (
      <div className="mx-auto max-w-md animate-fade-up text-center">
        <p className="eyebrow text-girverde-deep">Radicación exitosa</p>
        <h1 className="mt-3 font-display text-2xl font-medium text-ink">
          Su solicitud quedó registrada
        </h1>
        <p className="mt-2 text-sm text-ink-faint">
          Conserve este número: lo necesitará para consultar el estado de su
          trámite.
        </p>

        <SelloRadicado radicado={resultado.radicado} fecha={resultado.fechaRadicacion} />

        <dl className="mt-6 grid grid-cols-2 gap-y-2 rounded-xl border border-ink/8 bg-paper-card px-5 py-5 text-left text-sm shadow-card">
          <dt className="text-ink-faint">Dependencia</dt>
          <dd className="text-ink">{resultado.dependencia}</dd>
          <dt className="text-ink-faint">Tipo de solicitud</dt>
          <dd className="text-ink">{resultado.tipo}</dd>
          <dt className="text-ink-faint">Término de respuesta</dt>
          <dd className="text-ink">{PLAZO_DIAS[resultado.tipo]} días hábiles</dd>
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/ciudadano/consultar" className="btn-primary">
            Consultar este radicado
          </Link>
          <Link to="/ciudadano" className="btn-ghost">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl animate-fade-up">
      <p className="eyebrow text-ocre-deep">Radicación de ventanilla única</p>
      <h1 className="mt-3 font-display text-3xl font-medium text-ink">
        Radicar una PQRS
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-faint">
        Diligencie los datos de su solicitud. Los campos marcados son
        obligatorios.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-ink">Tipo de solicitud</span>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoSolicitudPQRS)}
              className="field mt-1.5"
            >
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-ink">Dependencia destino</span>
            <select
              value={dependencia}
              onChange={(e) => setDependencia(e.target.value)}
              className="field mt-1.5"
            >
              {DEPENDENCIAS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-ink">Asunto</span>
          <textarea
            required
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            rows={3}
            placeholder="Describa brevemente el motivo de su solicitud"
            className="field mt-1.5 resize-none"
          />
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-ink">Nombre completo</span>
            <input
              required
              value={solicitante}
              onChange={(e) => setSolicitante(e.target.value)}
              className="field mt-1.5"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Documento de identidad</span>
            <input
              required
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              className="field mt-1.5"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-ink">Adjuntar documento (simulado)</span>
          <input
            type="file"
            onChange={(e) => setArchivo(e.target.files?.[0]?.name ?? null)}
            className="mt-1.5 block w-full text-sm text-ink-faint file:mr-3 file:cursor-pointer file:rounded-full file:border file:border-ink/20 file:bg-paper file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-wide file:text-ink file:transition-colors hover:file:border-ocre"
          />
          {archivo && <span className="mt-1.5 block text-xs text-girverde-deep">Adjunto: {archivo}</span>}
        </label>

        <label className="flex items-start gap-2.5 text-sm text-ink-faint">
          <input
            type="checkbox"
            required
            checked={autoriza}
            onChange={(e) => setAutoriza(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-ink/30 text-ocre focus:ring-ocre/40"
          />
          Autorizo el uso de mis datos para los fines exclusivos de esta PQRS por
          parte de la Alcaldía de Girón.
        </label>

        <button type="submit" className="btn-primary w-full sm:w-auto">
          Radicar solicitud
        </button>
      </form>
    </div>
  )
}
