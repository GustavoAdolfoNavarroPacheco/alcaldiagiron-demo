import { useParams, Link } from 'react-router-dom'
import { SECRETARIAS } from '../../data/secretarias'

import SecretariaSaludView from './SecretariaSaludView'
import SecretariaHaciendaView from './secretarias/SecretariaHaciendaView'
import SecretariaTransitoView from './secretarias/SecretariaTransitoView'
import SecretariaOrdenamientoView from './secretarias/SecretariaOrdenamientoView'
import SecretariaSeguridadView from './secretarias/SecretariaSeguridadView'
import SecretariaDesarrolloView from './secretarias/SecretariaDesarrolloView'
import SecretariaGobiernoView from './secretarias/SecretariaGobiernoView'
import SecretariaEducacionView from './secretarias/SecretariaEducacionView'
import SecretariaInfraestructuraView from './secretarias/SecretariaInfraestructuraView'
import SecretariaPlaneacionView from './secretarias/SecretariaPlaneacionView'
import SecretariaCulturaView from './secretarias/SecretariaCulturaView'

export default function SecretariaDetalle() {
  const { slug } = useParams<{ slug: string }>()
  const secretaria = SECRETARIAS.find((s) => s.slug === slug)

  if (!secretaria) {
    return (
      <div className="rounded-2xl border border-ink/8 bg-paper-card p-8 text-center shadow-card">
        <h2 className="font-display text-xl font-semibold text-ink">Secretaría no encontrada</h2>
        <p className="mt-2 text-sm text-ink-faint">
          La dependencia solicitada no figura en la estructura actual del portal.
        </p>
        <Link to="/ciudadano" className="btn-vinotinto mt-6 inline-block text-xs">
          Volver al Inicio
        </Link>
      </div>
    )
  }

  // Despacho a la vista interactiva según la secretaría seleccionada
  switch (slug) {
    case 'secretaria-salud':
      return <SecretariaSaludView />
    case 'secretaria-hacienda':
      return <SecretariaHaciendaView />
    case 'secretaria-transito':
      return <SecretariaTransitoView />
    case 'secretaria-ordenamiento-territorial':
      return <SecretariaOrdenamientoView />
    case 'secretaria-seguridad':
      return <SecretariaSeguridadView />
    case 'secretaria-desarrollo-social':
      return <SecretariaDesarrolloView />
    case 'secretaria-gobierno':
      return <SecretariaGobiernoView />
    case 'secretaria-educacion':
      return <SecretariaEducacionView />
    case 'secretaria-infraestructura':
      return <SecretariaInfraestructuraView />
    case 'secretaria-planeacion':
      return <SecretariaPlaneacionView />
    case 'secretaria-cultura-turismo-deporte':
      return <SecretariaCulturaView />
    default:
      return null
  }
}
