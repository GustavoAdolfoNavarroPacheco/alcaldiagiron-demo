import mockData from './mockData.json'
import type { Deudor, PQRS } from '../types'
import type { TramiteSecretaria, EstadoTramiteSecretaria } from '../types/secretarias'
import { SECRETARIAS_GIRON } from './secretariasData'
import { COACTIVO_EXTERNAL_FEED, type DeudorFeedItem, type FuenteIngestaCoactivo } from './coactivoFeed'

const KEYS = {
  deudores: 'gidi.deudores',
  pqrs: 'gidi.pqrs',
  secretariasTramites: 'gidi.secretarias_tramites',
} as const

// Evento global para reactividad instantánea entre componentes y vistas
export const STORAGE_EVENT = 'gidi-storage-change'

export function emitStorageChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT))
  }
}

const memoryStore: Record<string, string> = {}

function load<T>(key: string, seed: T): T {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(key)
      if (!raw) {
        window.localStorage.setItem(key, JSON.stringify(seed))
        return seed
      }
      return JSON.parse(raw) as T
    }
    const rawMem = memoryStore[key]
    if (!rawMem) {
      memoryStore[key] = JSON.stringify(seed)
      return seed
    }
    return JSON.parse(rawMem) as T
  } catch {
    return seed
  }
}

function save<T>(key: string, value: T) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value))
      emitStorageChange()
    } else {
      memoryStore[key] = JSON.stringify(value)
    }
  } catch (error) {
    console.error('Error al persistir en localStorage:', error)
  }
}


// -------------------------------------------------------------
// SECCIÓN: Cobro Coactivo y Deudores
// -------------------------------------------------------------
export function getDeudores(): Deudor[] {
  return load<Deudor[]>(KEYS.deudores, mockData.deudores as Deudor[])
}

export function saveDeudores(deudores: Deudor[]) {
  save(KEYS.deudores, deudores)
}

export interface ResultadoIngestaCoactivo {
  exito: boolean
  deudorIngestado?: DeudorFeedItem
  totalActual: number
  pendientesEnFeed: number
  mensaje: string
}

export function obtenerEstadisticasIngestaCoactivo() {
  const deudoresActuales = getDeudores()
  const existentesIds = new Set(deudoresActuales.map((d) => d.id))
  const pendientes = COACTIVO_EXTERNAL_FEED.filter((f) => !existentesIds.has(f.id))

  return {
    totalEnSistema: deudoresActuales.length,
    totalEnFeed: COACTIVO_EXTERNAL_FEED.length,
    pendientesPorCargar: pendientes.length,
    fuentesDisponibles: [
      'Rentas Municipales (Predial)',
      'Tránsito y Transporte (SIMIT)',
      'Industria y Comercio (ICA)',
      'Inspección de Policía (Ley 1801)',
      'Gestión del Riesgo y Sobretasas',
    ] as FuenteIngestaCoactivo[],
  }
}

