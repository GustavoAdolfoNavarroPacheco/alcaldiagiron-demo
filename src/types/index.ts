export type NivelUrgencia = 'rojo' | 'naranja' | 'amarillo' | 'verde'

export interface Predio {
  matricula: string
  direccion: string
  avaluoCatastral: number
}

export interface OficioHistorial {
  fecha: string
  tipo: string
  descripcion: string
}

export interface Deudor {
  id: string
  documento: string
  nombre: string
  vigenciaAdeudada: string
  concepto: string
  valorCapital: number
  valorIntereses: number
  estadoProceso: string
  predios: Predio[]
  historialOficios: OficioHistorial[]
}

export function nivelUrgenciaDeudor(deudor: Deudor): NivelUrgencia {
  const total = deudor.valorCapital + deudor.valorIntereses
  if (total >= 20_000_000) return 'rojo'
  if (total >= 10_000_000) return 'naranja'
  if (total >= 3_000_000) return 'amarillo'
  return 'verde'
}

export type TipoSolicitudPQRS = 'Petición' | 'Queja' | 'Reclamo' | 'Sugerencia' | 'Denuncia'

export type EstadoPQRS = 'En proceso' | 'Resuelta' | 'Vencida'

export type AuditoriaPQRS = 'verde' | 'azul' | 'amarillo' | 'rojo'

export interface PQRS {
  id: string
  radicado: string
  tipo: TipoSolicitudPQRS
  asunto: string
  solicitante: string
  documentoSolicitante: string
  fechaRadicacion: string
  fechaLimite: string
  fechaRespuesta: string | null
  estado: EstadoPQRS
  archivoAdjunto: string | null
  dependencia: string
}

export function auditoriaPQRS(pqrs: PQRS): AuditoriaPQRS {
  const hoy = new Date()
  const limite = new Date(pqrs.fechaLimite)
  if (pqrs.estado === 'Resuelta' && pqrs.fechaRespuesta) {
    const respuesta = new Date(pqrs.fechaRespuesta)
    return respuesta <= limite ? 'verde' : 'azul'
  }
  if (hoy > limite) return 'rojo'
  return 'amarillo'
}
