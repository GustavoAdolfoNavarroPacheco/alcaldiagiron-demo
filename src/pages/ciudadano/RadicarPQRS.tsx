import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { PQRS, TipoSolicitudPQRS } from '../../types'
import { addPQRS, nextRadicadoNumber } from '../../data/storage'
import SelloRadicado from '../../components/SelloRadicado'
import CustomSelect from '../../components/CustomSelect'

const TIPOS: TipoSolicitudPQRS[] = ['Petición', 'Queja', 'Reclamo', 'Sugerencia', 'Denuncia']

const TIPO_DESCRIPCIONES: Record<TipoSolicitudPQRS, string> = {
  Petición: 'Solicitud formal para requerir información, copias o la actuación municipal.',
  Queja: 'Manifestación de inconformidad por la conducta irregular de un servidor público.',
  Reclamo: 'Insatisfacción por la deficiente prestación o interrupción de un servicio.',
  Sugerencia: 'Propuesta de mejora para la gestión o trámites de la administración.',
  Denuncia: 'Puesta en conocimiento de un hecho presuntamente irregular o acto indebido.',
}

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

  // Vista de confirmación con certificado de radicación oficial
  if (resultado) {
    return (
      <div className="space-y-8 animate-fade-up">
        {/* Banner de éxito */}
        <div className="rounded-2xl border border-girverde/20 bg-girverde/5 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-girverde text-white shadow-glow-verde">
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <span className="eyebrow text-girverde-deep font-semibold">Radicación Exitosa</span>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                  Solicitud Registrada Oficialmente
                </h1>
                <p className="text-xs text-ink-faint mt-1">
                  Su trámite ha entrado formalmente en el sistema de gestión documental del municipio.
                </p>
              </div>
            </div>

            <span className="rounded-full border border-girverde/30 bg-girverde/10 px-4 py-1.5 font-mono text-xs font-semibold text-girverde-deep">
              Estado: En proceso
            </span>
          </div>
        </div>

        {/* Detalle del comprobante en dos columnas balanceadas */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Tarjeta del certificado oficial */}
          <div className="lg:col-span-7 rounded-2xl border border-ink/8 bg-paper-card p-6 sm:p-8 shadow-card">
            <div className="border-b border-ink/8 pb-5 flex items-center justify-between">
              <div>
                <p className="font-display font-semibold text-lg text-ink">Comprobante de Radicación</p>
                <p className="text-xs text-ink-faint">Ventanilla Única · Alcaldía de Girón</p>
              </div>
              <span className="font-mono text-xs font-semibold text-vinotinto bg-vinotinto/10 px-3 py-1 rounded-md">
                Ley 1755 de 2015
              </span>
            </div>

            <div className="my-6 flex justify-center">
              <SelloRadicado radicado={resultado.radicado} fecha={resultado.fechaRadicacion} />
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-paper p-5 border border-ink/5 text-sm">
              <div>
                <dt className="text-xs text-ink-faint">Número de Radicado</dt>
                <dd className="font-mono text-base font-bold text-ink">{resultado.radicado}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-faint">Dependencia Asignada</dt>
                <dd className="font-medium text-ink">{resultado.dependencia}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-faint">Tipo de Solicitud</dt>
                <dd className="font-medium text-ink">{resultado.tipo}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-faint">Término Legal de Respuesta</dt>
                <dd className="font-semibold text-vinotinto">{PLAZO_DIAS[resultado.tipo]} días hábiles</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-faint">Fecha de Radicación</dt>
                <dd className="font-medium text-ink">{resultado.fechaRadicacion}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-faint">Fecha Límite Estimada</dt>
                <dd className="font-medium text-ink">{resultado.fechaLimite}</dd>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-ink/5">
                <dt className="text-xs text-ink-faint">Peticionario</dt>
                <dd className="font-medium text-ink">{resultado.solicitante} (Doc: {resultado.documentoSolicitante})</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-ink-faint">Asunto</dt>
                <dd className="font-medium text-ink text-xs leading-relaxed">{resultado.asunto}</dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/ciudadano/consultar" className="btn-vinotinto text-xs flex-1 text-center">
                Consultar este radicado
              </Link>
              <button
                type="button"
                onClick={() => setResultado(null)}
                className="btn-ghost text-xs flex-1 text-center"
              >
                Radicar otra solicitud
              </button>
            </div>
          </div>

          {/* Panel de instrucciones y próximos pasos */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card">
              <h3 className="font-display font-semibold text-base text-ink">¿Qué sucede a continuación?</h3>
              <p className="mt-1 text-xs text-ink-faint">Pasos del proceso de atención de su trámite:</p>

              <ol className="mt-4 space-y-4 text-xs">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-vinotinto text-white font-mono text-[11px] font-bold">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-ink">Asignación y reparto</p>
                    <p className="text-ink-faint mt-0.5">La solicitud es remitida inmediatamente al despacho de {resultado.dependencia}.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-vinotinto text-white font-mono text-[11px] font-bold">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-ink">Estudio de fondo</p>
                    <p className="text-ink-faint mt-0.5">El equipo jurídico o técnico evalúa los hechos y antecedentes dentro de los {PLAZO_DIAS[resultado.tipo]} días hábiles.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-vinotinto text-white font-mono text-[11px] font-bold">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-ink">Notificación de respuesta</p>
                    <p className="text-ink-faint mt-0.5">Podrá consultar la resolución oficial en el módulo de Consultar Estado ingresando su radicado.</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card text-xs space-y-2">
              <p className="font-semibold text-ink">Garantía Constitucional</p>
              <p className="text-ink-faint leading-relaxed">
                De conformidad con el artículo 23 de la Constitución Política y la Ley 1755 de 2015,
                toda persona tiene derecho a presentar peticiones respetuosas a las autoridades y a obtener pronta resolución.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Vista del formulario con distribución balanceada en 2 columnas
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Encabezado descriptivo */}
      <div className="border-b border-ink/8 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="eyebrow text-vinotinto">Ventanilla Única Oficial</span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
              Radicar una PQRS
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-paper-card px-3.5 py-1 text-xs text-ink-faint">
            <span className="h-2 w-2 rounded-full bg-vinotinto" />
            <span>Sistema oficial de atención al ciudadano</span>
          </div>
        </div>
        <p className="mt-2 text-sm text-ink-faint max-w-2xl">
          Diligencie el siguiente formulario para ingresar formalmente su petición, queja, reclamo, sugerencia o denuncia.
          Campos identificados con asterisco (*) son de diligenciamiento obligatorio.
        </p>
      </div>

      {/* Grid de 2 columnas: Formulario (8 columnas) + Panel de Guía (4 columnas) */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Columna Principal: Formulario estructurado */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">
          {/* Bloque 1: Tipo de solicitud */}
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 sm:p-7 shadow-card space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-ink/5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-vinotinto text-white font-mono text-xs font-bold">
                1
              </span>
              <div>
                <h2 className="font-display text-base font-semibold text-ink">Clasificación del Trámite</h2>
                <p className="text-xs text-ink-faint">Seleccione el tipo de trámite y la secretaría competente</p>
              </div>
            </div>

            {/* Selector interactivo de tipos de PQRS con tiempo legal */}
            <div>
              <span className="block text-xs font-medium text-ink mb-2">Tipo de trámite *</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {TIPOS.map((t) => {
                  const isSelected = tipo === t
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTipo(t)}
                      className={`flex flex-col text-left p-3 rounded-xl border transition-all duration-200 ${
                        isSelected
                          ? 'border-vinotinto bg-vinotinto-soft/80 shadow-sm'
                          : 'border-ink/10 bg-paper hover:border-vinotinto/30'
                      }`}
                    >
                      <span className={`text-xs font-semibold ${isSelected ? 'text-vinotinto' : 'text-ink'}`}>
                        {t}
                      </span>
                      <span className="font-mono text-[10px] text-ink-faint mt-1">
                        {PLAZO_DIAS[t]} días hábiles
                      </span>
                    </button>
                  )
                })}
              </div>
              <p className="mt-2 text-xs text-ink-faint italic">
                {TIPO_DESCRIPCIONES[tipo]}
              </p>
            </div>

            {/* Dependencia destino */}
            <div>
              <label htmlFor="select-dependencia" className="block text-xs font-medium text-ink mb-1.5">
                Dependencia o Secretaría Destino *
              </label>
              <CustomSelect
                id="select-dependencia"
                value={dependencia}
                onChange={setDependencia}
                options={DEPENDENCIAS}
              />
            </div>
          </div>

          {/* Bloque 2: Datos del Peticionario */}
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 sm:p-7 shadow-card space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-ink/5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-vinotinto text-white font-mono text-xs font-bold">
                2
              </span>
              <div>
                <h2 className="font-display text-base font-semibold text-ink">Datos del Ciudadano Solicitante</h2>
                <p className="text-xs text-ink-faint">Información para contacto y notificación de la respuesta</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="input-solicitante" className="block text-xs font-medium text-ink mb-1.5">
                  Nombre completo del solicitante *
                </label>
                <input
                  id="input-solicitante"
                  required
                  value={solicitante}
                  onChange={(e) => setSolicitante(e.target.value)}
                  placeholder="Ej. Juan Carlos Pérez Gómez"
                  className="field"
                />
              </div>

              <div>
                <label htmlFor="input-documento" className="block text-xs font-medium text-ink mb-1.5">
                  Documento de identidad (C.C. o NIT) *
                </label>
                <input
                  id="input-documento"
                  required
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  placeholder="Ej. 1098765432"
                  className="field font-mono"
                />
              </div>
            </div>
          </div>

          {/* Bloque 3: Detalle de los Hechos */}
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 sm:p-7 shadow-card space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-ink/5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-vinotinto text-white font-mono text-xs font-bold">
                3
              </span>
              <div>
                <h2 className="font-display text-base font-semibold text-ink">Detalle y Contenido de la Solicitud</h2>
                <p className="text-xs text-ink-faint">Explique de forma clara los hechos que motivan su requerimiento</p>
              </div>
            </div>

            <div>
              <label htmlFor="textarea-asunto" className="block text-xs font-medium text-ink mb-1.5">
                Descripción detallada de la solicitud *
              </label>
              <textarea
                id="textarea-asunto"
                required
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                rows={5}
                placeholder="Describa con la mayor precisión posible el motivo, antecedentes, dirección o detalles de su petición..."
                className="field resize-none leading-relaxed"
              />
            </div>

            {/* Adjuntar documento probatorio */}
            <div>
              <span className="block text-xs font-medium text-ink mb-1.5">
                Documentos de soporte o anexos (opcional)
              </span>
              <div className="rounded-xl border border-dashed border-ink/20 p-4 text-center bg-paper/50 hover:bg-paper transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  onChange={(e) => setArchivo(e.target.files?.[0]?.name ?? null)}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-1.5">
                  <svg className="h-7 w-7 text-ink-faint/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="text-xs font-medium text-vinotinto underline">
                    Haga clic aquí para seleccionar un archivo
                  </span>
                  <span className="text-[11px] text-ink-faint">Formatos admitidos: PDF, JPG, PNG (hasta 10 MB)</span>
                </label>
                {archivo && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-girverde/10 px-3 py-1.5 text-xs text-girverde-deep font-mono">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Archivo adjunto: {archivo}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bloque 4: Autorización y Envío */}
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-5">
            <label className="flex items-start gap-3 cursor-pointer text-xs text-ink-soft leading-relaxed">
              <input
                type="checkbox"
                required
                checked={autoriza}
                onChange={(e) => setAutoriza(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-ink/30 text-vinotinto focus:ring-vinotinto/40"
              />
              <span>
                Declaro bajo la gravedad de juramento que la información suministrada es verídica y
                autorizo a la Alcaldía Municipal de San Juan Girón para el tratamiento de mis datos personales
                conforme a la Ley 1581 de 2012 para los fines de trámite y respuesta de esta PQRS.
              </span>
            </label>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-ink/5">
              <p className="text-[11px] text-ink-faint">
                Al radicar, recibirá su comprobante oficial y constancia con sello de tiempo.
              </p>
              <button
                type="submit"
                disabled={!autoriza}
                className="btn-vinotinto w-full sm:w-auto px-8 disabled:opacity-50 disabled:pointer-events-none"
              >
                Radicar Solicitud Oficial
              </button>
            </div>
          </div>
        </form>

        {/* Columna Lateral: Panel de Orientación y Garantías (4 columnas) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Términos Legales del tipo activo */}
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card">
            <div className="flex items-center gap-2 text-vinotinto mb-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <h3 className="font-display font-semibold text-sm">Término de Respuesta</h3>
            </div>
            <p className="text-2xl font-bold font-mono text-ink">
              {PLAZO_DIAS[tipo]} días hábiles
            </p>
            <p className="text-xs text-ink-faint mt-1 leading-relaxed">
              Plazo normativo para <strong>{tipo}s</strong> estipulado por el Código de Procedimiento Administrativo y de lo Contencioso Administrativo.
            </p>

            <div className="mt-4 pt-3 border-t border-ink/5 space-y-2 text-xs text-ink-soft">
              <div className="flex justify-between">
                <span className="text-ink-faint">Marco legal:</span>
                <span className="font-mono text-ink">Ley 1755 de 2015</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-faint">Dependencia:</span>
                <span className="font-medium text-ink truncate max-w-[150px]">{dependencia}</span>
              </div>
            </div>
          </div>

          {/* Recomendaciones para el ciudadano */}
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card space-y-3">
            <h3 className="font-display font-semibold text-sm text-ink">Recomendaciones Clave</h3>
            <ul className="space-y-2.5 text-xs text-ink-faint">
              <li className="flex items-start gap-2">
                <svg className="h-4 w-4 text-girverde-deep shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Indique direcciones y datos de contacto precisos para evitar devoluciones.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-4 w-4 text-girverde-deep shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Guarde el número de radicado al finalizar para rastrear su respuesta.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-4 w-4 text-girverde-deep shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Si el trámite es de cartera o cobro coactivo, elija Secretaría de Hacienda.</span>
              </li>
            </ul>
          </div>

          {/* Soporte y ayuda presencial */}
          <div className="rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card text-xs space-y-3">
            <h3 className="font-display font-semibold text-sm text-ink">¿Dudas con su radicación?</h3>
            <p className="text-ink-faint leading-relaxed">
              Puede acercarse a la Ventanilla Única de Atención al Ciudadano en el Palacio Municipal (Calle 30 No. 25-66).
            </p>
            <div className="pt-2 border-t border-ink/5">
              <span className="block text-ink-faint">Línea de soporte telefónico:</span>
              <span className="font-mono font-semibold text-ink text-sm">+57 (607) 646 3030</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