export function ingestarProximoDeudor(): ResultadoIngestaCoactivo {
  const deudoresActuales = getDeudores()
  const existentesIds = new Set(deudoresActuales.map((d) => d.id))

  // Buscar el primer expediente del feed externo no cargado aún
  const proximo = COACTIVO_EXTERNAL_FEED.find((f) => !existentesIds.has(f.id))

  if (proximo) {
    const actualizados = [proximo, ...deudoresActuales]
    saveDeudores(actualizados)
    const restantes = COACTIVO_EXTERNAL_FEED.filter(
      (f) => !existentesIds.has(f.id) && f.id !== proximo.id,
    ).length

    return {
      exito: true,
      deudorIngestado: proximo,
      totalActual: actualizados.length,
      pendientesEnFeed: restantes,
      mensaje: `Expediente ${proximo.id} (${proximo.nombre}) centralizado exitosamente desde ${proximo.fuenteOrigen}.`,
    }
  }

  // Si se importaron los de la lista estática, sintetizar periódicamente nuevos títulos de fiscalización
  const consecutivo = deudoresActuales.length + 1
  const categoriasSinteticas: Array<{
    concepto: string
    fuente: FuenteIngestaCoactivo
    entidad: string
    prefijoDoc: string
  }> = [
    {
      concepto: 'Impuesto Predial Unificado - Sector Residencial',
      fuente: 'Rentas Municipales (Predial)',
      entidad: 'Secretaría de Hacienda de Girón',
      prefijoDoc: '1.098.',
    },
    {
      concepto: 'Comparendos de Tránsito Acumulados (SIMIT)',
      fuente: 'Tránsito y Transporte (SIMIT)',
      entidad: 'Secretaría de Tránsito y Transporte',
      prefijoDoc: '91.',
    },
    {
      concepto: 'Declaración y Pago Extemporáneo de ICA',
      fuente: 'Industria y Comercio (ICA)',
      entidad: 'Dirección de Rentas y Fiscalización',
      prefijoDoc: '804.',
    },
    {
      concepto: 'Infracción Urbanística y Espacio Público (Ley 1801)',
      fuente: 'Inspección de Policía (Ley 1801)',
      entidad: 'Secretaría de Seguridad Ciudadana',
      prefijoDoc: '63.',
    },
  ]

  const seleccion = categoriasSinteticas[(consecutivo - 1) % categoriasSinteticas.length]
  const nuevoSintetico: DeudorFeedItem = {
    id: `feed-auto-${consecutivo}`,
    documento: `${seleccion.prefijoDoc}${Math.floor(100000 + Math.random() * 900000)}`,
    nombre: `Contribuyente Fiscal Girón #${consecutivo}`,
    vigenciaAdeudada: '2024 - 2025',
    concepto: seleccion.concepto,
    valorCapital: Math.floor(3500000 + Math.random() * 22000000),
    valorIntereses: Math.floor(500000 + Math.random() * 3500000),
    estadoProceso: consecutivo % 3 === 0 ? 'Mandamiento de pago notificado' : 'En cobro persuasivo',
    fuenteOrigen: seleccion.fuente,
    entidadEmisora: seleccion.entidad,
    fechaIngresoFeed: new Date().toISOString().split('T')[0],
    predios: [
      {
        matricula: `300-${Math.floor(10000 + Math.random() * 90000)}`,
        direccion: `Cl ${Math.floor(10 + Math.random() * 45)} #${Math.floor(10 + Math.random() * 30)}-${Math.floor(10 + Math.random() * 40)}, Girón`,
        avaluoCatastral: Math.floor(95000000 + Math.random() * 250000000),
      },
    ],
    historialOficios: [
      {
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'Invitación a pago',
        descripcion: `Incorporación automática al módulo de Cobro Coactivo vía interoperabilidad con ${seleccion.entidad}.`,
      },
    ],
  }

  const actualizados = [nuevoSintetico, ...deudoresActuales]
  saveDeudores(actualizados)

  return {
    exito: true,
    deudorIngestado: nuevoSintetico,
    totalActual: actualizados.length,
    pendientesEnFeed: 0,
    mensaje: `Expediente continuo ${nuevoSintetico.id} (${nuevoSintetico.nombre}) incorporado desde ${nuevoSintetico.fuenteOrigen}.`,
  }
}


// -------------------------------------------------------------
// SECCIÓN: Ventanilla Única (PQRS General)
// -------------------------------------------------------------
export function getPQRS(): PQRS[] {
  return load<PQRS[]>(KEYS.pqrs, mockData.pqrs as PQRS[])
}

export function savePQRS(items: PQRS[]) {
  save(KEYS.pqrs, items)
}

export function addPQRS(item: PQRS): PQRS[] {
  const current = getPQRS()
  const updated = [item, ...current]
  savePQRS(updated)
  return updated
}

