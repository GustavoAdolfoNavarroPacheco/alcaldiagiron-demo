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
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <h2 className="text-lg font-bold text-slate-900">Secretaría no encontrada</h2>
        <p className="mt-1.5 text-xs text-slate-500">
          La dependencia solicitada no figura en la estructura actual del portal.
        </p>
        <Link
          to="/ciudadano"
          className="mt-4 inline-flex items-center rounded-lg bg-vinotinto px-4 py-2 text-xs font-semibold text-white hover:bg-vinotinto-deep transition-colors"
        >
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
