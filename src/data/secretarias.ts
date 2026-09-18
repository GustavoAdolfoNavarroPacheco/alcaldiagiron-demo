export interface PropuestaPDF {
  numero: string
  titulo: string
  sistemas: string
  modulos: string[]
}

export interface Secretaria {
  id: string
  slug: string
  nombre: string
  sigla?: string
  descripcion: string
  propuestasPDF: PropuestaPDF[]
  canales: {
    correo: string
    telefono: string
    ubicacion: string
  }
}

export const SECRETARIAS: Secretaria[] = [
  {
    id: 'salud',
    slug: 'secretaria-salud',
    nombre: 'Secretaría de Salud',
    sigla: 'SSM',
    descripcion: 'Garantía del derecho a la salud, vigilancia epidemiológica, auditoría a EPS/IPS e inspección sanitaria de establecimientos comerciales.',
    propuestasPDF: [
      {
        numero: 'Propuesta 02',
        titulo: 'Auditoría de EPS/IPS y Salud Pública',
        sistemas: '1 sistema · 4 módulos',
        modulos: [
          'Digitalización y extracción (OCR de listas de chequeo)',
          'Hallazgos y comunicación (Borrador automático a EPS/IPS)',
          'Plan de mejora y seguimiento (Compromisos y alertas)',
          'Salud Pública (Ingesta SIVIGILA, mapas GIS y alertas territoriales)',
        ],
      },
      {
        numero: 'Propuesta 03',
        titulo: 'IVC Sanitario (Inspección, Vigilancia y Control)',
        sistemas: '1 sistema · 5 módulos',
        modulos: [
          'Base maestra de establecimientos y checklist por tipo',
          'Programación y visitas con asignación a inspectores',
          'Concepto sanitario y vigencia anual',
          'Integración y reconocimiento público "Negocio Más Confiable" con QR',
          'Dashboard de cobertura y cumplimiento sanitario',
        ],
      },
    ],
    canales: {
      correo: 'salud@giron-santander.gov.co',
      telefono: '+57 (607) 646 3030 Ext. 210',
      ubicacion: 'Calle 30 No. 25-66, Segundo Piso, Girón',
    },
  },
  {
    id: 'hacienda',
    slug: 'secretaria-hacienda',
    nombre: 'Secretaría de Hacienda',
    sigla: 'SHM',
    descripcion: 'Gestión tributaria, recaudo de impuestos municipales (Predial e ICA), cobro coactivo y emisión de estampillas digitales.',
    propuestasPDF: [
      {
        numero: 'Propuesta 04',
        titulo: 'Cobro Coactivo',
        sistemas: '2 sistemas · 7 módulos',
        modulos: [
          'Centralización de expedientes (Tránsito, Policía, Predial)',
          'Generación masiva de actos administrativos',
          'Trazabilidad y control de embargos y notificaciones',
          'Semaforización de términos y riesgo de prescripción',
        ],
      },
      {
        numero: 'Propuesta 06',
        titulo: 'Estampillas Digitales',
        sistemas: '2 sistemas · 6 módulos',
        modulos: [
          'Parametrización y generación de estampilla con código QR',
          'Vigencia y pago en línea con confirmación inmediata',
          'Distribución de recaudo (Pro-Cultura, Pro-Adulto Mayor)',
          'Carga masiva de actos y validación con firma digital',
        ],
      },
    ],
    canales: {
      correo: 'hacienda@giron-santander.gov.co',
      telefono: '+57 (607) 646 3030 Ext. 115',
      ubicacion: 'Palacio Municipal, Primer Piso, Ventanilla de Rentas',
    },
  },
  {
    id: 'transito',
    slug: 'secretaria-transito',
    nombre: 'Secretaría de Tránsito y Transporte',
    sigla: 'STT',
    descripcion: 'Regulación de la movilidad, señalización vial, inspección vehicular y administración del archivo digital de comparendos.',
    propuestasPDF: [
      {
        numero: 'Propuesta 03',
        titulo: 'Archivo de Tránsito y Notificaciones',
        sistemas: '2 sistemas · 5 módulos',
        modulos: [
          'Digitalización y organización de expedientes de comparendos',
          'Cierre del vacío de notificación a contraventores',
          'Integración con el Archivo Central del municipio',
          'Trazabilidad completa de trámites y conservación documental',
        ],
      },
    ],
    canales: {
      correo: 'transito@giron-santander.gov.co',
      telefono: '+57 (607) 646 3030 Ext. 301',
      ubicacion: 'Sede Operativa de Tránsito, Km 7 Vía Girón',
    },
  },
  {
    id: 'ordenamiento-territorial',
    slug: 'secretaria-ordenamiento-territorial',
    nombre: 'Secretaría de Ordenamiento Territorial',
    sigla: 'SOT',
    descripcion: 'Planeación del uso del suelo, esquema de ordenamiento territorial (EOT), control urbanístico y certificados de uso.',
    propuestasPDF: [
      {
        numero: 'Propuesta 07',
        titulo: 'Trámites de Ordenamiento Territorial',
        sistemas: '2 sistemas · 7 módulos',
        modulos: [
          'Catálogo digital de trámites con validación automática de requisitos',
          'Asistente de preclasificación normativa de solicitudes',
          'Generación documental de conceptos de uso de suelo',
          'Trazabilidad y validación a cargo de funcionario competente',
        ],
      },
    ],
    canales: {
      correo: 'ordenamiento@giron-santander.gov.co',
      telefono: '+57 (607) 646 3030 Ext. 240',
      ubicacion: 'Palacio Municipal, Tercer Piso',
    },
  },
  {
    id: 'seguridad',
    slug: 'secretaria-seguridad',
    nombre: 'Secretaría de Seguridad, Convivencia Ciudadana y Gestión del Riesgo',
    sigla: 'SSCG',
    descripcion: 'Orden público, convivencia ciudadana, coordinación con Policía Nacional, bomberos y reparto de querellas policivas.',
    propuestasPDF: [
      {
        numero: 'Propuesta 07',
        titulo: 'Reparto de Querellas y Comisarías',
        sistemas: '2 sistemas · 7 módulos',
        modulos: [
          'Recepción y validación de competencia administrativa',
          'Reparto automático por carga y especialidad a inspecciones',
          'Orientación ciudadana sobre requisitos de medidas de protección',
          'Priorización inmediata de situaciones sensibles de riesgo',
        ],
      },
    ],
    canales: {
      correo: 'seguridad@giron-santander.gov.co',
      telefono: '+57 (607) 646 3030 Ext. 180',
      ubicacion: 'Centro de Monitoreo y Gestión del Riesgo, Girón',
    },
  },
  {
    id: 'desarrollo-social',
    slug: 'secretaria-desarrollo-social',
    nombre: 'Secretaría de Desarrollo Social',
    sigla: 'SDS',
    descripcion: 'Programas de inclusión social, apoyo a víctimas del conflicto armado, adultos mayores, juventud y equidad de género.',
    propuestasPDF: [
      {
        numero: 'Propuesta 05',
        titulo: 'Mesa de Víctimas y Beneficios Sociales',
        sistemas: '1 sistema · 3 módulos',
        modulos: [
          'Registro de participación de miembros y actas de sesión',
          'Liquidación y control de valores a reconocer y auxilios',
          'Auditoría integral de pagos y transparencia',
        ],
      },
    ],
    canales: {
      correo: 'desarrollosocial@giron-santander.gov.co',
      telefono: '+57 (607) 646 3030 Ext. 225',
      ubicacion: 'Casa de la Cultura y Desarrollo Social, Girón',
    },
  },
  {
    id: 'gobierno',
    slug: 'secretaria-gobierno',
    nombre: 'Secretaría de Gobierno',
    sigla: 'SGM',
    descripcion: 'Gobernabilidad, comités interinstitucionales, juntas de acción comunal y comisiones de participación ciudadana.',
    propuestasPDF: [
      {
        numero: 'Propuesta 05',
        titulo: 'Comités y Actas Asistidas por IA',
        sistemas: '2 sistemas · 5 módulos',
        modulos: [
          'Captura y transcripción automática de audio y video de reuniones',
          'Generación de borradores de actas con revisión humana',
          'Seguimiento a compromisos de comités sociales (COMPOS, Justicia)',
          'Repositorio histórico consultable de decisiones públicas',
        ],
      },
    ],
    canales: {
      correo: 'gobierno@giron-santander.gov.co',
      telefono: '+57 (607) 646 3030 Ext. 104',
      ubicacion: 'Palacio Municipal, Segundo Piso',
    },
  },
  {
    id: 'educacion',
    slug: 'secretaria-educacion',
    nombre: 'Secretaría de Educación',
    sigla: 'SEM',
    descripcion: 'Garantía de la cobertura y calidad educativa en colegios públicos oficiales del municipio y programas de alimentación escolar (PAE).',
    propuestasPDF: [
      {
        numero: 'Propuesta 01',
        titulo: 'Agentes de IA para Gestión Educativa',
        sistemas: 'Multisecretarial · Módulos de atención',
        modulos: [
          'Clasificación automática de solicitudes de cupos y traslados',
          'Atención y respuesta asistida a la comunidad educativa',
          'Trazabilidad de requerimientos PAE y mantenimiento escolar',
        ],
      },
    ],
    canales: {
      correo: 'educacion@giron-santander.gov.co',
      telefono: '+57 (607) 646 3030 Ext. 215',
      ubicacion: 'Calle 30 No. 25-66, Tercer Piso',
    },
  },
  {
    id: 'infraestructura',
    slug: 'secretaria-infraestructura',
    nombre: 'Secretaría de Infraestructura',
    sigla: 'SIM',
    descripcion: 'Mantenimiento vial, obras públicas municipales, alumbrado público y ejecución de proyectos de desarrollo urbano.',
    propuestasPDF: [
      {
        numero: 'Propuesta 01',
        titulo: 'Agentes de IA para Reportes de Obras y Vías',
        sistemas: 'Multisecretarial · Módulos de atención',
        modulos: [
          'Recepción y georreferenciación de solicitudes de mantenimiento vial',
          'Monitoreo de estado de vías y alumbrado en barrios de Girón',
          'Seguimiento y respuesta transparente a la ciudadanía',
        ],
      },
    ],
    canales: {
      correo: 'infraestructura@giron-santander.gov.co',
      telefono: '+57 (607) 646 3030 Ext. 250',
      ubicacion: 'Edificio Obras Públicas, Girón',
    },
  },
  {
    id: 'planeacion',
    slug: 'secretaria-planeacion',
    nombre: 'Secretaría de Planeación',
    sigla: 'SPM',
    descripcion: 'Estratificación socioeconómica, Sisbén, banco de proyectos de inversión municipal y seguimiento al Plan de Desarrollo.',
    propuestasPDF: [
      {
        numero: 'Propuesta 04',
        titulo: 'Gestión Documental y Archivo de Proyectos',
        sistemas: '1 sistema · 6 módulos',
        modulos: [
          'Digitalización y extracción de metadatos de expedientes',
          'Consulta y expedición digital de certificados de estratificación',
          'Trazabilidad y control mediante firmas e integridad hash',
        ],
      },
    ],
    canales: {
      correo: 'planeacion@giron-santander.gov.co',
      telefono: '+57 (607) 646 3030 Ext. 230',
      ubicacion: 'Palacio Municipal, Segundo Piso',
    },
  },
  {
    id: 'cultura-turismo-deporte',
    slug: 'secretaria-cultura-turismo-deporte',
    nombre: 'Secretaría de Cultura, Turismo y Deporte',
    sigla: 'SCTD',
    descripcion: 'Promoción del patrimonio histórico colonial de Girón como Monumento Nacional, fomento del turismo y escuelas deportivas.',
    propuestasPDF: [
      {
        numero: 'Propuesta 06',
        titulo: 'Fondo Mixto y Estampilla Pro-Cultura y Deporte',
        sistemas: '2 sistemas · Integración municipal',
        modulos: [
          'Verificación de destinación específica del recaudo Pro-Cultura',
          'Agenda cultural y turística del Monumento Nacional',
          'Inscripción ciudadana en programas formativos y deportivos',
        ],
      },
    ],
    canales: {
      correo: 'cultura@giron-santander.gov.co',
      telefono: '+57 (607) 646 3030 Ext. 310',
      ubicacion: 'Casa de la Cultura Francisco Mantilla de los Ríos',
    },
  },
]
