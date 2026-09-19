export type EstadoTramiteSecretaria =
  | 'En Trámite'
  | 'Aprobado'
  | 'En Revisión'
  | 'Finalizado'
  | 'Rechazado'

export type PrioridadTramite = 'Alta' | 'Media' | 'Baja'

export type EstadoRegistroSolucion =
  | 'Pendiente'
  | 'En Revisión IA'
  | 'Validado'
  | 'Aprobado'
  | 'Emitido'
  | 'Archivado'

export type NivelCriticidadExpediente = 'Bajo' | 'Medio' | 'Alto' | 'Crítico'

export interface PropiedadContextual {
  etiqueta: string
  valor: string
  destacado?: boolean
}

export interface HitoTrazabilidad {
  fecha: string
  evento: string
  responsable: string
}

export interface MetadatosDetalleExpediente {
  ubicacionSector?: string
  nivelCriticidad: NivelCriticidadExpediente
  analisisPredictivoIA: string
  propiedadesEspecificas: PropiedadContextual[]
  historialTrazabilidad: HitoTrazabilidad[]
  coordenadasReferencia?: string
}

export interface RegistroSolucionIA {
  id: string
  codigo: string
  titulo: string
  entidadOSujeto: string
  fecha: string
  estado: EstadoRegistroSolucion
  indicadorClave: string
  detalle: string
  asistenciaIA?: string
  soporteDoc?: string
  metadatosDetalle?: MetadatosDetalleExpediente
}

export interface SolucionTecnicaSecretaria {
  id: string
  nombre: string
  descripcion: string
  sistemaPropuesta: string
  kpis: { label: string; value: string }[]
  registros: RegistroSolucionIA[]
}

export interface TramiteSecretaria {
  id: string
  radicado: string
  titulo: string
  solicitante: string
  documentoSolicitante: string
  fecha: string
  estado: EstadoTramiteSecretaria
  prioridad: PrioridadTramite
  tipoTramite: string
  descripcion: string
  respuestaOficial?: string
}

export interface IndicadoresSecretaria {
  tramitesTotal: number
  enTramite: number
  aprobados: number
  tiempoPromedioDias: number
  presupuestoAsignado: number
  presupuestoEjecutado: number
}

export interface SecretariaInfo {
  slug: string
  nombre: string
  secretario: string
  cargo: string
  mision: string
  ubicacion: string
  contactoEmail: string
  lineasAccion: string[]
  indicadores: IndicadoresSecretaria
  solucionesTecnicas: SolucionTecnicaSecretaria[]
  tramites: TramiteSecretaria[]
}
