import { useState, type FormEvent } from 'react'
import type { EstadoPQRS, PQRS } from '../../types'
import { getPQRS } from '../../data/storage'
import { formatFecha, diasRestantes } from '../../data/format'

function estadoActual(pqrs: PQRS): EstadoPQRS {
  if (pqrs.estado === 'Resuelta') return 'Resuelta'
  return diasRestantes(pqrs.fechaLimite) < 0 ? 'Vencida' : 'En proceso'
}

const ESTADO_STYLE: Record<EstadoPQRS, { label: string; className: string }> = {
  'En proceso': { label: 'En proceso', className: 'border-semaforo-amarillo/40 bg-semaforo-amarillo/10 text-semaforo-amarillo' },
  Vencida: { label: 'Vencida', className: 'border-semaforo-rojo/40 bg-semaforo-rojo/10 text-semaforo-rojo' },
  Resuelta: { label: 'Resuelta', className: 'border-semaforo-verde/40 bg-semaforo-verde/10 text-semaforo-verde' },
}

export default function ConsultarEstado() {
  const [radicado, setRadicado] = useState('')
  const [buscado, setBuscado] = useState<PQRS | null | undefined>(undefined)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const encontrado = getPQRS().find(
      (p) => p.radicado.toLowerCase() === radicado.trim().toLowerCase(),
    )
    setBuscado(encontrado ?? null)
  }

  return (
    <div className="mx-auto max-w-xl animate-fade-up">
      <p className="eyebrow text-girverde-deep">Consulta de estado</p>
      <h1 className="mt-3 font-display text-3xl font-medium text-ink">
        ¿En qué va su trámite?
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-faint">
        Ingrese el número de radicado que recibió al presentar su PQRS.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          value={radicado}
          onChange={(e) => setRadicado(e.target.value)}
          placeholder="PQRS-2026-000118"
          className="field flex-1 font-mono"
        />
        <button type="submit" className="btn-primary">
          Consultar
        </button>
      </form>

      {buscado === null && (
        <p className="mt-8 animate-fade-up rounded-xl border-l-4 border-semaforo-rojo bg-semaforo-rojo/5 py-3 pl-4 pr-4 text-sm text-ink-faint">
          No encontramos ninguna solicitud con el radicado{' '}
          <span className="font-mono text-ink">{radicado}</span>. Verifique el
          número e intente nuevamente.
        </p>
      )}

      {buscado && (
        <div className="mt-10 animate-fade-up rounded-2xl border border-ink/8 bg-paper-card p-6 shadow-card sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs text-ink-faint">{buscado.radicado}</p>
              <h2 className="mt-1 font-display text-xl font-medium text-ink">{buscado.asunto}</h2>
            </div>
            <span
              className={`shrink-0 rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide ${ESTADO_STYLE[estadoActual(buscado)].className}`}
            >
              {ESTADO_STYLE[estadoActual(buscado)].label}
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-y-3 border-t border-ink/10 pt-6 text-sm">
            <dt className="text-ink-faint">Tipo</dt>
            <dd className="text-ink">{buscado.tipo}</dd>
            <dt className="text-ink-faint">Dependencia</dt>
            <dd className="text-ink">{buscado.dependencia}</dd>
            <dt className="text-ink-faint">Fecha de radicación</dt>
            <dd className="text-ink">{formatFecha(buscado.fechaRadicacion)}</dd>
            <dt className="text-ink-faint">Término de respuesta</dt>
            <dd className="text-ink">{formatFecha(buscado.fechaLimite)}</dd>
            {buscado.fechaRespuesta && (
              <>
                <dt className="text-ink-faint">Fecha de respuesta</dt>
                <dd className="text-ink">{formatFecha(buscado.fechaRespuesta)}</dd>
              </>
            )}
          </dl>
        </div>
      )}
    </div>
  )
}
