export interface EstablecimientoIVC {
  id: string
  nombre: string
  nit: string
  categoria: 'Gastronomía' | 'Farmacias y Droguerías' | 'Panaderías y Alimentos' | 'Comercio General'
  direccion: string
  sector: string
  concepto: 'Favorable' | 'Favorable con Requerimientos' | 'Desfavorable' | 'En Trámite'
  esNegocioConfiable: boolean
  codigoQR: string
  calificacion: number
  fechaInspeccion: string
  vigencia: string
  inspector: string
}

export interface IndicadorEpidemiologico {
  evento: string
  casosSemana: number
  tendencia: 'Estable' | 'En Descenso' | 'Alerta Preventiva'
  intervencion: string
  coberturaControl: string
}

export interface PuntoSalud {
  nombre: string
  tipo: 'Clínica Municipal' | 'Centro de Salud' | 'Puesto de Salud'
  direccion: string
  telefono: string
  horario: string
  servicios: string[]
}

export const ESTABLECIMIENTOS_IVC: EstablecimientoIVC[] = [
  {
    id: 'est-01',
    nombre: 'Restaurante El Portal Colonial',
    nit: '900.876.543-1',
    categoria: 'Gastronomía',
    direccion: 'Calle 28 No. 24-18, Parque Principal',
    sector: 'Centro Histórico',
    concepto: 'Favorable',
    esNegocioConfiable: true,
    codigoQR: 'IVC-GIR-2026-0041',
    calificacion: 98,
    fechaInspeccion: '2026-08-14',
    vigencia: '2027-08-14',
    inspector: 'Dra. Claudia Rueda (Ing. de Alimentos)',
  },
  {
    id: 'est-02',
    nombre: 'Droguería y Farmacia San Juan',
    nit: '901.234.567-8',
    categoria: 'Farmacias y Droguerías',
    direccion: 'Carrera 25 No. 31-09',
    sector: 'Centro Histórico',
    concepto: 'Favorable',
    esNegocioConfiable: true,
    codigoQR: 'IVC-GIR-2026-0082',
    calificacion: 95,
    fechaInspeccion: '2026-07-22',
    vigencia: '2027-07-22',
    inspector: 'Dr. Julián Vargas (Regente Farmacéutico)',
  },
  {
    id: 'est-03',
    nombre: 'Panadería y Pastelería La Tradición Gironesa',
    nit: '800.765.432-0',
    categoria: 'Panaderías y Alimentos',
    direccion: 'Calle 34 No. 23-45',
    sector: 'El Poblado',
    concepto: 'Favorable',
    esNegocioConfiable: true,
    codigoQR: 'IVC-GIR-2026-0105',
    calificacion: 92,
    fechaInspeccion: '2026-09-02',
    vigencia: '2027-09-02',
    inspector: 'Dra. Claudia Rueda (Ing. de Alimentos)',
  },
  {
    id: 'est-04',
    nombre: 'Asadero y Piqueteadero El Mesón Real',
    nit: '900.543.210-9',
    categoria: 'Gastronomía',
    direccion: 'Avenida Los Caneyes No. 18-04',
    sector: 'Rincón de Girón',
    concepto: 'Favorable con Requerimientos',
    esNegocioConfiable: false,
    codigoQR: 'IVC-GIR-2026-0158',
    calificacion: 82,
    fechaInspeccion: '2026-08-29',
    vigencia: '2026-11-29',
    inspector: 'Ing. Carlos Mendoza',
  },
  {
    id: 'est-05',
    nombre: 'Supermercado Central de Girón',
    nit: '890.123.456-7',
    categoria: 'Comercio General',
    direccion: 'Carrera 26 No. 29-12',
    sector: 'Centro Histórico',
    concepto: 'Favorable',
    esNegocioConfiable: true,
    codigoQR: 'IVC-GIR-2026-0019',
    calificacion: 96,
    fechaInspeccion: '2026-06-18',
    vigencia: '2027-06-18',
    inspector: 'Dra. Paola Ortiz',
  },
  {
    id: 'est-06',
    nombre: 'Café & Dulces Típicos Mansión del Fraile',
    nit: '900.321.654-3',
    categoria: 'Gastronomía',
    direccion: 'Calle 30 No. 26-02',
    sector: 'Centro Histórico',
    concepto: 'Favorable',
    esNegocioConfiable: true,
    codigoQR: 'IVC-GIR-2026-0008',
    calificacion: 100,
    fechaInspeccion: '2026-08-05',
    vigencia: '2027-08-05',
    inspector: 'Dra. Claudia Rueda (Ing. de Alimentos)',
  },
]

export const INDICADORES_SIVIGILA: IndicadorEpidemiologico[] = [
  {
    evento: 'Dengue (Vigilancia Vectorial)',
    casosSemana: 14,
    tendencia: 'En Descenso',
    intervencion: 'Fumigación y control biológico en 6 barrios prioritarios',
    coberturaControl: '91% de predios visitados',
  },
  {
    evento: 'Infección Respiratoria Aguda (IRA)',
    casosSemana: 48,
    tendencia: 'Estable',
    intervencion: 'Campaña de vacunación contra influenza en menores y adultos mayores',
    coberturaControl: 'Puntos activos en Clínica Girón',
  },
  {
    evento: 'Programa Ampliado de Inmunizaciones (PAI)',
    casosSemana: 125,
    tendencia: 'Alerta Preventiva',
    intervencion: 'Búsqueda activa de niños con esquemas incompletos de vacunación',
    coberturaControl: 'Cobertura acumulada 94.2%',
  },
]

export const RED_SALUD_GIRON: PuntoSalud[] = [
  {
    nombre: 'Clínica Girón E.S.E. (Sede Principal)',
    tipo: 'Clínica Municipal',
    direccion: 'Calle 33 No. 26-15, Girón',
    telefono: '+57 (607) 646 0520',
    horario: 'Urgencias 24 Horas · Consulta Externa 7:00 a.m. a 5:00 p.m.',
    servicios: ['Urgencias 24h', 'Hospitalización', 'Vacunación PAI', 'Laboratorio Clínico', 'Odontología'],
  },
  {
    nombre: 'Centro de Salud Nuevo Girón',
    tipo: 'Centro de Salud',
    direccion: 'Manzana 14 Lote 1, Barrio Nuevo Girón',
    telefono: '+57 (607) 646 3030 Ext. 410',
    horario: 'Lunes a Viernes 7:00 a.m. a 4:00 p.m.',
    servicios: ['Medicina General', 'Vacunación', 'Crecimiento y Desarrollo', 'Planificación Familiar'],
  },
  {
    nombre: 'Centro de Salud El Poblado',
    tipo: 'Centro de Salud',
    direccion: 'Carrera 20 No. 42-10, El Poblado',
    telefono: '+57 (607) 646 3030 Ext. 412',
    horario: 'Lunes a Viernes 7:00 a.m. a 4:00 p.m.',
    servicios: ['Medicina General', 'Control Prenatal', 'Vacunación', 'Toma de Muestras'],
  },
  {
    nombre: 'Puesto de Salud Acapulco',
    tipo: 'Puesto de Salud',
    direccion: 'Sector Rural Acapulco, Vía Ruitoque',
    telefono: '+57 (607) 646 3030 Ext. 415',
    horario: 'Lunes, Miércoles y Viernes 8:00 a.m. a 1:00 p.m.',
    servicios: ['Atención Médica Primaria', 'Vacunación', 'Brigadas Comunitarias'],
  },
]
