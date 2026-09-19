import type { Deudor } from '../types'

export type FuenteIngestaCoactivo =
  | 'Rentas Municipales (Predial)'
  | 'Tránsito y Transporte (SIMIT)'
  | 'Industria y Comercio (ICA)'
  | 'Inspección de Policía (Ley 1801)'
  | 'Gestión del Riesgo y Sobretasas'

export interface DeudorFeedItem extends Deudor {
  fuenteOrigen: FuenteIngestaCoactivo
  fechaIngresoFeed: string
  entidadEmisora: string
}

/**
 * Repositorio de expedientes pendientes por centralizar en la Dirección de Cobro Coactivo.
 * Simula el flujo continuo de carteras remitidas por distintas secretarías y entidades de San Juan de Girón.
 */
export const COACTIVO_EXTERNAL_FEED: DeudorFeedItem[] = [
  {
    id: 'feed-001',
    documento: '900.834.119-4',
    nombre: 'Inversiones y Construcciones Los Canelos S.A.S.',
    vigenciaAdeudada: '2023 - 2025',
    concepto: 'Impuesto Predial Unificado - Macrolote Campestre',
    valorCapital: 34500000,
    valorIntereses: 6800000,
    estadoProceso: 'En cobro persuasivo',
    fuenteOrigen: 'Rentas Municipales (Predial)',
    entidadEmisora: 'Secretaría de Hacienda de Girón',
    fechaIngresoFeed: '2026-09-18',
    predios: [
      {
        matricula: '300-88129',
        direccion: 'Vereda Llanadas, Sector Rincón de Girón',
        avaluoCatastral: 520000000,
      },
    ],
    historialOficios: [
      {
        fecha: '2026-08-10',
        tipo: 'Invitación a pago',
        descripcion: 'Citación para suscripción de facilidad de pago sobre predio campestre de mayor extensión.',
      },
    ],
  },
  {
    id: 'feed-002',
    documento: '91.432.880',
    nombre: 'Transportes Urbanos Riberas del Río Ltda.',
    vigenciaAdeudada: '2024 - 2025',
    concepto: 'Comparendos de Tránsito Acumulados (SIMIT)',
    valorCapital: 14200000,
    valorIntereses: 2150000,
    estadoProceso: 'Mandamiento de pago notificado',
    fuenteOrigen: 'Tránsito y Transporte (SIMIT)',
    entidadEmisora: 'Secretaría de Tránsito y Transporte de Girón',
    fechaIngresoFeed: '2026-09-18',
    predios: [
      {
        matricula: '300-61044',
        direccion: 'Anillo Vial Km 3, Parque Automotor Girón',
        avaluoCatastral: 280000000,
      },
    ],
    historialOficios: [
      {
        fecha: '2026-07-15',
        tipo: 'Mandamiento de pago',
        descripcion: 'Resolución sancionatoria por mora en 18 comparendos del sistema integrado SIMIT.',
      },
    ],
  },
  {
    id: 'feed-003',
    documento: '804.019.223-1',
    nombre: 'Distribuidora Avícola San Antonio de Girón',
    vigenciaAdeudada: '2022 - 2024',
    concepto: 'Impuesto de Industria y Comercio (ICA) y Avisos',
    valorCapital: 21800000,
    valorIntereses: 4300000,
    estadoProceso: 'Embargo de cuentas en trámite',
    fuenteOrigen: 'Industria y Comercio (ICA)',
    entidadEmisora: 'Dirección de Rentas y Fiscalización',
    fechaIngresoFeed: '2026-09-18',
    predios: [
      {
        matricula: '300-92410',
        direccion: 'Calle 11 # 24-50, B. Bellavista',
        avaluoCatastral: 195000000,
      },
    ],
    historialOficios: [
      {
        fecha: '2026-06-20',
        tipo: 'Requerimiento',
        descripcion: 'Emplazamiento para declarar y pagar vigencias no prescritas de ICA.',
      },
      {
        fecha: '2026-09-01',
        tipo: 'Oficio de embargo',
        descripcion: 'Envío de resolución cautelar a entidades bancarias para embargo preventivo.',
      },
    ],
  },
  {
    id: 'feed-004',
    documento: '63.509.412',
    nombre: 'Claudia Patricia Méndez Forero',
    vigenciaAdeudada: '2023 - 2024',
    concepto: 'Multas de Policía e Infracciones Urbanísticas (Ley 1801)',
    valorCapital: 4950000,
    valorIntereses: 890000,
    estadoProceso: 'En cobro persuasivo',
    fuenteOrigen: 'Inspección de Policía (Ley 1801)',
    entidadEmisora: 'Secretaría de Seguridad y Convivencia',
    fechaIngresoFeed: '2026-09-18',
    predios: [
      {
        matricula: '300-73201',
        direccion: 'Carrera 21 # 34-18, Casco Antiguo',
        avaluoCatastral: 110000000,
      },
    ],
    historialOficios: [
      {
        fecha: '2026-05-12',
        tipo: 'Notificación',
        descripcion: 'Orden de comparendo policial por ocupación y modificación indebida en zona de conservación.',
      },
    ],
  },
  {
    id: 'feed-005',
    documento: '890.203.456-8',
    nombre: 'Agroindustrias del Valle del Río de Oro',
    vigenciaAdeudada: '2021 - 2024',
    concepto: 'Sobretasa Ambiental y Fondo de Mitigación de Riesgos',
    valorCapital: 28900000,
    valorIntereses: 5600000,
    estadoProceso: 'Mandamiento de pago notificado',
    fuenteOrigen: 'Gestión del Riesgo y Sobretasas',
    entidadEmisora: 'Secretaría de Gestión del Riesgo y CDMB',
    fechaIngresoFeed: '2026-09-18',
    predios: [
      {
        matricula: '300-44911',
        direccion: 'Corregimiento El Pantano, Finca El Trapiche',
        avaluoCatastral: 610000000,
      },
    ],
    historialOficios: [
      {
        fecha: '2026-08-30',
        tipo: 'Mandamiento de pago',
        descripcion: 'Cobro por compensación ambiental y amortización de obras de contención sobre el río.',
      },
    ],
  },
  {
    id: 'feed-006',
    documento: '1.095.670.312',
    nombre: 'Estación de Servicio El Portal de Girón S.A.',
    vigenciaAdeudada: '2023 - 2025',
    concepto: 'Sobretasa a la Gasolina Motor y Delineación Urbana',
    valorCapital: 42100000,
    valorIntereses: 8450000,
    estadoProceso: 'Embargo de cuentas en trámite',
    fuenteOrigen: 'Industria y Comercio (ICA)',
    entidadEmisora: 'Dirección de Rentas y Fiscalización',
    fechaIngresoFeed: '2026-09-18',
    predios: [
      {
        matricula: '300-83390',
        direccion: 'Autopista a Bucaramanga, Intercambiador El Poblado',
        avaluoCatastral: 850000000,
      },
    ],
    historialOficios: [
      {
        fecha: '2026-07-04',
        tipo: 'Requerimiento',
        descripcion: 'Auditoría fiscal por inconsistencias en autoliquidación mensual de sobretasa.',
      },
      {
        fecha: '2026-09-12',
        tipo: 'Mandamiento de pago',
        descripcion: 'Emisión de título ejecutivo y mandamiento de pago preventivo.',
      },
    ],
  },
]
