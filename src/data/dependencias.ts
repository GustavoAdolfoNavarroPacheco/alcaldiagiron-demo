export const DEPENDENCIAS = [
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

export const DEPENDENCIA_A_SLUG: Record<string, string> = {
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

export const PLAZO_DIAS_PQRS: Record<string, number> = {
  Petición: 15,
  Queja: 15,
  Reclamo: 15,
  Sugerencia: 15,
  Denuncia: 30,
}
