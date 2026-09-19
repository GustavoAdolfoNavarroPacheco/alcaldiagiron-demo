import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { PQRS, TipoSolicitudPQRS } from '../../types'
import type { TramiteSecretaria } from '../../types/secretarias'
import { addPQRS, addTramiteSecretaria, nextRadicadoNumber } from '../../data/storage'
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
  'Secretaría de Salud',
  'Secretaría de Hacienda',
  'Cobro Coactivo',
  'Secretaría de Tránsito y Transporte',
  'Secretaría de Ordenamiento Territorial',
  'Secretaría de Seguridad, Convivencia y Gestión del Riesgo',
  'Secretaría de Desarrollo Social',
  'Secretaría de Gobierno',
  'Secretaría de Educación',
  'Secretaría de Infraestructura',
  'Secretaría de Planeación',
  'Secretaría de Cultura, Turismo y Deporte',
  'Atención al Ciudadano / Ventanilla Única',
]

const DEPENDENCIA_A_SLUG: Record<string, string> = {
  'Secretaría de Salud': 'salud',
  'Secretaría de Hacienda': 'hacienda',
  'Cobro Coactivo': 'hacienda',
  'Secretaría de Tránsito y Transporte': 'transito-transporte',
  'Secretaría de Ordenamiento Territorial': 'ordenamiento-territorial',
  'Secretaría de Seguridad, Convivencia y Gestión del Riesgo': 'seguridad-gestion-riesgo',
  'Secretaría de Desarrollo Social': 'desarrollo-social',
  'Secretaría de Gobierno': 'gobierno',
  'Secretaría de Educación': 'educacion',
  'Secretaría de Infraestructura': 'infraestructura',
  'Secretaría de Planeación': 'planeacion',
  'Secretaría de Cultura, Turismo y Deporte': 'cultura-turismo-deporte',
}

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

    // 1. Guardar en Ventanilla Única General
    addPQRS(nueva)

    // 2. Si corresponde a una secretaría específica, registrar también en su despacho
    const slug = DEPENDENCIA_A_SLUG[dependencia]
    if (slug) {
      const tramiteSecretaria: TramiteSecretaria = {
        id: `trm-${nueva.id}`,
        radicado: nueva.radicado,
        titulo: `[PQRS - ${nueva.tipo}] ${nueva.asunto.slice(0, 45)}...`,
        solicitante: nueva.solicitante,
        documentoSolicitante: nueva.documentoSolicitante,
        fecha: nueva.fechaRadicacion,
        estado: 'En Trámite',
        prioridad: nueva.tipo === 'Denuncia' || nueva.tipo === 'Reclamo' ? 'Alta' : 'Media',
        tipoTramite: `PQRS / ${nueva.tipo}`,
        descripcion: nueva.asunto,
      }
      addTramiteSecretaria(slug, tramiteSecretaria)
    }

    setResultado(nueva)
  }

  // Vista de confirmación con certificado de radicación oficial
  if (resultado) {
    return (
      <div className="space-y-6">
        {/* Banner de éxito */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Radicación Exitosa</span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                  Solicitud Registrada Oficialmente
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Su trámite ha entrado formalmente en el sistema de correspondencia y gestión documental del municipio.
                </p>
              </div>
            </div>

            <span className="rounded-md border border-emerald-300 bg-white px-3 py-1 font-mono text-xs font-semibold text-emerald-700">
              Estado: En proceso
            </span>
          </div>
        </div>

        {/* Detalle del comprobante en dos columnas balanceadas */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Tarjeta del certificado oficial */}
          <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-slate-900">Comprobante de Radicación</p>
                <p className="text-xs text-slate-400">Ventanilla Única Digital · Alcaldía de Girón</p>
              </div>
              <span className="font-mono text-[11px] font-semibold text-vinotinto bg-vinotinto/10 px-2.5 py-1 rounded-md">
                Ley 1755 de 2015
              </span>
            </div>

            <div className="my-6 flex justify-center">
              <SelloRadicado radicado={resultado.radicado} fecha={resultado.fechaRadicacion} />
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 rounded-lg bg-slate-50 p-4 border border-slate-100 text-xs">
              <div>
                <dt className="text-slate-400">Número de Radicado</dt>
                <dd className="font-mono text-base font-bold text-slate-900 mt-0.5">{resultado.radicado}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Dependencia Asignada</dt>
                <dd className="font-semibold text-slate-800 mt-0.5">{resultado.dependencia}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Tipo de Solicitud</dt>
                <dd className="font-semibold text-slate-800 mt-0.5">{resultado.tipo}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Término Legal de Respuesta</dt>
                <dd className="font-semibold text-vinotinto mt-0.5">{PLAZO_DIAS[resultado.tipo]} días hábiles</dd>
              </div>
              <div>
                <dt className="text-slate-400">Fecha de Radicación</dt>
                <dd className="font-mono text-slate-700 mt-0.5">{resultado.fechaRadicacion}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Fecha Límite Estimada</dt>
                <dd className="font-mono text-slate-700 mt-0.5">{resultado.fechaLimite}</dd>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                <dt className="text-slate-400">Peticionario</dt>
                <dd className="font-medium text-slate-900 mt-0.5">{resultado.solicitante} (Doc: {resultado.documentoSolicitante})</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-slate-400">Asunto</dt>
                <dd className="text-slate-700 text-xs leading-relaxed mt-0.5">{resultado.asunto}</dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/ciudadano/consultar"
                className="inline-flex items-center justify-center rounded-lg bg-vinotinto px-5 py-2 text-xs font-semibold text-white hover:bg-vinotinto-deep transition-colors shadow-2xs flex-1 text-center"
              >
                Consultar este radicado
              </Link>
              <button
                type="button"
                onClick={() => setResultado(null)}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex-1 text-center"
              >
                Radicar otra solicitud
              </button>
            </div>
          </div>

          {/* Panel de instrucciones y próximos pasos */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900">¿Qué sucede a continuación?</h3>
              <p className="mt-1 text-xs text-slate-500">Pasos del proceso de atención de su trámite:</p>

              <ol className="mt-4 space-y-3 text-xs">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-vinotinto text-white font-mono text-[11px] font-bold">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">Radicación Formal</p>
                    <p className="text-slate-500 leading-relaxed text-[11px] mt-0.5">
                      Su solicitud fue ingresada y sellada digitalmente en el sistema institucional.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-mono text-[11px] font-bold">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">Reparto Técnico</p>
                    <p className="text-slate-500 leading-relaxed text-[11px] mt-0.5">
                      Se traslada al despacho de <strong>{resultado.dependencia}</strong> para emisión de concepto.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-mono text-[11px] font-bold">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">Notificación al Ciudadano</p>
                    <p className="text-slate-500 leading-relaxed text-[11px] mt-0.5">
                      Recibirá el acto administrativo o respuesta de fondo dentro de los <strong>{PLAZO_DIAS[resultado.tipo]} días hábiles</strong>.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Vista del formulario con distribución balanceada en 2 columnas
  return (
    <div className="space-y-6">
      {/* Encabezado descriptivo */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Ventanilla Única Oficial</span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Radicar una PQRS
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Sistema oficial de atención al ciudadano</span>
          </div>
        </div>
        <p className="mt-1.5 text-xs text-slate-500 max-w-2xl leading-relaxed">
          Diligencie el siguiente formulario para ingresar formalmente su petición, queja, reclamo, sugerencia o denuncia.
          Campos identificados con asterisco (*) son de diligenciamiento obligatorio.
        </p>
      </div>

      {/* Grid de 2 columnas: Formulario (8 columnas) + Panel de Guía (4 columnas) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Columna Principal: Formulario estructurado */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          {/* Bloque 1: Tipo de solicitud */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-vinotinto text-white font-mono text-xs font-bold">
                1
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Clasificación del Trámite</h2>
                <p className="text-[11px] text-slate-400">Seleccione el tipo de trámite y la secretaría competente</p>
              </div>
            </div>

            {/* Selector interactivo de tipos de PQRS con tiempo legal */}
            <div>
              <span className="block text-xs font-medium text-slate-700 mb-2">Tipo de trámite *</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TIPOS.map((t) => {
                  const isSelected = tipo === t
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTipo(t)}
                      className={`flex flex-col text-left p-3 rounded-lg border transition-all text-xs ${
                        isSelected
                          ? 'border-vinotinto bg-vinotinto/5 text-vinotinto font-semibold shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-semibold">{t}</span>
                      <span className="font-mono text-[10px] text-slate-400 mt-1">
                        {PLAZO_DIAS[t]} días hábiles
                      </span>
                    </button>
                  )
                })}
              </div>
              <p className="mt-2 text-[11px] text-slate-500 italic">
                {TIPO_DESCRIPCIONES[tipo]}
              </p>
            </div>

            {/* Dependencia destino */}
            <div>
              <label htmlFor="select-dependencia" className="block text-xs font-medium text-slate-700 mb-1.5">
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
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-vinotinto text-white font-mono text-xs font-bold">
                2
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Datos del Ciudadano Solicitante</h2>
                <p className="text-[11px] text-slate-400">Información para contacto y notificación formal</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="input-solicitante" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Nombre completo del solicitante *
                </label>
                <input
                  id="input-solicitante"
                  required
                  value={solicitante}
                  onChange={(e) => setSolicitante(e.target.value)}
                  placeholder="Ej. Juan Carlos Pérez Gómez"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="input-documento" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Documento de identidad (C.C. o NIT) *
                </label>
                <input
                  id="input-documento"
                  required
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  placeholder="Ej. 1098765432"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Bloque 3: Detalle de los Hechos */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-vinotinto text-white font-mono text-xs font-bold">
                3
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Detalle y Contenido de la Solicitud</h2>
                <p className="text-[11px] text-slate-400">Explique con claridad los antecedentes que motivan su trámite</p>
              </div>
            </div>

            <div>
              <label htmlFor="textarea-asunto" className="block text-xs font-medium text-slate-700 mb-1.5">
                Descripción detallada de la solicitud *
              </label>
              <textarea
                id="textarea-asunto"
                required
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                rows={5}
                placeholder="Describa con la mayor precisión posible los antecedentes, predio, motivo o petición puntual..."
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Adjuntar documento probatorio */}
            <div>
              <span className="block text-xs font-medium text-slate-700 mb-1.5">
                Documentos de soporte o anexos (opcional)
              </span>
              <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  onChange={(e) => setArchivo(e.target.files?.[0]?.name ?? null)}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-1">
                  <svg className="h-6 w-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="text-xs font-semibold text-vinotinto hover:underline">
                    Haga clic aquí para adjuntar archivo
                  </span>
                  <span className="text-[11px] text-slate-400">Formatos admitidos: PDF, JPG, PNG (máx. 10 MB)</span>
                </label>
                {archivo && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs text-emerald-700 font-mono">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Archivo cargado: {archivo}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bloque 4: Autorización y Envío */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 leading-relaxed">
              <input
                type="checkbox"
                required
                checked={autoriza}
                onChange={(e) => setAutoriza(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-vinotinto focus:ring-vinotinto"
              />
              <span>
                Declaro bajo la gravedad de juramento que la información suministrada es verídica y
                autorizo a la Alcaldía Municipal de San Juan de Girón para el tratamiento de mis datos personales
                conforme a la Ley 1581 de 2012 para los fines de trámite y respuesta de esta PQRS.
              </span>
            </label>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
              <p className="text-[11px] text-slate-400">
                Al radicar, recibirá su constancia oficial con sello cronológico digital.
              </p>
              <button
                type="submit"
                disabled={!autoriza}
                className="inline-flex items-center justify-center rounded-lg bg-vinotinto px-6 py-2.5 text-xs font-semibold text-white hover:bg-vinotinto-deep transition-colors shadow-2xs w-full sm:w-auto disabled:opacity-50 disabled:pointer-events-none"
              >
                Radicar Solicitud Oficial
              </button>
            </div>
          </div>
        </form>

        {/* Columna Lateral: Panel de Orientación y Garantías (4 columnas) */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Términos Legales del tipo activo */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-vinotinto mb-1.5">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Término de Respuesta</h3>
            </div>
            <p className="text-2xl font-bold font-mono text-slate-900">
              {PLAZO_DIAS[tipo]} días hábiles
            </p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Plazo normativo para <strong>{tipo}s</strong> estipulado por el Código de Procedimiento Administrativo.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Marco normativo:</span>
                <span className="font-mono text-slate-700">Ley 1755 de 2015</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Despacho:</span>
                <span className="font-medium text-slate-800 truncate max-w-[150px]">{dependencia}</span>
              </div>
            </div>
          </div>

          {/* Recomendaciones para el ciudadano */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recomendaciones Clave</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span>Indique teléfonos y correos actualizados para evitar devoluciones.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span>Conserve el código alfanumérico al finalizar para hacer seguimiento en línea.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span>Para cobro coactivo o impuestos, seleccione la Secretaría de Hacienda.</span>
              </li>
            </ul>
          </div>

          {/* Soporte y ayuda presencial */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs text-xs space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Atención Personalizada</h3>
            <p className="text-slate-500 leading-relaxed">
              Ventanilla Única de Atención en el Palacio Municipal (Calle 30 No. 25-66, Centro Histórico).
            </p>
            <div className="pt-2 border-t border-slate-100">
              <span className="block text-slate-400 text-[11px]">Línea telefónica directa:</span>
              <span className="font-mono font-bold text-slate-800 text-xs">+57 (607) 646 3030</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