export function nextRadicadoNumber(): string {
  const year = new Date().getFullYear()
  const current = getPQRS()
  const max = current
    .map((p) => p.radicado)
    .filter((r) => r.includes(String(year)))
    .map((r) => Number(r.split('-').pop()))
    .filter((n) => !Number.isNaN(n))
    .reduce((a, b) => Math.max(a, b), 0)
  const next = max + 1
  return `PQRS-${year}-${String(next).padStart(6, '0')}`
}

// -------------------------------------------------------------
// SECCIÓN: Base de Datos JSON por Secretaría
// -------------------------------------------------------------
function seedSecretariasTramites(): Record<string, TramiteSecretaria[]> {
  const seed: Record<string, TramiteSecretaria[]> = {}
  for (const sec of SECRETARIAS_GIRON) {
    seed[sec.slug] = [...sec.tramites]
  }
  return seed
}

export function getAllSecretariasTramites(): Record<string, TramiteSecretaria[]> {
  return load<Record<string, TramiteSecretaria[]>>(
    KEYS.secretariasTramites,
    seedSecretariasTramites(),
  )
}

export function getTramitesSecretaria(slug: string): TramiteSecretaria[] {
  const todos = getAllSecretariasTramites()
  return todos[slug] ?? []
}

export function addTramiteSecretaria(slug: string, tramite: TramiteSecretaria): TramiteSecretaria[] {
  const todos = getAllSecretariasTramites()
  const actuales = todos[slug] ?? []
  todos[slug] = [tramite, ...actuales]
  save(KEYS.secretariasTramites, todos)
  return todos[slug]
}

export function updateTramiteSecretaria(
  slug: string,
  tramiteId: string,
  nuevoEstado: EstadoTramiteSecretaria,
  respuestaOficial?: string,
): TramiteSecretaria[] {
  const todos = getAllSecretariasTramites()
  const actuales = todos[slug] ?? []
  todos[slug] = actuales.map((t) =>
    t.id === tramiteId
      ? {
          ...t,
          estado: nuevoEstado,
          ...(respuestaOficial ? { respuestaOficial } : {}),
        }
      : t,
  )
  save(KEYS.secretariasTramites, todos)
  return todos[slug]
}

export function nextTramiteRadicado(sigla: string = 'TRM'): string {
  const year = new Date().getFullYear()
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  return `${sigla}-${year}-${randomSuffix}`
}

// Buscar cualquier radicado o documento en PQRS o Trámites de Secretarías
export function findExpedienteCiudadano(criterio: string): {
  tipo: 'pqrs' | 'tramite'
  datos: PQRS | (TramiteSecretaria & { secretariaSlug?: string })
} | null {
  const query = criterio.trim().toLowerCase()
  if (!query) return null

  // 1. Buscar en PQRS
  const todosPQRS = getPQRS()
  const pqrsEncontrada = todosPQRS.find(
    (p) =>
      p.radicado.toLowerCase() === query ||
      p.documentoSolicitante.toLowerCase() === query,
  )
  if (pqrsEncontrada) {
    return { tipo: 'pqrs', datos: pqrsEncontrada }
  }

  // 2. Buscar en Trámites de Secretarías
  const todosTramites = getAllSecretariasTramites()
  for (const [slug, lista] of Object.entries(todosTramites)) {
    const encontrado = lista.find(
      (t) =>
        t.radicado.toLowerCase() === query ||
        t.documentoSolicitante.replace(/\D/g, '').includes(query.replace(/\D/g, '')) ||
        t.documentoSolicitante.toLowerCase() === query,
    )
    if (encontrado) {
      return { tipo: 'tramite', datos: { ...encontrado, secretariaSlug: slug } }
    }
  }

  return null
}

export function resetDemoData() {
  window.localStorage.removeItem(KEYS.deudores)
  window.localStorage.removeItem(KEYS.pqrs)
  window.localStorage.removeItem(KEYS.secretariasTramites)
  emitStorageChange()
}

